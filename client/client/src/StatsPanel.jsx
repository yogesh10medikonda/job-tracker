import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import api from "../api/api";
import { STATUS_LABELS } from "../constants";

const PIE_COLORS = {
  wishlist: "#9ca3af",
  applied: "#3b82f6",
  oa: "#a855f7",
  interview: "#f59e0b",
  offer: "#22c55e",
  rejected: "#ef4444",
};

export default function StatsPanel({ refreshKey }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats").then((res) => setStats(res.data)).catch(() => {});
  }, [refreshKey]);

  if (!stats || stats.total === 0) return null;

  const pieData = Object.entries(stats.byStatus)
    .filter(([, n]) => n > 0)
    .map(([key, n]) => ({ key, name: STATUS_LABELS[key], value: n }));

  const cards = [
    ["Total", stats.total],
    ["Applied", stats.applied],
    ["Interviews", stats.byStatus.interview],
    ["Offers", stats.byStatus.offer],
    ["Response rate", `${stats.responseRate}%`],
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map(([label, value]) => (
          <div key={label} className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold mb-2">Applications per week</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weekly}>
                <XAxis dataKey="week" fontSize={12} />
                <YAxis allowDecimals={false} width={30} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold mb-2">Status breakdown</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={70} label>
                  {pieData.map((d) => <Cell key={d.key} fill={PIE_COLORS[d.key]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}