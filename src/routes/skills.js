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

// GET /api/skills
router.get("/", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/skills/:id
router.get("/:id", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Skill not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/skills
router.post("/", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { name, category, icon, proficiency, sort_order } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { data, error } = await supabase
      .from("skills")
      .insert({ name, category, icon, proficiency, sort_order })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/skills/:id
router.put("/:id", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { data, error } = await supabase
      .from("skills")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/skills/:id
router.delete("/:id", async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
