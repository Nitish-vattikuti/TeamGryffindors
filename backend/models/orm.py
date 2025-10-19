# backend/models/orm.py
from datetime import datetime
from .db import db

# Table to store details about each monitored server (host)
class Host(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Table to store performance metrics of each host
class Metric(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.String(50), db.ForeignKey('host.host_id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    cpu = db.Column(db.Float)              # CPU usage %
    mem = db.Column(db.Float)              # Memory usage %
    disk = db.Column(db.Float)             # Disk usage %
    requests_per_min = db.Column(db.Float) # Requests handled per minute

# Alert table to save notifications + root cause
class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(50))       # 'Slack' or 'Email' or 'System'
    subject = db.Column(db.String(200))
    message = db.Column(db.Text)
    root_cause = db.Column(db.Text, nullable=True)  # NEW: RCA text
    severity = db.Column(db.String(20), default="warning")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
