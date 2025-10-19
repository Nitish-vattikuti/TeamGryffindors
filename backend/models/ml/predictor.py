# backend/models/ml/predictor.py
import pickle
import numpy as np
import os
import time
from utils.root_cause_analysis import analyze_root_cause
from utils.alerts import send_slack_alert, send_email_alert, log_alert


MODEL_PATH = "models/ml/anomaly_model.pkl"
if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, "rb") as f:
            anomaly_model = pickle.load(f)
    except Exception:
        anomaly_model = None
else:
    anomaly_model = None

previous_risk_score = 50.0
last_update_time = time.time()

# Thresholds
ALERT_RISK_THRESHOLD = 85.0  # risk_score ≥ triggers RCA/alerts
ALERT_COOLDOWN = 180  # seconds (3 mins)
last_alert_time = 0


def compute_risk_score(cpu, mem, disk):
    """Weighted risk score"""
    cpu = float(cpu or 0)
    mem = float(mem or 0)
    disk = float(disk or 0)

    risk = (0.5 * cpu + 0.3 * mem + 0.2 * disk)
    return round(max(0.0, min(risk, 100.0)), 2)


def model_based_anomaly(cpu, mem, disk):
    """Use IsolationForest if available; fallback to heuristic"""
    if anomaly_model is not None:
        try:
            x = np.array([[cpu, mem, disk]])
            pred = anomaly_model.predict(x)[0]  # -1 anomaly, 1 normal
            return pred == -1
        except Exception:
            pass
    # Heuristic — anomaly only if values are *extremely high*
    return cpu > 90 or mem > 90 or disk > 90


def evaluate_and_alert(metrics, source="Local"):
    """Computes risk, runs RCA, triggers alert if needed."""
    global last_alert_time

    cpu = float(metrics.get("cpu", 0))
    mem = float(metrics.get("mem", 0))
    disk = float(metrics.get("disk", 0))
    rpm = metrics.get("requests_per_min", 0)

    risk_score = compute_risk_score(cpu, mem, disk)
    anomaly = model_based_anomaly(cpu, mem, disk)

    result = {
        "risk_score": risk_score,
        "anomaly": bool(anomaly),
        "metrics": {"cpu": cpu, "mem": mem, "disk": disk, "requests_per_min": rpm},
        "root_cause": None,
    }

    # Trigger only if genuinely risky AND cooldown elapsed
    current_time = time.time()
    should_alert = (anomaly or risk_score >= ALERT_RISK_THRESHOLD) and (
        current_time - last_alert_time > ALERT_COOLDOWN
    )

    if should_alert:
        root_cause_text = analyze_root_cause(result["metrics"])
        result["root_cause"] = root_cause_text

        alert_msg = (
            f"🚨 [InfraSight] {source} anomaly detected!\n\n"
            f"CPU: {cpu:.1f}% | MEM: {mem:.1f}% | DISK: {disk:.1f}%\n"
            f"Risk Score: {risk_score}\n\n"
            f"Root Cause: {root_cause_text}"
        )

        try:
            log_alert(source, "InfraSight - High Risk", alert_msg, "critical", root_cause=root_cause_text)
        except Exception as e:
            print("❌ Failed to log alert:", e)

        try:
            send_slack_alert(alert_msg, root_cause=root_cause_text)
        except Exception as e:
            print("❌ Slack send error:", e)
        try:
            send_email_alert("🚨 InfraSight High Risk", alert_msg, root_cause=root_cause_text)
        except Exception as e:
            print("❌ Email send error:", e)

        last_alert_time = current_time

    else:
        # Normal state (log once every cooldown)
        if current_time - last_alert_time > ALERT_COOLDOWN:
            log_alert(source, f"{source} Normal", f"Stable - Risk {risk_score}%", "info")
            last_alert_time = current_time

    return result
