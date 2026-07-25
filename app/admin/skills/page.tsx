"use client";

import { useEffect, useState } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  proficiency: number;
  sort_order: number;
}

const empty = {
  name: "",
  category: "",
  icon: "",
  proficiency: 3,
  sort_order: 0,
};

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/skills");
    const data = await res.json();
    if (res.ok) setSkills(data);
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
    const payload = { ...form, proficiency: Number(form.proficiency), sort_order: Number(form.sort_order) };

    if (editingId) {
      await fetch(`/api/skills/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    load();
  };

  const edit = (s: Skill) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      category: s.category,
      icon: s.icon || "",
      proficiency: s.proficiency,
      sort_order: s.sort_order,
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Skills</h1>
      </div>

      <div className="admin-section">
        <h2>{editingId ? "Edit Skill" : "New Skill"}</h2>
        <form className="admin-form" onSubmit={submit}>
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Backend, Frontend, Tools..."
              required
            />
          </label>
          <label>
            Icon (emoji)
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🚀" />
          </label>
          <label>
            Proficiency (1-5)
            <input
              type="number"
              min={1}
              max={5}
              value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
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
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save Changes" : "Create Skill"}
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
        <h2>All Skills</h2>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.icon} {s.name}
                  </td>
                  <td>{s.category}</td>
                  <td>{"●".repeat(s.proficiency)}{"○".repeat(5 - s.proficiency)}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-small" onClick={() => edit(s)}>
                      Edit
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => remove(s.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {skills.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    No skills yet.
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
