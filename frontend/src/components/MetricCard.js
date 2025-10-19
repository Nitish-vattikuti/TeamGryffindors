import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function MetricCard({ title, icon, value, subtitle, color, dark }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={clsx(
        "p-5 rounded-2xl shadow-md border transition-all",
        dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="flex justify-between items-center mb-2 text-gray-400">
        <span className="text-sm uppercase">{title}</span>
        {icon}
      </div>
      <p className={clsx("text-3xl font-bold", color || "text-blue-500")}>{value}</p>
      {subtitle && <p className="text-sm mt-1 opacity-70">{subtitle}</p>}
    </motion.div>
  );
}
