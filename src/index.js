require("dotenv").config();
const express = require("express");
const path = require("path");

const projectsRouter = require("./routes/projects");
const skillsRouter = require("./routes/skills");
const blogRouter = require("./routes/blog");
const contactRouter = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API routes
app.use("/api/projects", projectsRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/blog", blogRouter);
app.use("/api/contact", contactRouter);

// Pages
app.get("/", (req, res) => {
  res.render("index", {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    urlSet: !!process.env.SUPABASE_URL,
    keySet: !!process.env.SUPABASE_ANON_KEY,
    agentmailSet: !!process.env.AGENTMAIL_API_KEY,
  });
});

if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
