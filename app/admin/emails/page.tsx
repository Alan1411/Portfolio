"use client";

import { useEffect, useState } from "react";

interface EmailLink {
  id: string;
  email: string;
  token: string;
  subject: string | null;
  message: string | null;
  status: string;
  created_at: string;
  opened_at: string | null;
}

export default function AdminEmails() {
  const [emails, setEmails] = useState<EmailLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "" });
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/email");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEmails(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Copy link to clipboard
      await navigator.clipboard.writeText(data.trackingUrl);
      setCopiedId(data.id);
      setTimeout(() => setCopiedId(null), 3000);

      setForm({ email: "" });
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const copyLink = async (token: string, id: string) => {
    const url = `https://chicoweb.de/email/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const deleteEmail = async (id: string) => {
    if (!confirm("Delete this tracked email?")) return;
    await fetch(`/api/email/${id}`, { method: "DELETE" });
    load();
  };

  const openedCount = emails.filter((e) => e.status === "opened").length;
  const sentCount = emails.filter((e) => e.status === "sent").length;

  return (
    <>
      <div className="admin-header">
        <h1>Email Tracking</h1>
        <div className="admin-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ New Link"}
          </button>
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {/* Create Form */}
      {showForm && (
        <div className="admin-form" style={{ marginBottom: "1.5rem" }}>
          <form onSubmit={createLink}>
            <label>
              Recipient Email *
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="recipient@example.com"
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? "Creating..." : "Generate Link"}
            </button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: "1.5rem" }}>
        <div className="admin-stat-card">
          <div className="stat-label">Total Links</div>
          <div className="stat-value">{emails.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Opened</div>
          <div className="stat-value" style={{ color: "#22c55e" }}>{openedCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: "#f59e0b" }}>{sentCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Open Rate</div>
          <div className="stat-value">
            {emails.length > 0 ? Math.round((openedCount / emails.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : emails.length === 0 ? (
        <p className="muted">No tracked emails yet. Create one above.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Created</th>
              <th>Opened</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((e) => (
              <tr key={e.id}>
                <td>{e.email}</td>
                <td>
                  <span
                    className={`role-badge ${e.status === "opened" ? "admin" : "user"}`}
                  >
                    {e.status === "opened" ? "✓ Opened" : "Sent"}
                  </span>
                </td>
                <td>{new Date(e.created_at).toLocaleDateString()}</td>
                <td>
                  {e.opened_at
                    ? new Date(e.opened_at).toLocaleString()
                    : "—"}
                </td>
                <td className="admin-table-actions">
                  <button
                    className="btn btn-small"
                    onClick={() => copyLink(e.token, e.id)}
                  >
                    {copiedId === e.id ? "Copied!" : "Copy Link"}
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => deleteEmail(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
