import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DictionaryResponse {
  word: string;
  target_level: string;
  search_count_placeholder: number;
  definitions_group: {
    sense_id: number;
    part_of_speech: string;
    definition_en: string;
    definition_cn: string;
    synonyms: string[];
    antonyms: string[];
    scenario: {
      context: string;
      dialogue: {
        speaker: string;
        content: string;
      }[];
      translation: string;
    };
  }[];
}

export async function fetchWordData(word: string, targetLevel: string): Promise<DictionaryResponse> {
  const prompt = `
# Role
你是一位精通多国语言的词典编纂专家，擅长根据特定的英语水平（CEFR标准）为单词提供精准的多义词解析和地道的情景对话。

# Task
请针对用户提供的单词，生成符合特定学习等级的结构化教学数据。

# Variables
- Word: ${word}
- Target_Level: ${targetLevel}

# Constraints
1. **多义词处理**：如果该单词在该等级下有多个常用含义，请分别生成（最多不超过3个最常用含义）。
2. **分级适配**：对话场景的词汇量和复杂度必须符合指定的 Target_Level。
3. **数据格式**：必须严格输出 JSON 格式，确保程序可直接解析。

# Instruction
请解析单词：${word}，目标等级为：${targetLevel}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          target_level: { type: Type.STRING },
          search_count_placeholder: { type: Type.INTEGER },
          definitions_group: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sense_id: { type: Type.INTEGER },
                part_of_speech: { type: Type.STRING },
                definition_en: { type: Type.STRING },
                definition_cn: { type: Type.STRING },
                synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                scenario: {
                  type: Type.OBJECT,
                  properties: {
                    context: { type: Type.STRING },
                    dialogue: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          speaker: { type: Type.STRING },
                          content: { type: Type.STRING }
                        }
                      }
                    },
                    translation: { type: Type.STRING }
                  }
                }
              }
            }
          }
        },
        required: ["word", "target_level", "definitions_group"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as DictionaryResponse;
}
