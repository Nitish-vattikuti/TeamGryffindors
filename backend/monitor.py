import time
import psutil
import requests

BACKEND_URL = "http://localhost:5001/api/v1/predict"

def get_system_metrics():
    cpu = psutil.cpu_percent(interval=1)
    mem = psutil.virtual_memory().percent
    disk = psutil.disk_usage("/").percent
    return {"cpu": cpu, "mem": mem, "disk": disk}

def monitor_system():
    print("🚀 InfraSight Live Monitoring Started...")
    while True:
        metrics = get_system_metrics()
        try:
            res = requests.post(
                BACKEND_URL,
                json={"metrics": metrics},
                timeout=5
            )
            data = res.json()
            print(f"[{time.strftime('%H:%M:%S')}] CPU={metrics['cpu']} MEM={metrics['mem']} DISK={metrics['disk']} | Risk={data['risk_score']} | Anomaly={data['anomaly']}")
        except Exception as e:
            print("❌ Error connecting to backend:", e)
        time.sleep(10)  # check every 10 seconds

if __name__ == "__main__":
    monitor_system()
