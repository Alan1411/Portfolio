const themeToggle = document.getElementById("theme-toggle");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
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

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const message = formData.get("message");

  try {
    const { createClient } = window.supabase;
    const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

    const { error } = await supabase.from("messages").insert({ name, message });

    if (error) throw error;

    formStatus.hidden = false;
    formStatus.textContent = `Thanks, ${name}! Your message was sent.`;
    contactForm.reset();
  } catch (err) {
    formStatus.hidden = false;
    formStatus.textContent = `Thanks, ${name}! (Demo mode — no Supabase table yet.)`;
    contactForm.reset();
  }
});

year.textContent = new Date().getFullYear();
