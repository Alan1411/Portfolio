const express = require("express");
const supabase = require("../lib/supabase");

const router = express.Router();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function requireDb(res) {
  if (!supabase) {
    res.status(503).json({ error: "Database not configured" });
    return false;
  }
  return true;
}

// GET /api/blog
router.get("/", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, created_at, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/blog/:slug
router.get("/:slug", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", req.params.slug)
      .eq("published", true)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Post not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/blog
router.post("/", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { title, content, excerpt, published } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const slug = slugify(title);

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ title, slug, content, excerpt, published })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/blog/:id
router.put("/:id", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const updates = req.body;
    if (updates.title) {
      updates.slug = slugify(updates.title);
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/blog/:id
router.delete("/:id", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
