"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppHeader from "@/components/AppHeader";
import StoryCard from "@/components/StoryCard";
import WordInputCard from "@/components/WordInputCard";
import QuizCard from "@/components/QuizCard";
import generatePrompt from "@/lib/prompt-generator";
import { processQuizSubmission } from "@/lib/quiz-data";
import { BookOpen } from "lucide-react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generatePortrait, base64ToBlobUrl } from "@/lib/image-generator";

export default function HomePage() {
  const [words, setWords] = useState("");
  const [story, setStory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("A2");
  const [length, setLength] = useState(200);

  // Image generation states
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [imagePrompt, setImagePrompt] = useState("");

  const { width, height } = useWindowSize();
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [guestScore, setGuestScore] = useState(null);
  const [isBouncing, setIsBouncing] = useState(true);

  const handleModalClose = () => {
    setShowLoginModal(false);
    setGuestScore(null);
  };

  const storyRef = useRef(null);

  // Mutation for submitting quiz
  const submitQuizMutation = useMutation({
    mutationFn: processQuizSubmission,
    onSuccess: () => {
      // Invalidate all dashboard-related queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "userStats" ||
          query.queryKey[0] === "quizAttempts" ||
          query.queryKey[0] === "leaderboard",
      });
    },
    onError: (error) => {
      console.error("Error submitting quiz:", error);
      alert("提交成绩时出错，请重试。");
    },
  });

  // --- 在这里添加下面的代码 ---
  useEffect(() => {
    // 检查 story 是否有内容，并且 ref 已经附加到 DOM 元素上
    if (story && storyRef.current) {
      storyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [story]); // 依赖项数组是关键，这个 effect 只在 `story` 状态改变时运行

  // Stop bouncing animation when generation starts
  useEffect(() => {
    if (loading) {
      setIsBouncing(false);
    }
  }, [loading]);

  // Clear all content when user logs out
  useEffect(() => {
    if (user === null) {
      setStory("");
      setQuestions([]);
      setOptions([]);
      setAnswers([]);
      setUserAnswers([]);
      setCurrentQuestion(0);
      setScore(null);
      setGeneratedImage(null);
      setImageLoading(false);
      setImageError(null);
      setImagePrompt("");
    }
  }, [user]);

  // Generate image after story is successfully created (only for logged-in users)
  useEffect(() => {
    if (
      user &&
      story &&
      !loading &&
      !generatedImage &&
      !imageLoading &&
      !imageError
    ) {
      if (imagePrompt) {
        console.log(
          "[Image Generation] Using extracted ImagePrompt:",
          imagePrompt
        );
        generateImage(imagePrompt);
      } else {
        // Fallback to using story content if no ImagePrompt is found
        const fallbackPrompt = `Create a child-friendly educational illustration for this story: "${story
          .replace(/ImagePrompt:[\s\S]*/, "")
          .trim()}"`;
        console.log(
          "[Image Generation] No ImagePrompt found, using fallback:",
          fallbackPrompt
        );
        generateImage(fallbackPrompt);
      }
    }
  }, [user, story, loading, imagePrompt]);

  const handleGenerate = async (
    selectedDifficulty = difficulty,
    selectedLength = length,
    retryCount = 0
  ) => {
    const maxRetries = 2;
    setLoading(true);
    setScore(null);
    setStory("");
    setQuestions("");
    setGeneratedImage(null);
    setImageError(null);
    setImagePrompt("");

    try {
      // Generate the prompt using the component
      const promptResult = generatePrompt(selectedDifficulty, selectedLength);

      // Set the generated words, name, and category
      setWords(promptResult.words);

      console.log(
        "[Frontend] Starting generation with words:",
        promptResult.words,
        "Difficulty:",
        selectedDifficulty,
        "Length:",
        selectedLength,
        "Name:",
        promptResult.name,
        "Category:",
        promptResult.category,
        "Writing Style:",
        promptResult.writingStyle,
        "Narrative Drive:",
        promptResult.narrativeDrive,
        "Tone:",
        promptResult.tone,
        "Retry:",
        retryCount
      );

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptResult.prompt,
        }),
      });

      console.log("[Frontend] API response status:", res.status);

      let data;
      try {
        data = await res.json();
        console.log("[Frontend] API response data:", data);
      } catch (parseError) {
        console.error("[Frontend] JSON parse error:", parseError);
        const textResponse = await res.text();
        console.error(
          "[Frontend] Raw response:",
          textResponse.substring(0, 200)
        );

        // If it's a JSON parse error and we haven't exceeded retries, try again
        if (retryCount < maxRetries) {
          console.log(
            `[Frontend] Retrying request (attempt ${
              retryCount + 1
            }/${maxRetries})`
          );
          setTimeout(
            () =>
              handleGenerate(
                selectedDifficulty,
                selectedLength,
                retryCount + 1
              ),
            1000 * (retryCount + 1)
          );
          return;
        }

        alert(`网络请求错误: 服务器返回了无效的响应格式，请稍后重试`);
        return;
      }

      if (!res.ok) {
        console.error("[Frontend] API error:", data);

        // Check for specific error types that might benefit from retry
        const isRetryableError =
          data.error?.includes("暂时不可用") ||
          data.error?.includes("服务返回格式错误") ||
          res.status === 502 ||
          res.status === 503 ||
          res.status === 504;

        if (isRetryableError && retryCount < maxRetries) {
          console.log(
            `[Frontend] Retrying due to retryable error (attempt ${
              retryCount + 1
            }/${maxRetries})`
          );
          setTimeout(
            () =>
              handleGenerate(
                selectedDifficulty,
                selectedLength,
                retryCount + 1
              ),
            2000 * (retryCount + 1)
          );
          return;
        }

        alert(`生成失败: ${data.error || "未知错误"}`);
        return;
      }

      const result = data.result;

      if (!result) {
        console.error("[Frontend] No result received from API");
        alert("API返回的内容为空，请重试！");
        return;
      }

      console.log("[Frontend] Raw result from API:", result);

      // 解析结果，提取故事、题目和图像提示
      // 查找故事部分：从##开始到Questions:结束
      const storyMatch = result.match(/##[\s\S]*?(?=Questions:)/i);
      const questionsBlock = result.match(
        /Questions:\s*([\s\S]*?)(?=ImagePrompt:)/i
      );
      const imagePromptMatch = result.match(/ImagePrompt:\s*([\s\S]*)/i);

      console.log("[Frontend] Story match:", storyMatch);
      console.log("[Frontend] Questions block:", questionsBlock);
      console.log("[Frontend] ImagePrompt match:", imagePromptMatch);

      const parsedStory = storyMatch ? storyMatch[0].trim() : "";
      const parsedQuestions = [];
      const parsedOptions = [];
      const parsedAnswers = [];
      const parsedImagePrompt = imagePromptMatch
        ? imagePromptMatch[1].trim()
        : "";

      if (!storyMatch) {
        console.error("[Frontend] Could not parse story from result");
        alert("无法解析故事内容，请重试！");
        return;
      }

      if (!questionsBlock) {
        console.error("[Frontend] Could not parse questions from result");
        alert("无法解析问题内容，请重试！");
        return;
      }

      if (questionsBlock) {
        const questionLines = questionsBlock[1].trim().split("\n");
        let currentQuestion = "",
          currentOpts = [];

        for (let line of questionLines) {
          if (/^\d+\.\s/.test(line)) {
            if (currentQuestion) {
              parsedQuestions.push(currentQuestion);
              parsedOptions.push(currentOpts);
              currentOpts = [];
            }
            currentQuestion = line;
          } else if (/^[ABC]\.\s/.test(line)) {
            currentOpts.push(line.slice(3)); // remove "A. "
          } else if (/^Answer:\s*/i.test(line)) {
            const correctLetter = line.trim().split(":")[1].trim();
            const correctIndex = { A: 0, B: 1, C: 2 }[
              correctLetter.toUpperCase()
            ];
            parsedAnswers.push(currentOpts[correctIndex]);
          }
        }

        // Push last question
        if (currentQuestion) {
          parsedQuestions.push(currentQuestion);
          parsedOptions.push(currentOpts);
        }
      }

      console.log("[Frontend] Final parsed data:");
      console.log("  - Story length:", parsedStory.length);
      console.log("  - Questions count:", parsedQuestions.length);
      console.log("  - Options count:", parsedOptions.length);
      console.log("  - Answers count:", parsedAnswers.length);

      if (parsedQuestions.length === 0) {
        console.error("[Frontend] No questions were parsed");
        alert("未找到问题，请重试！");
        return;
      }

      if (parsedQuestions.length !== parsedAnswers.length) {
        console.error(
          "[Frontend] Mismatch between questions and answers count"
        );
        alert("问题和答案数量不匹配，请重试！");
        return;
      }

      setStory(parsedStory);
      setQuestions(parsedQuestions);
      setOptions(parsedOptions);
      setAnswers(parsedAnswers);
      setUserAnswers(Array(parsedQuestions.length).fill(""));
      setCurrentQuestion(0);
      setImagePrompt(parsedImagePrompt);
    } catch (err) {
      console.error("[Frontend] Error fetching from Gemini API:", err);

      // Check if this is a network error that might benefit from retry
      const isNetworkError =
        err.name === "TypeError" || err.message.includes("fetch");

      if (isNetworkError && retryCount < maxRetries) {
        console.log(
          `[Frontend] Retrying due to network error (attempt ${
            retryCount + 1
          }/${maxRetries})`
        );
        setTimeout(
          () =>
            handleGenerate(selectedDifficulty, selectedLength, retryCount + 1),
          2000 * (retryCount + 1)
        );
        return;
      }

      alert(`网络请求错误: ${err.message || "请检查网络连接"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (value) => {
    const updated = [...userAnswers];
    updated[currentQuestion] = value;
    setUserAnswers(updated);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 300);
  };

  const handleSubmit = async () => {
    let correct = 0;
    for (let i = 0; i < answers.length; i++) {
      if (userAnswers[i] === answers[i]) correct++;
    }
    const finalScore = correct * 20;
    setScore(finalScore);

    // Check if user is authenticated
    if (!user) {
      // Show modal for guest users
      setGuestScore(finalScore);
      setShowLoginModal(true);
      return;
    }

    // Use mutation to submit quiz
    await submitQuizMutation.mutateAsync({
      totalQuestions: answers.length,
      correctAnswers: correct,
      score: finalScore,
      user,
    });

    if (correct === questions.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // 5 秒后关闭动画
    }
  };

  // Generate image using the provided ImagePrompt
  const generateImage = async (imagePrompt) => {
    setImageLoading(true);
    setImageError(null);

    try {
      const imageData = await generatePortrait(imagePrompt);
      const imageUrl = base64ToBlobUrl(imageData, "image/png");
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Image generation failed:", error);
      setImageError("图片生成失败，请重试");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10">
              <BookOpen className="w-8 h-8 text-primary dark:text-primary" />
              <h1 className="text-2xl font-bold text-primary">
                AI生成英语故事和阅读理解
              </h1>
            </div>
          </div>
        </div>

        <WordInputCard
          difficulty={difficulty}
          length={length}
          loading={loading}
          onDifficultyChange={setDifficulty}
          onLengthChange={setLength}
          onGenerate={handleGenerate}
        />

        {/* 文章卡片 */}
        {(loading || story) && (
          <section className="mb-16">
            <StoryCard
              loading={loading}
              story={story}
              user={user}
              imageLoading={imageLoading}
              imageError={imageError}
              generatedImage={generatedImage}
              storyRef={storyRef}
            />
          </section>
        )}

        {questions.length > 0 && (
          <QuizCard
            questions={questions}
            options={options}
            answers={answers}
            userAnswers={userAnswers}
            currentQuestion={currentQuestion}
            score={score}
            user={user}
            onCurrentQuestionChange={setCurrentQuestion}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmit}
            onGenerate={handleGenerate}
          />
        )}

        {/* Login Modal for Guest Users */}
        <Dialog open={showLoginModal} onOpenChange={handleModalClose}>
          <DialogContent aria-describedby="dialog-description">
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle>答题完成！</DialogTitle>
              <DialogDescription id="dialog-description">
                您的得分是 {guestScore} / 100 分
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                登录后可以保存您的成绩并查看详细统计数据
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleModalClose}>
                稍后登录
              </Button>
              <Button
                onClick={() => {
                  handleModalClose();
                  router.push("/login");
                }}
              >
                立即登录
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confetti Effect */}
        {showConfetti && (
          <ReactConfetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 9999,
            }}
          />
        )}
      </main>
    </div>
  );
}
