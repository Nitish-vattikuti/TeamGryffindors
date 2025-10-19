import React, { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ cpu: "", mem: "", disk: "" });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setMetrics({ ...metrics, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/v1/predict", {
        metrics: {
          cpu: Number(metrics.cpu),
          mem: Number(metrics.mem),
          disk: Number(metrics.disk),
        },
      });
      setResult(res.data);
      setHistory((prev) => [
        ...prev,
        { ...metrics, risk: res.data.risk_score.toFixed(2), anomaly: res.data.anomaly },
      ]);
    } catch (error) {
      console.error("Error:", error);
      alert("Backend not responding or invalid credentials!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">⚙️ InfraSight Dashboard</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">CPU Usage (%)</label>
          <input
            name="cpu"
            type="number"
            value={metrics.cpu}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Memory Usage (%)</label>
          <input
            name="mem"
            type="number"
            value={metrics.mem}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Disk Usage (%)</label>
          <input
            name="disk"
            type="number"
            value={metrics.disk}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Analyze
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Result</h2>
          <p>
            <strong>Risk Score:</strong> {result.risk_score.toFixed(2)}
          </p>
          <p>
            <strong>Anomaly:</strong>{" "}
            <span className={result.anomaly ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
              {result.anomaly ? "Yes 🚨" : "No ✅"}
            </span>
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10 w-full max-w-3xl bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">📈 Risk Score History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cpu" label={{ value: "CPU (%)", position: "insideBottom", offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#2563eb" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
