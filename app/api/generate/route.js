// app/api/generate/route.js
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  console.log("[API] POST request received");

  try {
    const body = await req.json();
    const { words, difficulty = "A1", length = 300, name, category } = body;

    console.log("[API] Request body:", body);
    console.log("[API] Words received:", words);
    console.log("[API] Difficulty:", difficulty);
    console.log("[API] Length:", length);
    console.log("[API] Name:", name);
    console.log("[API] Category:", category);

    // Use provided name and category, or default if not provided
    const selectedName = name || "Alex";
    const selectedCategory = category || "日常";

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

    const difficultyDesc = {
      A1: "非常基础，简单词汇和句子，适合初学者",
      A2: "基础水平，常见词汇和简单句型",
      B1: "中级水平，更多词汇和句型",
      B2: "中高级水平，复杂词汇和句型",
    };

    const prompt = `
你是一名面向中国中小学生的英语阅读教师。请根据给定的单词编写一篇约${length}词的英语短文。随后设计5道英文阅读理解单选题，并在最后生成简短的适用于图像AI生成的ImagePrompt：

文章要求：主人公名字为${selectedName}。内容语言清晰简洁，难度为CEFR ${difficulty}水平 (${
      difficultyDesc[difficulty]
    })，类别为${selectedCategory}。文章标题用二号标题(##)。
出题要求：每题提供 A/B/C 三个选项；明确标注正确答案；正确答案在 A、B、C 中分布均衡，不集中在同一个选项。

单词列表：${words.join(", ")}。
输出格式如下，Questions和Answer部分每一行开始都不要有任何空格,并且单词列表中出现的单词用黑体标注（**）：
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

ImagePrompt:（根据文章总结的用于图像生成的提示词，标明绘制适合青少年的明快卡通图像）
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
    console.log(
      "[API] Response headers:",
      Object.fromEntries(response.headers.entries())
    );

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

    // Check content type before parsing JSON
    const contentType = response.headers.get("content-type");
    console.log("[API] Response content type:", contentType);

    if (!contentType || !contentType.includes("application/json")) {
      const textContent = await response.text();
      console.error("[API] Unexpected content type:", contentType);
      console.error(
        "[API] Response content preview:",
        textContent.substring(0, 200)
      );

      // Check if it's an HTML error page
      if (textContent.trim().startsWith("<") || textContent.includes("<html")) {
        return NextResponse.json(
          {
            error: "AI 服务暂时不可用，请稍后重试",
            details: "收到 HTML 错误页面而不是预期的 JSON 响应",
            technicalError: `Content-Type: ${contentType}, Response starts with: ${textContent.substring(
              0,
              50
            )}...`,
          },
          { status: 502 }
        );
      }

      return NextResponse.json(
        {
          error: "AI 服务返回格式错误",
          details: `意外的内容类型: ${contentType}`,
          technicalError: textContent.substring(0, 200),
        },
        { status: 502 }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("[API] JSON parse error:", parseError);
      const textContent = await response.text();
      console.error(
        "[API] Raw response content:",
        textContent.substring(0, 200)
      );

      return NextResponse.json(
        {
          error: "AI 服务返回的数据格式错误",
          details: "无法解析 JSON 响应",
          technicalError: `Parse error: ${
            parseError.message
          }, Content preview: ${textContent.substring(0, 100)}...`,
        },
        { status: 502 }
      );
    }
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
