import React, { useEffect, useState } from "react";

export default function SimplePage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch alerts from backend every 10 seconds
  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/v1/alerts");
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
        🔔 Notifications Center
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <p className="text-gray-500 text-lg">No alerts yet ✅</p>
          <p className="text-gray-400 text-sm mt-2">
            Stay tuned — alerts from Slack and Email will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-xl shadow-md border-l-4 transition-all duration-200 hover:shadow-lg ${
                a.severity === "critical"
                  ? "bg-red-50 border-red-500"
                  : a.severity === "warning"
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-green-50 border-green-400"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  {a.subject || "Alert"}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    a.source === "Slack"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {a.source}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{a.message}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(a.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
