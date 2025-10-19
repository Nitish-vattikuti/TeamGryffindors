import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AwsDashboard() {
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [latest, setLatest] = useState(null);

  // Fetch AWS metrics every 10 seconds
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/v1/aws-predict");
        const data = res.data;
        setLatest(data);
        setMetricsHistory((prev) => [
          ...prev.slice(-10), // keep last 10 records
          {
            time: new Date().toLocaleTimeString(),
            cpu: data.metrics.cpu,
            mem: data.metrics.mem,
            disk: data.metrics.disk,
          },
        ]);
      } catch (err) {
        console.error("Error fetching AWS metrics:", err.message);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">☁️ InfraSight: AWS Live Dashboard</h1>

      {latest && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Current Metrics</h2>
            <p>🖥️ CPU: <strong>{latest.metrics.cpu.toFixed(2)}%</strong></p>
            <p>💾 Disk: <strong>{latest.metrics.disk.toFixed(2)}</strong></p>
            <p>🧠 Memory: <strong>{latest.metrics.mem.toFixed(2)}%</strong></p>
          </div>

          <div
            className={`shadow-md p-6 rounded-xl ${
              latest.prediction.anomaly ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">AI Anomaly Detection</h2>
            <p>
              Status:{" "}
              <strong>
                {latest.prediction.anomaly ? "⚠️ Anomaly Detected" : "✅ Normal"}
              </strong>
            </p>
            <p>Risk Score: <strong>{latest.prediction.risk_score.toFixed(2)}</strong></p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">AWS Metrics (Live Updates)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metricsHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpu" stroke="#2563eb" name="CPU (%)" />
            <Line type="monotone" dataKey="mem" stroke="#16a34a" name="Memory (%)" />
            <Line type="monotone" dataKey="disk" stroke="#f59e0b" name="Disk IO" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
