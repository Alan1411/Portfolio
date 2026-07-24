const { createClient } = window.supabase;
const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

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

async function loadMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    messagesList.innerHTML = `<p class="muted">Could not load messages: ${error.message}</p>`;
    return;
  }

  if (!data.length) {
    messagesList.innerHTML = `<p class="muted">No messages yet. Be the first!</p>`;
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
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const message = formData.get("message");

  const { error } = await supabase.from("messages").insert({ name, message });

  formStatus.hidden = false;
  if (error) {
    formStatus.textContent = `Error: ${error.message}`;
  } else {
    formStatus.textContent = `Thanks, ${name}! Your message was sent.`;
    contactForm.reset();
    loadMessages();
  }
});

year.textContent = new Date().getFullYear();
loadMessages();
