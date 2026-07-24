const themeToggle = document.getElementById("theme-toggle");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const messagesList = document.getElementById("messages-list");
const year = document.getElementById("year");

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

let supabase = null;

try {
  if (window.supabase && window.supabase.createClient) {
    supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );
  } else if (window.createClient) {
    supabase = window.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );
  } else {
    console.error("Supabase client not found on window:", Object.keys(window).filter(k => k.toLowerCase().includes("supabase")));
  }
} catch (err) {
  console.error("Failed to create Supabase client:", err);
}

async function loadMessages() {
  if (!supabase) {
    messagesList.innerHTML = '<p class="muted">Supabase not connected.</p>';
    return;
  }
  try {
    const { data, error } = await supabase
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

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const message = formData.get("message");

  if (!supabase) {
    formStatus.hidden = false;
    formStatus.textContent = "Supabase not connected. Check console.";
    return;
  }

  try {
    const { error } = await supabase
      .from("messages")
      .insert({ name, message });

    if (error) throw error;

    formStatus.hidden = false;
    formStatus.textContent = `Thanks, ${name}! Your message was sent.`;
    contactForm.reset();
    loadMessages();
  } catch (err) {
    formStatus.hidden = false;
    formStatus.textContent = `Error: ${err.message}`;
  }
});

year.textContent = new Date().getFullYear();
loadMessages();
