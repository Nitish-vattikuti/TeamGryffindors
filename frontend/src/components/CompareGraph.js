// src/components/CompareGraph.js
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function CompareGraph({ awsData = [], localData = [] }) {
  // Build combined array by taking max length and aligning by index from the end
  const maxLen = Math.max(localData.length, awsData.length);
  const combined = [];
  for (let i = 0; i < maxLen; i++) {
    const l = localData[localData.length - maxLen + i] || {};
    const a = awsData[awsData.length - maxLen + i] || {};
    combined.push({
      time: l.time || a.time || `T${i}`,
      LocalRisk: l.risk || null,
      AWSRisk: a.risk || null,
    });
  }

  return (
    <div className="p-6 rounded-2xl border mt-8" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.06)" }}>
      <h3 className="text-xl mb-4 font-semibold">📊 Comparative Risk Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combined}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="LocalRisk" stroke="#3b82f6" name="Local Risk" dot={false} />
          <Line type="monotone" dataKey="AWSRisk" stroke="#ef4444" name="AWS Risk" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
