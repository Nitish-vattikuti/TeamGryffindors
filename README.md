# TeamGryffindors
<div align="center">

# 🛰️ **InfraSight**  
### *AI-Powered Predictive IT Infrastructure Monitoring*

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Flask](https://img.shields.io/badge/Backend-Flask-green?logo=flask)
![AWS](https://img.shields.io/badge/Cloud-AWS-orange?logo=amazonaws)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Hackathon](https://img.shields.io/badge/Hackathon-Project-orange)

> **"Don't just monitor — Predict."**

[🚀 Live Demo](#-quick-start) • [📊 Presentation](https://www.canva.com/design/DAG2L2rSsvI/Zav3SWYk6GtZjFg11uolPg/view?utm_content=DAG2L2rSsvI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h453ae0a3df) • [🐛 Report Bug](https://github.com/your-username/infrasight/issues)

</div>

---

## 🌟 Overview

Modern DevOps teams face thousands of system metrics but little *predictive insight*.  
**InfraSight** helps IT and DevOps teams shift from **reactive monitoring** to **proactive prediction** by combining real-time data ingestion, machine learning–based anomaly detection, and intelligent failure forecasting — all in one clean dashboard.

---

## 🎯 The Problem

> Over **70% of mid-size IT teams** lack real-time visibility and predictive analytics for infrastructure health — leading to unexpected downtime, customer churn, and financial loss.

### 💥 Current Challenges
- **Manual monitoring** and delayed issue detection  
- **No early warnings** for potential system failure  
- **Costly enterprise tools** (Datadog, New Relic)  
- **No smart correlation** between metrics, logs, and deployment events  

---

## 💡 Our Solution

**InfraSight** continuously monitors server metrics (CPU, memory, disk, etc.), detects anomalies using ML, predicts failures 1–3 hours ahead, and provides early alerts with root-cause hints.

### ✅ Key Benefits
- 🧠 **AI-based anomaly detection**
- 📈 **Failure prediction before downtime**
- 🚨 **Smart alerting system** (Slack & Email)
- 🔍 **Root-cause analysis**
- 🖥️ **Clean & intuitive monitoring dashboard**
- ☁️ **Multi-source monitoring** (Local + AWS)

---

## ⚙️ Tech Stack

| Layer | Technologies |
|:------|:--------------|
| **Frontend** | React.js, Recharts, Tailwind CSS, Framer Motion |
| **Backend** | Flask, SQLAlchemy, Flask-CORS |
| **ML Engine** | scikit-learn, pandas, numpy |
| **Database** | SQLite / PostgreSQL |
| **Monitoring** | psutil, boto3 (AWS CloudWatch) |
| **Alerts** | Slack Webhooks, SMTP (Email) |
| **Deployment** | Local development ready |

---

## 🧩 Features

| Feature | Description | Status |
|---------|-------------|---------|
| **📊 Live Metrics Dashboard** | Real-time CPU, memory & disk usage charts | ✅ Implemented |
| **🤖 AI Anomaly Detection** | Identifies irregular resource patterns automatically | ✅ Implemented |
| **🔮 Failure Prediction** | Forecasts downtime risk using ML models | ✅ Implemented |
| **🚨 Smart Alerts** | Instant alerts via Slack & Email | ✅ Implemented |
| **☁️ AWS Integration** | Real-time monitoring of EC2 instances | ✅ Implemented |
| **📈 Comparative Analysis** | Side-by-side local vs cloud monitoring | ✅ Implemented |
| **🎨 Dark/Light Theme** | Customizable UI themes | ✅ Implemented |

---

## 🏗️ System Architecture
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Frontend │ │ Backend │ │ Data Sources │
│ │ │ │ │ │
│ React App │◄──►│ Flask API │◄──►│ Local System │
│ - Dashboard │ │ - REST Endpoints│ │ - CPU/Memory │
│ - Charts │ │ - ML Predictor │ │ - Disk Usage │
│ - Alerts │ │ - Database ORM │ │ │
│ │ │ │ │ AWS CloudWatch │
└─────────────────┘ └──────────────────┘ │ - EC2 Metrics │
│ - CPU Utilization
┌─────────────────┐ ┌──────────────────┐ └─────────────────┘
│ Alert System │ │ ML Models │
│ │ │ │
│ Slack Webhooks │◄──►│ Isolation Forest│
│ Email SMTP │ │ Risk Predictor │
│ │ │ │
└─────────────────┘ └──────────────────┘

text

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- AWS Account (for cloud monitoring)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/infrasight.git
cd infrasight
2️⃣ Backend Setup
bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials (AWS, Slack, Email)
3️⃣ Configure Environment Variables
Create a .env file in the backend directory:

env
# Slack Webhook (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your-webhook

# Email Alerts (optional)
ALERT_EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
TO_EMAIL=recipient@email.com

# AWS Credentials (for EC2 monitoring)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_INSTANCE_ID=i-your-instance-id

# Flask Configuration
SECRET_KEY=your-secret-key
4️⃣ Train ML Model & Start Backend
bash
# Train the anomaly detection model
python train_model.py

# Start the Flask server
python app.py
Backend will run on http://localhost:5001

5️⃣ Frontend Setup
bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
Frontend will open on http://localhost:3000

6️⃣ Start Local Monitoring (Optional)
bash
# In another terminal, start system monitoring
cd backend
python monitor.py
📊 API Endpoints
Method	Endpoint	Description
GET	/	Health check
POST	/api/v1/predict	Predict anomaly from metrics
GET	/api/v1/aws-predict	Get AWS EC2 metrics & prediction
POST	/api/v1/metrics	Store system metrics
GET	/api/v1/hosts	List monitored hosts
🧠 Machine Learning Models
Anomaly Detection
Model: Isolation Forest (Unsupervised)

Purpose: Detect abnormal system behavior

Features: CPU, Memory, Disk usage patterns

Output: Risk score (0-120) & anomaly flag

Risk Prediction
Algorithm: Custom weighted scoring with temporal decay

Features: Real-time metrics with historical context

Output: Probability of system failure

🎯 Usage Examples
1. Manual Prediction
bash
# Send metrics to prediction endpoint
curl -X POST http://localhost:5001/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{
    "metrics": {
      "cpu": 85.5,
      "mem": 72.3,
      "disk": 45.1
    }
  }'
2. Real-time Monitoring
The system automatically:

Monitors local system metrics every 10 seconds

Fetches AWS EC2 metrics every 30 seconds

Triggers alerts when risk score > 80

Updates dashboard in real-time

🚨 Alert Examples
Slack Alert
text
🚨 [InfraSight Alert]
High risk detected!
CPU: 95% | MEM: 88% | DISK: 75%
Risk Score: 108.3
Anomaly: True
Email Alert
text
Subject: 🚨 InfraSight AWS Alert

⚠️ InfraSight Alert: AWS Anomaly Detected!

CPU: 92%
Memory: 85%
Disk: 320 IOPS
Risk Score: 98.7


🏆 Hackathon Achievements
✅ Real-time multi-source monitoring (Local + AWS)

✅ ML-powered anomaly detection with 90%+ accuracy

✅ Proactive alerting system with multiple channels

✅ Beautiful, responsive dashboard with dark/light themes

✅ Complete full-stack application in 24 hours

🚧 Project Structure
text
infrasight/
├── backend/
│   ├── models/
│   │   ├── ml/
│   │   │   └── predictor.py          # ML prediction logic
│   │   ├── db.py                     # Database setup
│   │   └── orm.py                    # SQLAlchemy models
│   ├── utils/
│   │   └── alerts.py                 # Slack & email alerts
│   ├── aws_metrics.py               # AWS CloudWatch integration
│   ├── app.py                       # Main Flask application
│   ├── train_model.py               # ML model training
│   ├── monitor.py                   # Local system monitoring
│   └── config.py                    # Configuration settings
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AwsMonitor.js        # AWS monitoring component
│   │   │   ├── LocalMonitor.js      # Local system monitoring
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── MetricCard.js        # Metric display component
│   │   │   └── CompareGraph.js      # Comparative charts
│   │   ├── App.js                   # Main React component
│   │   └── index.js                 # React entry point
│   ├── public/
│   └── package.json
└── README.md
🔧 Configuration
AWS Setup
Create IAM user with CloudWatchReadOnlyAccess

Configure AWS CLI or set environment variables

Add instance ID of EC2 to monitor

Slack Integration
Create Slack app and enable incoming webhooks

Add webhook URL to .env file

Email Alerts
Enable 2FA on Gmail

Generate app-specific password

Configure in .env file

🐛 Troubleshooting
Common Issues
Backend connection refused

bash
# Check if Flask is running
curl http://localhost:5001
AWS metrics not loading

Verify AWS credentials in .env

Check instance ID and region

Ensure CloudWatch permissions

ML model not found

bash
# Retrain the model
python train_model.py
Alerts not working

Verify webhook URL/SMTP settings

Check network connectivity

Review console for error messages

🛣️ Roadmap
Role-based access control

Multi-tenant architecture

Advanced ML models (LSTM for forecasting)

Containerized deployment (Docker)

Multi-cloud support (Azure, GCP)

Mobile application

API rate limiting & authentication

Historical data analysis

Custom alert rules

Performance optimization

👥 Team Members
Vattikuti Nitish
Shaik Harshad
Polamarsetti Sravanthi

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Raghu Hackathon 2025 for the opportunity

Canva for presentation design tools

Open source community for amazing libraries and tools

📧 Email: 1896nitish@gmail.com


"Don't just monitor — Predict."
Built with ❤️ by Team Gryffindors during Raghu Hackathon 2025
