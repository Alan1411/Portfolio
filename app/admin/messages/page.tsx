"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  name: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("all");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/messages");
    const data = await res.json();
    if (res.ok) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);
  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <>
      <div className="admin-header">
        <h1>Messages {unreadCount > 0 && <span className="role-badge admin">{unreadCount} unread</span>}</h1>
        <div className="admin-header-actions">
          <select
            className="admin-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="muted">No messages.</p>
      ) : (
        <div className="messages-list">
          {filtered.map((m) => (
            <div key={m.id} className={`message-card ${m.status === "unread" ? "unread" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{m.name}</strong>
                <span className={`role-badge ${m.status === "unread" ? "user" : m.status === "read" ? "admin" : ""}`}>
                  {m.status}
                </span>
              </div>
              <p>{m.message}</p>
              <small>{new Date(m.created_at).toLocaleString()}</small>
              <div className="admin-table-actions" style={{ marginTop: "0.75rem" }}>
                {m.status !== "read" && (
                  <button className="btn btn-small" onClick={() => setStatus(m.id, "read")}>
                    Mark Read
                  </button>
                )}
                {m.status !== "archived" && (
                  <button className="btn btn-small" onClick={() => setStatus(m.id, "archived")}>
                    Archive
                  </button>
                )}
                {m.status !== "unread" && (
                  <button className="btn btn-small" onClick={() => setStatus(m.id, "unread")}>
                    Mark Unread
                  </button>
                )}
                <button className="btn btn-small btn-danger" onClick={() => remove(m.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
