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

  const days = Number(body?.days ?? 14);
  const count = Number(body?.count ?? 6);

  const prompt = `
你是一名资深的全球数据隐私与数字合规律师专家，正在为一家专注于中国企业“出海”合规的专业公众号担任“选题主编”。

任务：基于最近 ${days} 天内的全球（必须排除中国大陆境内）监管动态、执法更新、判例、官方指南、行业标准等，生成最多 ${count} 个潜在写作选题。
关键词范围（仅限海外）：隐私、数据安全、跨境传输、Cookies/同意管理、DSR/投诉处理、供应商合同、数据留存、儿童保护、AI治理等。

输出要求：对每个选题给出结构化“选题评估卡片”，包括：
- 标题
- 为什么重要（对出海企业的决策影响）
- 适用行业/场景
- 合规要点（要落到动作）
- 风险提示/常见误区
- 建议引用的法规/机构/国家（不需要贴链接）
`.trim();

  try {
    const client = new GoogleGenAI({ apiKey });

    const result = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    return res.status(200).json({
      text: result.text,
      groundingMetadata: null,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Gemini request failed",
      message: err?.message ?? String(err),
    });
  }
}
