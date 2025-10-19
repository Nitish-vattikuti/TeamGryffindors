from flask import Flask, jsonify, request
from flask_cors import CORS
from models.db import db
from models.orm import Host, Metric ,Alert
from config import Config
from datetime import datetime
from models.ml.predictor import evaluate_and_alert
from utils.alerts import send_slack_alert, send_email_alert
from aws_metrics import get_ec2_metrics
import smtplib
from email.mime.text import MIMEText
import requests
from dotenv import load_dotenv
import os
import time 

print(os.getenv("SLACK_WEBHOOK_URL"))
print(os.getenv("ALERT_EMAIL"))
print(os.getenv("EMAIL_PASSWORD"))
print(os.getenv("TO_EMAIL"))

load_dotenv()

def send_slack_alert(message):
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")
    if not webhook_url:
        print("⚠️ No Slack webhook URL found.")
        return
    try:
        payload = {"text": message}
        response = requests.post(webhook_url, json=payload)
        if response.status_code == 200:
            print("✅ Slack alert sent successfully!")
        else:
            print("❌ Slack alert failed:", response.text)
    except Exception as e:
        print("❌ Slack alert error:", e)


def send_email_alert(subject, body):
    sender = os.getenv("ALERT_EMAIL")
    password = os.getenv("EMAIL_PASSWORD")
    receiver = os.getenv("TO_EMAIL")

    if not (sender and password and receiver):
        print("⚠️ Email credentials missing in .env")
        return

    try:
        msg = MIMEText(body, "plain")
        msg["Subject"] = subject
        msg["From"] = sender
        msg["To"] = receiver

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender, password)
            server.sendmail(sender, receiver, msg.as_string())

        print("✅ Email alert sent successfully!")
    except Exception as e:
        print("❌ Email alert error:", e)

# Initialize the Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize the database connection
db.init_app(app)

# -------------------------------------------------------
# DEFAULT ROUTE - Check if the server is running
# -------------------------------------------------------
@app.route("/")
def home():
    return jsonify({"message": "InfraSight Backend Running ✅"})

# -------------------------------------------------------
# ADD METRICS - Save server metrics to the database
# -------------------------------------------------------
@app.route("/api/v1/metrics", methods=["POST"])
def add_metric():
    data = request.get_json()

    # Validate input
    if not data or "host_id" not in data or "metrics" not in data:
        return jsonify({"error": "Missing host_id or metrics"}), 400

    host_id = data["host_id"]
    metrics = data["metrics"]

    # Create host if it doesn't exist
    host = Host.query.filter_by(host_id=host_id).first()
    if not host:
        host = Host(host_id=host_id, name=host_id)
        db.session.add(host)
        db.session.commit()

    # Create new metric record
    m = Metric(
        host_id=host_id,
        cpu=metrics.get("cpu"),
        mem=metrics.get("mem"),
        disk=metrics.get("disk"),
        requests_per_min=metrics.get("requests_per_min")
    )
    db.session.add(m)
    db.session.commit()

    return jsonify({"status": "ok"}), 201

# -------------------------------------------------------
# LIST HOSTS - Fetch all registered hosts
# -------------------------------------------------------
@app.route("/api/v1/hosts", methods=["GET"])
def list_hosts():
    hosts = Host.query.all()
    return jsonify([{"host_id": h.host_id, "name": h.name} for h in hosts])
# -------------------------------------------------------
# AI PREDICTION ENDPOINT
# -------------------------------------------------------
@app.route("/api/v1/predict", methods=["POST"])
def predict_failure():
    data = request.get_json()
    if not data or "metrics" not in data:
        return jsonify({"error": "Missing metrics"}), 400

    metrics = data["metrics"]
    # use new evaluate_and_alert which also does RCA + alerts
    result = evaluate_and_alert(metrics, source="Local")

    return jsonify(result)


last_alert_time = 0
ALERT_COOLDOWN = 300  # 5 minutes

@app.route('/api/v1/aws-predict', methods=['GET'])
def aws_predict():
    global last_alert_time
    metrics = get_ec2_metrics()
    result = evaluate_and_alert(metrics, source="AWS")


    current_time = time.time()

    if result["anomaly"] and (current_time - last_alert_time > ALERT_COOLDOWN):
        alert_message = (
            f"⚠️ *InfraSight Alert: AWS Anomaly Detected!*\n\n"
            f"CPU: {metrics['cpu']}%\nMemory: {metrics['mem']}%\nDisk: {metrics['disk']}\n"
            f"Risk Score: {result['risk_score']}\n"
        )
        send_slack_alert(alert_message)
        send_email_alert("🚨 InfraSight AWS Alert", alert_message)
        last_alert_time = current_time  # ✅ update cooldown time

    return jsonify({
        "source": "AWS CloudWatch",
        "metrics": metrics,
        "prediction": result
    })

# -------------------------------------------------------
# GET ALERTS - Fetch all alerts
# -------------------------------------------------------
@app.route("/api/v1/alerts", methods=["GET"])
def get_alerts():
    alerts = Alert.query.order_by(Alert.timestamp.desc()).limit(10).all()
    data = [
        {
            "id": a.id,
            "source": a.source,
            "subject": a.subject,
            "message": a.message,
            "severity": a.severity,
            "timestamp": a.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for a in alerts
    ]
    return jsonify(data)

# -------------------------------------------------------
# MAIN ENTRY POINT
# -------------------------------------------------------
if __name__ == "__main__":
    # Create database tables if not already created
    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=5001, debug=True)
