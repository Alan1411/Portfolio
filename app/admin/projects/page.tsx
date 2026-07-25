"use client";

import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  repo_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
}

const empty = {
  title: "",
  description: "",
  tech_stack: "",
  repo_url: "",
  demo_url: "",
  image_url: "",
  featured: false,
  sort_order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    if (res.ok) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(empty);
    setEditingId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tech_stack: form.tech_stack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sort_order: Number(form.sort_order),
    };

    if (editingId) {
      await fetch(`/api/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    load();
  };

  const edit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      tech_stack: (p.tech_stack || []).join(", "),
      repo_url: p.repo_url || "",
      demo_url: p.demo_url || "",
      image_url: p.image_url || "",
      featured: p.featured,
      sort_order: p.sort_order,
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Projects</h1>
      </div>

      <div className="admin-section">
        <h2>{editingId ? "Edit Project" : "New Project"}</h2>
        <form className="admin-form" onSubmit={submit}>
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              required
            />
          </label>
          <label>
            Tech Stack (comma separated)
            <input
              value={form.tech_stack}
              onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
              placeholder="Next.js, TypeScript, Supabase"
            />
          </label>
          <label>
            Repo URL
            <input
              value={form.repo_url}
              onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
            />
          </label>
          <label>
            Demo URL
            <input
              value={form.demo_url}
              onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
            />
          </label>
          <label>
            Image URL
            <input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </label>
          <label>
            Sort Order
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </label>
          <label style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              style={{ width: "auto" }}
            />
            Featured
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save Changes" : "Create Project"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-section">
        <h2>All Projects</h2>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Featured</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.featured ? "⭐" : "—"}</td>
                  <td>{p.sort_order}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-small" onClick={() => edit(p)}>
                      Edit
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => remove(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    No projects yet.
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
