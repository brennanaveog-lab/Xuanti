
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-3-flash-preview';

export async function fetchTopicEvaluations(
  days: number = 14,
  count: number = 6
): Promise<{ text: string; groundingMetadata: any }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
你是一名资深的全球数据隐私与数字合规法律专家，正在为一家专注于中国企业“出海”合规的专业公众号担任“选题主编”。

任务：使用 Google Search 检索最近 ${days} 天内全球（**必须排除中国大陆境内**）的监管动态、执法更新、平台政策变更及法院判决。
你的受众是 base 在中国的出海律师和法务，他们只关心**海外市场**（如欧盟 GDPR、美国各州隐私法、东南亚、中东、拉美等）的变化，**不需要任何关于中国境内法律（如 PIPL、DSL 等）的更新**。

关键词范围（仅限海外）：隐私、数据安全、跨境传输、Cookies/同意管理、DSR/投诉处理、供应商合同、数据留存、未成年人保护、广告技术/营销、App/游戏合规、AI 合规（如 EU AI Act）及 IoT 设备。

目标：生成最多 ${count} 个潜在的写作选题。对于每个选题，请提供一份结构化的“选题评估卡片”。

选题定义：一个“好选题”必须至少满足以下两项：
1. 业务决策影响力：可能在未来 3-6 个月内迫使出海企业做出合规/管理/产品层面的决策。
2. 可迁移性：适用于多个行业或常见的产品模式（如海外 App、跨境电商、游戏出海、SaaS、IoT）。
3. 可落地性：能转化为具体的清单或“下一步该做什么”（而非纯背景信息）。
4. 认知错位：识别出海外监管预期与中国企业惯常假设之间的常见误解。

输出要求：
- 使用中文输出。
- **严禁包含中国大陆境内的监管动态**。
- 严禁生产“新闻摘要”。标题必须是公众号文章式的选题，而非事件标题。
- 每个选题输出一个编号的“选题评估卡片”，包含以下字段：
  1. 选题标题 (文章选题视角)
  2. 触发事件 (谁/哪里/何时/发生了什么 - 仅限海外)
  3. 核心受众 (出海项目负责人/海外合规经理等)
  4. 受影响行业/产品 (具体化)
  5. 建议写作角度 (3-5点，强调业务风险逻辑和治理建议)
  6. 认知错位/盲点 (REQUIRED): 简洁的一句话描述中国出海企业常见的误区。
  7. 行动包大纲 (REQUIRED): 3-5点具体的下一步行动建议。
  8. 评分 (0-10): 基于决策价值、迁移性等。
  9. 来源 (URLs): 提供海外官方/权威来源。

请确保不编造事实，专注于海外法律环境。
`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text || "",
    groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
  };
}
