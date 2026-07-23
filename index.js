const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Supabase-Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(express.json());
app.use(express.static('public'));

// API: Alle Projekte holen
app.get('/api/projects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Kontaktformular
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const { data, error } = await supabase
      .from('messages')
      .insert([{ name, email, message }]);
    
    if (error) throw error;
    res.json({ success: true, message: 'Nachricht gesendet!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});