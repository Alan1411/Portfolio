const express = require("express");
const supabase = require("../lib/supabase");

const router = express.Router();

const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY;
const AGENTMAIL_ADDRESS = "alan1411@agentmail.to";

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  try {
    // Save to Supabase (if configured)
    if (supabase) {
      const { error: dbError } = await supabase
        .from("messages")
        .insert({ name, message });

      if (dbError) throw dbError;
    }

    // Send email via AgentMail
    if (AGENTMAIL_API_KEY) {
      try {
        await fetch("https://api.agentmail.to/v1/messages/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AGENTMAIL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `${name} via portfolio <${AGENTMAIL_ADDRESS}>`,
            to: "master@chicoweb.de",
            subject: `Portfolio Message from ${name}`,
            text: `Name: ${name}\n\nMessage:\n${message}`,
            html: `
              <h2>New message from your portfolio</h2>
              <p><strong>From:</strong> ${name}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
              <hr>
              <small>Sent via chicoweb.de contact form</small>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("AgentMail error:", emailErr.message);
      }
    }

    res.json({ success: true, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
