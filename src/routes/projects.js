const express = require("express");
const supabase = require("../lib/supabase");

const router = express.Router();

function requireDb(res) {
  if (!supabase) {
    res.status(503).json({ error: "Database not configured" });
    return false;
  }
  return true;
}

// GET /api/projects
router.get("/", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Project not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects
router.post("/", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { title, description, tech_stack, repo_url, demo_url, image_url, featured, sort_order } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({ title, description, tech_stack, repo_url, demo_url, image_url, featured, sort_order })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/projects/:id
router.put("/:id", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const updates = req.body;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("projects")
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

// DELETE /api/projects/:id
router.delete("/:id", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
