"use client";

import { useEffect, useState } from "react";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id: string, role: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    load();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      return;
    }
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Users</h1>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <p className="muted">Loading users...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.full_name || "—"}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="admin-table-actions">
                  {u.role === "admin" ? (
                    <button className="btn btn-small" onClick={() => changeRole(u.id, "user")}>
                      Demote
                    </button>
                  ) : (
                    <button className="btn btn-small btn-primary" onClick={() => changeRole(u.id, "admin")}>
                      Promote
                    </button>
                  )}
                  <button className="btn btn-small btn-danger" onClick={() => deleteUser(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
