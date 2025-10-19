import numpy as np
from sklearn.ensemble import IsolationForest
import pickle
import os

# Simulated random system performance data (CPU, memory, disk)
X = np.random.uniform(low=10, high=90, size=(1000, 3))

# Train IsolationForest (detects anomalies)
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X)

# Save model to disk
os.makedirs("models/ml", exist_ok=True)
with open("models/ml/anomaly_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Anomaly detection model trained and saved as anomaly_model.pkl")
