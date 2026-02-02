// services/geminiService.ts
export async function fetchTopicEvaluations(
  days: number = 14,
  count: number = 6
): Promise<{ text: string; groundingMetadata: any }> {
  const resp = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ days, count }),
  });

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data?.error || data?.message || "Gemini request failed");
  }

  // 兼容你原来的返回结构
  return {
    text: data.text ?? "",
    groundingMetadata: data.groundingMetadata ?? null,
  };
}
