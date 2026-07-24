const themeToggle = document.getElementById("theme-toggle");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const messagesList = document.getElementById("messages-list");
const projectsList = document.getElementById("projects-list");
const skillsList = document.getElementById("skills-list");
const blogList = document.getElementById("blog-list");
const year = document.getElementById("year");

// Theme
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "dark" ? "\u{1F319}" : "\u2600\uFE0F";

themeToggle.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.textContent = next === "dark" ? "\u{1F319}" : "\u2600\uFE0F";
});

// Supabase client (for messages)
let db = null;
try {
  const client = window.supabase || window;
  db = client.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
} catch (err) {
  console.error("Failed to create Supabase client:", err);
}

// --- Projects ---
async function loadProjects() {
  try {
    const res = await fetch("/api/projects");
    const projects = await res.json();

    if (!projects.length) {
      projectsList.innerHTML = '<p class="muted">No projects yet.</p>';
      return;
    }

    projectsList.innerHTML = projects
      .map(
        (p) => `
      <article class="card">
        <span class="card-icon">${p.image_url ? `<img src="${p.image_url}" alt="${p.title}" style="width:100%;border-radius:0.5rem;margin-bottom:0.5rem">` : "📁"}</span>
        <h2>${p.title}</h2>
        <p>${p.description}</p>
        ${p.tech_stack && p.tech_stack.length ? `<div class="tech-tags">${p.tech_stack.map((t) => `<span class="tech-tag">${t}</span>`).join("")}</div>` : ""}
        <div class="card-links">
          ${p.repo_url ? `<a href="${p.repo_url}" target="_blank" rel="noopener" class="btn btn-small">GitHub</a>` : ""}
          ${p.demo_url ? `<a href="${p.demo_url}" target="_blank" rel="noopener" class="btn btn-small btn-primary">Demo</a>` : ""}
        </div>
      </article>`
      )
      .join("");
  } catch (err) {
    projectsList.innerHTML = `<p class="muted">Error loading projects: ${err.message}</p>`;
  }
}

// --- Skills ---
async function loadSkills() {
  try {
    const res = await fetch("/api/skills");
    const skills = await res.json();

    if (!skills.length) {
      skillsList.innerHTML = '<p class="muted">No skills listed yet.</p>';
      return;
    }

    // Group by category
    const grouped = {};
    skills.forEach((s) => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });

    skillsList.innerHTML = Object.entries(grouped)
      .map(
        ([cat, items]) => `
        <div class="skill-group">
          <h3 class="skill-category">${cat}</h3>
          <div class="skill-items">
            ${items
              .map(
                (s) => `
              <div class="skill-pill">
                ${s.icon ? `<span>${s.icon}</span>` : ""}
                <span>${s.name}</span>
                <span class="skill-level">${"●".repeat(s.proficiency)}${"○".repeat(5 - s.proficiency)}</span>
              </div>`
              )
              .join("")}
          </div>
        </div>`
      )
      .join("");
  } catch (err) {
    skillsList.innerHTML = `<p class="muted">Error loading skills: ${err.message}</p>`;
  }
}

// --- Blog ---
async function loadBlog() {
  try {
    const res = await fetch("/api/blog");
    const posts = await res.json();

    if (!posts.length) {
      blogList.innerHTML = '<p class="muted">No blog posts yet.</p>';
      return;
    }

    blogList.innerHTML = posts
      .map(
        (p) => `
      <article class="card blog-card">
        <h2>${p.title}</h2>
        ${p.excerpt ? `<p>${p.excerpt}</p>` : ""}
        <small class="muted">${new Date(p.created_at).toLocaleDateString()}</small>
      </article>`
      )
      .join("");
  } catch (err) {
    blogList.innerHTML = `<p class="muted">Error loading blog: ${err.message}</p>`;
  }
}

// --- Messages (Supabase client-side) ---
async function loadMessages() {
  if (!db) {
    messagesList.innerHTML = '<p class="muted">Supabase not connected.</p>';
    return;
  }
  try {
    const { data, error } = await db
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    if (!data || !data.length) {
      messagesList.innerHTML = '<p class="muted">No messages yet. Be the first!</p>';
      return;
    }

    messagesList.innerHTML = data
      .map(
        (m) => `
      <div class="message-card">
        <strong>${m.name}</strong>
        <p>${m.message}</p>
        <small>${new Date(m.created_at).toLocaleString()}</small>
      </div>`
      )
      .join("");
  } catch (err) {
    messagesList.innerHTML = `<p class="muted">Error loading messages: ${err.message}</p>`;
  }
}

// --- Contact form (server-side email + Supabase) ---
contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const message = formData.get("message");

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error);

    formStatus.hidden = false;
    formStatus.textContent = `Thanks, ${name}! Your message was sent.`;
    contactForm.reset();
    loadMessages();
  } catch (err) {
    formStatus.hidden = false;
    formStatus.textContent = `Error: ${err.message}`;
  }
});

// --- Init ---
year.textContent = new Date().getFullYear();
loadProjects();
loadSkills();
loadBlog();
loadMessages();
