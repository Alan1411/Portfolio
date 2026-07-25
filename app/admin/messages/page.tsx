"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

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

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Messages</h1>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="muted">No messages yet.</p>
      ) : (
        <div className="messages-list">
          {messages.map((m) => (
            <div key={m.id} className="message-card">
              <strong>{m.name}</strong>
              <p>{m.message}</p>
              <small>{new Date(m.created_at).toLocaleString()}</small>
              <div className="admin-table-actions" style={{ marginTop: "0.75rem" }}>
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
