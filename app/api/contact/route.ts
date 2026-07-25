import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY;
const AGENTMAIL_ADDRESS = "alan1411@agentmail.to";

export async function POST(request: Request) {
  try {
    const { name, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { error: dbError } = await supabase
      .from("messages")
      .insert({ name, message });

    if (dbError) throw dbError;

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
      } catch (emailErr: any) {
        console.error("AgentMail error:", emailErr.message);
      }
    }

    return NextResponse.json({ success: true, name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
