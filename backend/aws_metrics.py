import boto3
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

def get_ec2_metrics():
    client = boto3.client("cloudwatch", region_name=os.getenv("MY_AWS_REGION"))
    instance_id = os.getenv("MY_AWS_INSTANCE_ID")

    metrics_to_fetch = {
        "CPUUtilization": "Average",
        "DiskReadOps": "Sum",
        "NetworkIn": "Sum"
    }

    metrics = {}
    for metric_name, stat in metrics_to_fetch.items():
        response = client.get_metric_statistics(
            Namespace="AWS/EC2",
            MetricName=metric_name,
            Dimensions=[{"Name": "InstanceId", "Value": instance_id}],
            StartTime=datetime.utcnow() - timedelta(minutes=10),
            EndTime=datetime.utcnow(),
            Period=300,
            Statistics=[stat],
        )
        datapoints = response.get("Datapoints", [])
        metrics[metric_name] = round(datapoints[-1][stat], 2) if datapoints else 0

    # Map to our prediction format
    return {
        "cpu": metrics.get("CPUUtilization", 0),
        "mem": 60.0,  # placeholder (CloudWatch agent can add real RAM)
        "disk": metrics.get("DiskReadOps", 0)
    }
