# backend/utils/alerts.py
import os
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from datetime import datetime

# Import database + Alert model
from models.db import db
from models.orm import Alert

load_dotenv()

# --- Helper: Save alerts in DB (now accepts root_cause) ---
def log_alert(source, subject, message, severity="warning", root_cause=None):
    try:
        alert = Alert(
            source=source,
            subject=subject,
            message=message,
            root_cause=root_cause,
            severity=severity,
            timestamp=datetime.utcnow()
        )
        db.session.add(alert)
        db.session.commit()
        print(f"🧾 Logged {source} alert in DB at {alert.timestamp}")
    except Exception as e:
        print(f"❌ Failed to log alert to DB: {e}")

# --- Slack Alert ---
def send_slack_alert(message, root_cause=None):
    webhook = os.getenv("SLACK_WEBHOOK_URL")
    if not webhook:
        print("[⚠️] No Slack webhook found in .env. Printing alert instead:")
        print("[Slack] Message:", message)
        if root_cause:
            print("[Slack] Root cause:", root_cause)
        log_alert("Slack", "Slack Alert (Demo)", message, "info", root_cause=root_cause)
        return

    try:
        # Post concise message plus append root cause as attachment-like text
        payload = {"text": message}
        requests.post(webhook, json=payload)
        print("✅ Slack alert sent successfully!")
        log_alert("Slack", "InfraSight Alert", message, "critical", root_cause=root_cause)
    except Exception as e:
        print(f"❌ Slack alert error: {e}")
        log_alert("Slack", "Slack Alert Failed", str(e), "error", root_cause=str(e))

# --- Email Alert ---
def send_email_alert(subject, body, root_cause=None):
    EMAIL = os.getenv("ALERT_EMAIL")
    PASSWORD = os.getenv("EMAIL_PASSWORD")
    TO_EMAIL = os.getenv("TO_EMAIL")

    # If credentials missing, log and fallback to console + DB log
    if not EMAIL or not PASSWORD or not TO_EMAIL:
        print("[⚠️] Missing email configuration in .env. Printing alert instead:")
        print(f"[Email] Subject: {subject}\nBody: {body}")
        if root_cause:
            print(f"[Email] Root Cause:\n{root_cause}")
        log_alert("Email", subject, body, "info", root_cause=root_cause)
        return

    # Build nicely formatted email including root cause
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL
        msg["To"] = TO_EMAIL
        msg["Subject"] = subject

        content = body
        if root_cause:
            content += "\n\n---- Root Cause Analysis ----\n" + str(root_cause)

        msg.attach(MIMEText(content, "plain"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL, PASSWORD)
            server.send_message(msg)

        print("✅ Email alert sent successfully!")
        log_alert("Email", subject, body, "critical", root_cause=root_cause)
    except Exception as e:
        print(f"❌ Email alert error: {e}")
        log_alert("Email", "Email Alert Failed", str(e), "error", root_cause=str(e))

