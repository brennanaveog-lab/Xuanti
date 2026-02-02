// api/gemini.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;

  const prompt = body?.prompt?.trim();
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const client = new GoogleGenAI({ apiKey });

    const response = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    return res.status(200).json({
      text: response.text,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Gemini request failed",
      message: err?.message ?? String(err),
    });
  }
}
