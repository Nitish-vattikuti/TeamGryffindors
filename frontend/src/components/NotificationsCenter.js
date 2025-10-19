import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationsCenter({ dark }) {
  const [alerts, setAlerts] = useState([]);

  // Fetch alerts periodically
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/v1/alerts");
        setAlerts(res.data);
      } catch (err) {
        console.error("Error fetching alerts:", err.message);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-6 rounded-2xl ${dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"} border`}>
      <h2 className="text-2xl font-bold mb-4">🔔 Notifications Center</h2>

      {alerts.length === 0 ? (
        <p className="text-gray-400">No alerts yet ✅</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`p-4 rounded-xl shadow-md border ${
                alert.severity === "critical"
                  ? "border-red-500 bg-red-100 text-red-900"
                  : alert.severity === "warning"
                  ? "border-yellow-400 bg-yellow-100 text-yellow-800"
                  : "border-green-400 bg-green-100 text-green-800"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{alert.source}</span>
                <span className="text-sm opacity-70">{alert.timestamp}</span>
              </div>
              <p className="font-medium">{alert.subject}</p>
              <p className="text-sm opacity-90">{alert.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
