// src/components/LocalMonitor.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import MetricCard from "./MetricCard";
import { Cpu, Activity, HardDrive, Gauge } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function LocalMonitor({ dark, onNewLocal }) {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);

  const fetchLocal = async () => {
    try {
      // you can replace this with real monitor.py POST if you run it
      const metrics = {
        cpu: Math.round((Math.random() * 50 + 10) * 100) / 100,
        mem: Math.round((Math.random() * 50 + 20) * 100) / 100,
        disk: Math.round((Math.random() * 30 + 10) * 100) / 100,
      };

      const res = await axios.post("http://localhost:5001/api/v1/predict", { metrics });
      const point = {
        time: new Date().toLocaleTimeString(),
        cpu: metrics.cpu,
        mem: metrics.mem,
        disk: metrics.disk,
        risk: res.data.risk_score,
        anomaly: res.data.anomaly,
        source: "Local",
      };

      setLatest(point);
      setData(prev => [...prev.slice(-29), point]);
      if (typeof onNewLocal === "function") onNewLocal(point);
    } catch (err) {
      console.error("Local monitor error:", err.message);
    }
  };

  useEffect(() => {
    fetchLocal();
    const iv = setInterval(fetchLocal, 10000);
    return () => clearInterval(iv);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-2">💻 Local Monitor</h3>

      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <MetricCard title="CPU" icon={<Cpu />} value={`${latest.cpu}%`} dark={dark} />
          <MetricCard title="Memory" icon={<Activity />} value={`${latest.mem}%`} dark={dark} />
          <MetricCard title="Disk" icon={<HardDrive />} value={`${latest.disk}`} dark={dark} />
          <MetricCard
            title="Risk"
            icon={<Gauge />}
            value={latest.risk.toFixed(1)}
            subtitle={latest.anomaly ? "⚠️ Anomaly" : "✅ Normal"}
            color={latest.anomaly ? "text-red-500" : "text-green-500"}
            dark={dark}
          />
        </div>
      )}

      <div className={dark ? "p-4 rounded-2xl bg-gray-900 border border-gray-800" : "p-4 rounded-2xl bg-white border border-gray-200"}>
        <h4 className="mb-2 font-medium">Local Trends</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cpu" stroke="#3b82f6" />
            <Line type="monotone" dataKey="mem" stroke="#22c55e" />
            <Line type="monotone" dataKey="disk" stroke="#f59e0b" />
            <Line type="monotone" dataKey="risk" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
