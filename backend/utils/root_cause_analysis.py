# backend/utils/root_cause_analysis.py

def analyze_root_cause(metrics, recent_logs=None, events=None):
    cpu = float(metrics.get("cpu") or 0)
    mem = float(metrics.get("mem") or 0)
    disk = float(metrics.get("disk") or 0)
    rpm = metrics.get("requests_per_min")

    try:
        rpm = float(rpm) if rpm is not None else 0
    except Exception:
        rpm = 0

    causes = []

    if cpu >= 95:
        causes.append("Severe CPU overload: sustained >95% CPU. Likely causes: runaway process, infinite loop, heavy batch job, or DDoS-like traffic.")
    elif cpu >= 85:
        causes.append("High CPU usage (85–95%). Possible causes: inefficient code, unoptimized workloads, or increased user load.")
    elif cpu >= 70:
        causes.append("Moderate CPU usage — monitor for growth trends.")

    if mem >= 90:
        causes.append("Critical memory usage (>90%). Likely memory leak or too many concurrent processes.")
    elif mem >= 75:
        causes.append("High memory usage — check caches or large dataset operations.")

    if disk >= 90:
        causes.append("Disk nearly full (>90%). Logs, snapshots, or backups may need cleanup.")
    elif disk >= 80:
        causes.append("High disk usage — monitor for log growth.")

    if rpm > 5000:
        causes.append("Traffic spike detected — potential load surge or automated bot traffic.")

    if events and events.get("recent_deploy"):
        causes.insert(0, "Recent deployment detected — review last commit or pipeline for regressions.")

    if not causes:
        causes.append("No significant anomalies found — system operating normally.")

    return "\n".join(f"- {c}" for c in causes)
