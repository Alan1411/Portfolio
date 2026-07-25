"use client";

import { useEffect, useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUpload } from "@/components/ImageUpload";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
}

const empty = {
  title: "",
  content: "",
  excerpt: "",
  cover_image_url: "",
  published: false,
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    if (res.ok) setPosts(data);
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

    if (editingId) {
      await fetch(`/api/blog/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    resetForm();
    load();
  };

  const edit = (p: Post) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      content: p.content,
      excerpt: p.excerpt || "",
      cover_image_url: p.cover_image_url || "",
      published: p.published,
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Blog</h1>
      </div>

      <div className="admin-section">
        <h2>{editingId ? "Edit Post" : "New Post"}</h2>
        <form className="admin-form" onSubmit={submit}>
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label>
            Excerpt
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
            />
          </label>
          <ImageUpload
            label="Cover Image"
            value={form.cover_image_url}
            onChange={(url) => setForm({ ...form, cover_image_url: url })}
            folder="blog"
          />
          <RichTextEditor
            label="Content"
            value={form.content}
            onChange={(html) => setForm({ ...form, content: html })}
          />
          <label style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              style={{ width: "auto" }}
            />
            Published
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save Changes" : "Create Post"}
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
        <h2>All Posts</h2>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>
                    <span className={`role-badge ${p.published ? "admin" : "user"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
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
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    No posts yet.
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
