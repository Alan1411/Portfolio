import { createClient } from "@supabase/supabase-js";
import {
  MessagesOverTimeChart,
  SkillsByCategoryChart,
  RolesPieChart,
} from "@/components/DashboardCharts";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

async function getStats() {
  const supabase = getSupabase();

  const [projects, skills, blogPosts, messages, profiles] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("messages").select("id, created_at"),
    supabase.from("profiles").select("id, role"),
  ]);

  const skillsData = await supabase.from("skills").select("category");

  const skillsByCategory: Record<string, number> = {};
  (skillsData.data || []).forEach((s: { category: string }) => {
    skillsByCategory[s.category] = (skillsByCategory[s.category] || 0) + 1;
  });

  const messagesByDate: Record<string, number> = {};
  (messages.data || []).forEach((m: { created_at: string }) => {
    const date = new Date(m.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    messagesByDate[date] = (messagesByDate[date] || 0) + 1;
  });

  const roleCounts: Record<string, number> = { admin: 0, user: 0 };
  (profiles.data || []).forEach((p: { role: string }) => {
    roleCounts[p.role] = (roleCounts[p.role] || 0) + 1;
  });

  return {
    projectsCount: projects.count || 0,
    skillsCount: skills.count || 0,
    blogCount: blogPosts.count || 0,
    messagesCount: messages.data?.length || 0,
    usersCount: profiles.data?.length || 0,
    messagesOverTime: Object.entries(messagesByDate).map(([date, count]) => ({
      date,
      count,
    })),
    skillsByCategory: Object.entries(skillsByCategory).map(([category, count]) => ({
      category,
      count,
    })),
    roles: Object.entries(roleCounts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value })),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-label">Projects</div>
          <div className="stat-value">{stats.projectsCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Skills</div>
          <div className="stat-value">{stats.skillsCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Blog Posts</div>
          <div className="stat-value">{stats.blogCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Messages</div>
          <div className="stat-value">{stats.messagesCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Users</div>
          <div className="stat-value">{stats.usersCount}</div>
        </div>
      </div>

      <div className="admin-charts">
        <div className="admin-chart-card">
          <h3>Messages Over Time</h3>
          {stats.messagesOverTime.length > 0 ? (
            <MessagesOverTimeChart data={stats.messagesOverTime} />
          ) : (
            <p className="muted">No messages yet.</p>
          )}
        </div>
        <div className="admin-chart-card">
          <h3>Skills by Category</h3>
          {stats.skillsByCategory.length > 0 ? (
            <SkillsByCategoryChart data={stats.skillsByCategory} />
          ) : (
            <p className="muted">No skills yet.</p>
          )}
        </div>
        <div className="admin-chart-card">
          <h3>Users by Role</h3>
          {stats.roles.length > 0 ? (
            <RolesPieChart data={stats.roles} />
          ) : (
            <p className="muted">No users yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
