// app/api/generate/route.js
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  console.log("[API] POST request received");

  try {
    const body = await req.json();
    const { prompt } = body;

    console.log("[API] Request body:", body);
    console.log("[API] Prompt received:", prompt);

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      console.error("[API] Invalid prompt input:", prompt);
      return NextResponse.json(
        {
          error: "Invalid prompt input. Please provide a valid prompt string.",
        },
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

    console.log("[API] Using provided prompt:", prompt);

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
            details: "请尝试切换IP至支持的地区，或联系管理员更换API服务",
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
