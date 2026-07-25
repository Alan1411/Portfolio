"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsByDay: { date: string; count: number }[];
  topPages: { page: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  hourlyActivity: { hour: number; count: number }[];
}

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#f5f3ff", "#e0e7ff", "#cffafe", "#ccfbf1"];

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${range}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [range]);

  return (
    <>
      <div className="admin-header">
        <h1>Analytics</h1>
        <div className="admin-header-actions">
          <select
            className="admin-select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <p className="muted">Loading analytics...</p>
      ) : data ? (
        <>
          {/* Stat Cards */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="stat-label">Page Views</div>
              <div className="stat-value">{data.totalViews.toLocaleString()}</div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-label">Unique Visitors</div>
              <div className="stat-value">{data.uniqueVisitors.toLocaleString()}</div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-label">Top Page</div>
              <div className="stat-value" style={{ fontSize: "1rem" }}>
                {data.topPages[0]?.page || "—"}
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-label">Avg Views/Day</div>
              <div className="stat-value">
                {data.viewsByDay.length > 0
                  ? Math.round(data.totalViews / data.viewsByDay.length)
                  : 0}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="admin-charts">
            {/* Views Over Time */}
            <div className="admin-chart-card" style={{ gridColumn: "1 / -1" }}>
              <h3>Views Over Time</h3>
              {data.viewsByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.viewsByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--muted)" fontSize={12} />
                    <YAxis stroke="var(--muted)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ fill: "#6366f1" }}
                      name="Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="muted">No data yet.</p>
              )}
            </div>

            {/* Hourly Activity */}
            <div className="admin-chart-card">
              <h3>Hourly Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.hourlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="hour"
                    stroke="var(--muted)"
                    fontSize={12}
                    tickFormatter={(h) => `${h}h`}
                  />
                  <YAxis stroke="var(--muted)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    labelFormatter={(h) => `${h}:00`}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Views" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Referrers */}
            <div className="admin-chart-card">
              <h3>Top Referrers</h3>
              {data.topReferrers.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.topReferrers}
                      dataKey="count"
                      nameKey="referrer"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(props: any) => {
                        const n = props.name || "";
                        return `${n.length > 12 ? n.substring(0, 12) + "…" : n} (${((props.percent || 0) * 100).toFixed(0)}%)`;
                      }}
                      fontSize={11}
                    >
                      {data.topReferrers.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="muted">No referrer data yet.</p>
              )}
            </div>

            {/* Top Pages Table */}
            <div className="admin-chart-card" style={{ gridColumn: "1 / -1" }}>
              <h3>Top Pages</h3>
              {data.topPages.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Views</th>
                      <th>% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topPages.map((p) => (
                      <tr key={p.page}>
                        <td><code>{p.page}</code></td>
                        <td>{p.count.toLocaleString()}</td>
                        <td>
                          {data.totalViews > 0
                            ? ((p.count / data.totalViews) * 100).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="muted">No page data yet.</p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
