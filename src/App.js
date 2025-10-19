// src/App.js
import React, { useState, useEffect } from "react";
import LocalMonitor from "./components/LocalMonitor";
import AwsMonitor from "./components/AwsMonitor";
import CompareGraph from "./components/CompareGraph";
import SimplePage from "./components/SimplePage";
import { RefreshCw, AlertTriangle, Bell, Settings, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [refreshing, setRefreshing] = useState(false);
  const [localData, setLocalData] = useState([]); // {time, risk, cpu, mem, disk}
  const [awsData, setAwsData] = useState([]);
  const ALERT_COOLDOWN_MS = 300000; // 5 minutes
  const [lastSimTime, setLastSimTime] = useState(0);

  // receive new datapoint from LocalMonitor
  const handleNewLocal = (point) => {
    setLocalData(prev => [...prev.slice(-29), point]); // keep last 30
    if (point.anomaly) {
      toast.error("⚠️ Local Anomaly detected!");
    }
  };

  // receive new datapoint from AwsMonitor
  const handleNewAws = (point) => {
    setAwsData(prev => [...prev.slice(-29), point]);
    if (point.anomaly) {
      toast.error("⚠️ AWS Anomaly detected!");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // child components poll on their own; just visual feedback here
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Simulate failure: inject a high-risk datapoint into both feeds
  const simulateFailure = () => {
    const now = new Date().toLocaleTimeString();
    const fakeLocal = { time: now, cpu: 95, mem: 92, disk: 85, risk: 110, anomaly: true, source: "Simulated" };
    const fakeAws = { time: now, cpu: 98, mem: 90, disk: 75, risk: 112, anomaly: true, source: "Simulated" };

    setLocalData(prev => [...prev.slice(-29), fakeLocal]);
    setAwsData(prev => [...prev.slice(-29), fakeAws]);

    toast.success("🚨 Simulated failure injected to both Local and AWS monitors");
    setLastSimTime(Date.now());
    // also show a browser alert for judges if desired:
    // alert("🚨 Simulated failure triggered! Check Slack/Email for alerts.");
  };

  // Light/dark classes
  const bgClass = dark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900";

  return (
    <div className={clsx("min-h-screen flex", bgClass)}>
      <Toaster position="top-right" />

      {/* Sidebar (sticky) */}
      <aside className={clsx("w-64 p-6 border-r", dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
        <div className="sticky top-0">
          <h1 className="text-2xl font-bold mb-6 text-blue-400">⚡ InfraSight</h1>
          {[
            { key: "dashboard", label: "📊 Dashboard" },
            { key: "aws", label: "☁️ AWS Monitor" },
            { key: "local", label: "💻 Local Monitor" },
            { key: "alerts", label: "🔔 Alerts" },
            { key: "settings", label: "⚙️ Settings" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setPage(tab.key)}
              className={clsx(
                "w-full text-left py-2 px-3 mb-2 rounded-lg transition-all",
                page === tab.key ? "bg-blue-600 text-white" : dark ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-200 text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">Theme</div>
            <button
              onClick={() => setDark(!dark)}
              className={clsx("p-2 rounded-lg border", dark ? "border-gray-700" : "border-gray-300")}
              aria-label="toggle theme"
            >
              {dark ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            {page === "dashboard" ? "📊 Dashboard" : page === "aws" ? "☁️ AWS Monitor" : page === "local" ? "💻 Local Monitor" : page === "alerts" ? "🔔 Alerts" : "⚙️ Settings"}
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={clsx("p-2 rounded-lg border", dark ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-200")}
            >
              <RefreshCw className={refreshing ? "animate-spin text-blue-400" : "text-blue-400"} />
            </button>

            <button
              onClick={simulateFailure}
              className="p-2 rounded-lg border border-red-600 bg-red-600 text-white hover:opacity-90"
            >
              <AlertTriangle />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {page === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LocalMonitor onNewLocal={handleNewLocal} dark={dark} />
                <AwsMonitor onNewAws={handleNewAws} dark={dark} />
              </div>

              <CompareGraph localData={localData} awsData={awsData} />
            </motion.div>
          )}

          {page === "aws" && <AwsMonitor onNewAws={handleNewAws} dark={dark} />}
          {page === "local" && <LocalMonitor onNewLocal={handleNewLocal} dark={dark} />}
          {page === "alerts" && <SimplePage title="🔔 Alerts" message="Alert history will appear here (demo)" />}
          {page === "settings" && <SimplePage title="⚙️ Settings" message="Add API keys / notification configs here." />}
        </AnimatePresence>
      </main>
    </div>
  );
}
