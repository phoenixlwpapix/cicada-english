// app/api/generate/route.js
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  console.log("[API] POST request received");

  try {
    const body = await req.json();
    const { words } = body;

    console.log("[API] Request body:", body);
    console.log("[API] Words received:", words);

    if (!words || !Array.isArray(words) || words.length === 0) {
      console.error("[API] Invalid words input:", words);
      return NextResponse.json(
        { error: "Invalid words input. Please provide an array of words." },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      console.error("[API] GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const prompt = `
你是一名面向中国六年级小学生的英语阅读教师。请根据给定的单词编写一篇约200词的英语短文。随后设计5道英文阅读理解单选题：
文章要求：内容贴近小学生生活，语言清晰简洁，主人公名字随意取一个常见名（不要Lily），难度不超过KET水平。
出题要求：每题提供 A/B/C 三个选项；明确标注正确答案；正确答案在 A、B、C 中分布均衡，不集中在同一个选项。

单词列表：${words.join(", ")}。
输出格式如下，Questions和Answer部分每一行开始都不要有任何空格：
---
Story:
...（英文标题和文章）

Questions:
1. 问题文本
A. 选项A
B. 选项B
C. 选项C
Answer: A

（重复5题）
`;

    console.log("[API] Generated prompt:", prompt);

    console.log("[API] Making request to Gemini API...");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    console.log("[API] Gemini API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] Gemini API error response:", errorText);

      // Check for geographical restriction error
      if (errorText.includes("User location is not supported")) {
        return NextResponse.json(
          {
            error: "地理位置限制：Google Gemini API在您所在的地区不可用",
            details: "请尝试使用VPN连接到支持的地区，或联系管理员更换API服务",
            technicalError: errorText,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: `Gemini API error: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(
      "[API] Gemini API response data:",
      JSON.stringify(data, null, 2)
    );

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("[API] Extracted result:", result);

    if (!result) {
      console.error("[API] No content received from Gemini API");
      return NextResponse.json(
        { error: "No content received from Gemini API", apiResponse: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("[API] Error generating content:", error);
    console.error("[API] Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to generate content",
        message: error.message,
        type: error.name,
      },
      { status: 500 }
    );
  }
}
