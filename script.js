const themeToggle = document.getElementById("theme-toggle");
const ctaBtn = document.getElementById("cta-btn");
const clickCount = document.getElementById("click-count");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const year = document.getElementById("year");

let clicks = 0;

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "dark" ? "🌙" : "☀️";

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.textContent = next === "dark" ? "🌙" : "☀️";
});

ctaBtn.addEventListener("click", () => {
  clicks += 1;
  clickCount.textContent = `Clicks: ${clicks}`;
  ctaBtn.textContent = clicks === 1 ? "Nice!" : "Keep going!";
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(contactForm).get("name");
  formStatus.hidden = false;
  formStatus.textContent = `Thanks, ${name}! (This is a demo — nothing was sent.)`;
  contactForm.reset();
});

year.textContent = new Date().getFullYear();
