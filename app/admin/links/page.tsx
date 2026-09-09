"use client";

import { useEffect, useState } from "react";

interface ShortLink {
  id: string;
  slug: string;
  url: string;
  clicks: number;
  created_at: string;
}

export default function AdminLinks() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ url: "", slug: "" });
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLinks(data);
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
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await navigator.clipboard.writeText(data.shortUrl);
      setCopiedId(data.id);
      setTimeout(() => setCopiedId(null), 3000);

      setForm({ url: "", slug: "" });
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const copyLink = async (slug: string, id: string) => {
    await navigator.clipboard.writeText(`https://chicoweb.de/r/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const resetClicks = async (id: string) => {
    await fetch(`/api/links/${id}`, { method: "PATCH" });
    load();
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Delete this short link?")) return;
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    load();
  };

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

  return (
    <>
      <div className="admin-header">
        <h1>URL Shortener</h1>
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
              Long URL *
              <input
                type="text"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com/very/long/path"
              />
            </label>
            <label>
              Short Slug (optional)
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="my-cool-link"
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
          <div className="stat-value">{links.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Total Clicks</div>
          <div className="stat-value" style={{ color: "#22c55e" }}>{totalClicks}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Most Clicked</div>
          <div className="stat-value">
            {links.length > 0
              ? `/r/${links.reduce((a, b) => ((a.clicks || 0) > (b.clicks || 0) ? a : b)).slug}`
              : "—"}
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : links.length === 0 ? (
        <p className="muted">No short links yet. Create one above.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Destination</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.id}>
                <td>
                  <code style={{ fontSize: "0.85rem" }}>/r/{l.slug}</code>
                </td>
                <td style={{ wordBreak: "break-all", maxWidth: "300px" }}>
                  {l.url}
                </td>
                <td>{l.clicks || 0}</td>
                <td>{new Date(l.created_at).toLocaleDateString()}</td>
                <td className="admin-table-actions">
                  <button
                    className="btn btn-small"
                    onClick={() => copyLink(l.slug, l.id)}
                  >
                    {copiedId === l.id ? "Copied!" : "Copy Link"}
                  </button>
                  <button className="btn btn-small" onClick={() => resetClicks(l.id)}>
                    Reset
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => deleteLink(l.id)}
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