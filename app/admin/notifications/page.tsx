"use client";

import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  message: string;
  type: string;
  active: boolean;
  created_at: string;
}

export default function AdminNotifications() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [active, setActive] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/announcements");
    const data = await res.json();
    if (res.ok) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, type, active }),
    });
    setMessage("");
    setType("info");
    setActive(true);
    load();
  };

  const toggleActive = async (item: Announcement) => {
    await fetch(`/api/admin/announcements/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this notification?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Notifications</h1>
      </div>

      <div className="admin-section">
        <h2>New Banner Notification</h2>
        <form className="admin-form" onSubmit={create}>
          <label>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              required
              placeholder="e.g. Site maintenance on Sunday 10pm UTC"
            />
          </label>
          <label>
            Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="info">Info (yellow)</option>
              <option value="warning">Warning (yellow/dark)</option>
              <option value="success">Success (green)</option>
              <option value="error">Error (red)</option>
            </select>
          </label>
          <label style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              style={{ width: "auto" }}
            />
            Active (show immediately)
          </label>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h2>All Notifications</h2>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.message}</td>
                  <td>{item.type}</td>
                  <td>
                    <span className={`role-badge ${item.active ? "admin" : "user"}`}>
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="admin-table-actions">
                    <button className="btn btn-small" onClick={() => toggleActive(item)}>
                      {item.active ? "Deactivate" : "Activate"}
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => remove(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    No notifications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
