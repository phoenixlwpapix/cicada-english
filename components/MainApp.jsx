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
import LevelSelectCard from "@/components/LevelSelectCard";
import QuizCard from "@/components/QuizCard";
import generatePrompt, { generateCustomPrompt } from "@/lib/prompt-generator";
import { processQuizSubmission } from "@/lib/quiz-data";
import { Sparkles, ArrowLeft } from "lucide-react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function MainApp() {
  const [story, setStory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("A2");
  const [currentStoryLevel, setCurrentStoryLevel] = useState("A2");

  const { width, height } = useWindowSize();
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [guestScore, setGuestScore] = useState(null);

  const handleModalClose = () => {
    setShowLoginModal(false);
    setGuestScore(null);
  };

  const storyRef = useRef(null);
  const storyCardRef = useRef(null);

  // Mutation for submitting quiz
  const submitQuizMutation = useMutation({
    mutationFn: processQuizSubmission,
    onSuccess: () => {
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

  // Scroll to story when loaded
  useEffect(() => {
    if (story && storyRef.current) {
      storyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [story]);

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
      localStorage.removeItem("cicada-session");
    }
  }, [user]);

  // Load saved session data on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("cicada-session");
      if (savedSession) {
        try {
          const sessionData = JSON.parse(savedSession);
          setStory(sessionData.story || "");
          setQuestions(sessionData.questions || []);
          setOptions(sessionData.options || []);
          setAnswers(sessionData.answers || []);
          setUserAnswers(sessionData.userAnswers || []);
          setCurrentQuestion(sessionData.currentQuestion || 0);
          setScore(sessionData.score || null);
          setCurrentStoryLevel(sessionData.currentStoryLevel || "A2");
        } catch (error) {
          console.error("Error loading saved session:", error);
          localStorage.removeItem("cicada-session");
        }
      }
    }
  }, []);

  // Save session data whenever relevant state changes
  useEffect(() => {
    if (typeof window !== "undefined" && story) {
      const sessionData = {
        story,
        questions,
        options,
        answers,
        userAnswers,
        currentQuestion,
        score,
        currentStoryLevel,
        timestamp: Date.now(),
      };
      localStorage.setItem("cicada-session", JSON.stringify(sessionData));
    }
  }, [
    story,
    questions,
    options,
    answers,
    userAnswers,
    currentQuestion,
    score,
    currentStoryLevel,
  ]);

  // Stop speech when quiz is shown
  useEffect(() => {
    if (questions.length > 0 && storyCardRef.current?.stopSpeaking) {
      storyCardRef.current.stopSpeaking();
    }
  }, [questions.length]);

  const handleGenerate = async (
    selectedLevel = level,
    customText = null,
    retryCount = 0
  ) => {
    if (typeof customText === "number") {
      retryCount = customText;
      customText = null;
    }

    const maxRetries = 2;
    setCurrentStoryLevel(selectedLevel);
    setLoading(true);
    setScore(null);
    setStory("");
    setQuestions("");
    localStorage.removeItem("cicada-session");

    try {
      const promptResult = customText
        ? generateCustomPrompt(customText, selectedLevel)
        : generatePrompt(selectedLevel);

      console.log(
        "[Frontend] Starting generation with:",
        "Level:",
        selectedLevel,
        "Custom Text:",
        !!customText,
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

      const textResponse = await res.text();
      let data;
      try {
        data = JSON.parse(textResponse);
        console.log("[Frontend] API response data:", data);
      } catch (parseError) {
        console.error("[Frontend] JSON parse error:", parseError);

        if (retryCount < maxRetries) {
          console.log(
            `[Frontend] Retrying request (attempt ${retryCount + 1}/${maxRetries})`
          );
          setTimeout(
            () => handleGenerate(selectedLevel, customText, retryCount + 1),
            1000 * (retryCount + 1)
          );
          return;
        }

        alert(`网络请求错误: 服务器返回了无效的响应格式，请稍后重试`);
        return;
      }

      if (!res.ok) {
        console.error("[Frontend] API error:", data);

        const isRetryableError =
          data.error?.includes("暂时不可用") ||
          data.error?.includes("服务返回格式错误") ||
          res.status === 502 ||
          res.status === 503 ||
          res.status === 504;

        if (isRetryableError && retryCount < maxRetries) {
          console.log(
            `[Frontend] Retrying due to retryable error (attempt ${retryCount + 1}/${maxRetries})`
          );
          setTimeout(
            () => handleGenerate(selectedLevel, customText, retryCount + 1),
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

      // 解析结果，提取故事和题目
      const parts = result.split(/Questions:/i);

      if (parts.length < 2) {
        console.error("[Frontend] Could not find 'Questions:' separator");
        alert("无法解析返回内容（未找到问题部分），请重试！");
        return;
      }

      const storyPart = parts[0].trim();
      const remainingPart = parts.slice(1).join("Questions:");

      // Remove ImagePrompt if present
      const questionParts = remainingPart.split(/ImagePrompt:/i);
      const questionsText = questionParts[0].trim();

      console.log("[Frontend] Story part length:", storyPart.length);
      console.log("[Frontend] Questions part length:", questionsText.length);

      const parsedStory = storyPart;
      const parsedQuestions = [];
      const parsedOptions = [];
      const parsedAnswers = [];

      if (!parsedStory) {
        console.error("[Frontend] Story content is empty");
        alert("无法解析故事内容，请重试！");
        return;
      }

      if (!questionsText) {
        console.error("[Frontend] Questions content is empty");
        alert("无法解析问题内容，请重试！");
        return;
      }

      if (questionsText) {
        const questionLines = questionsText.split("\n");
        let currentQuestion = "",
          currentOpts = [];

        for (let line of questionLines) {
          const trimmedLine = line.trim();

          if (/^\d+\.\s/.test(trimmedLine)) {
            if (currentQuestion) {
              parsedQuestions.push(currentQuestion);
              parsedOptions.push(currentOpts);
              currentOpts = [];
            }
            currentQuestion = trimmedLine;
          } else if (/^[ABC]\.\s/.test(trimmedLine)) {
            currentOpts.push(trimmedLine.slice(3));
          } else if (/^Answer:\s*/i.test(trimmedLine)) {
            const correctLetter = trimmedLine.split(":")[1].trim();
            const correctIndex = { A: 0, B: 1, C: 2 }[
              correctLetter.toUpperCase()
            ];
            if (correctIndex !== undefined && currentOpts[correctIndex]) {
              parsedAnswers.push(currentOpts[correctIndex]);
            }
          }
        }

        if (currentQuestion) {
          parsedQuestions.push(currentQuestion);
          parsedOptions.push(currentOpts);
        }
      }

      console.log("[Frontend] Final parsed data:");
      console.log(
        "  - Story word count:",
        parsedStory.split(/\s+/).filter((word) => word.length > 0).length
      );
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
    } catch (err) {
      console.error("[Frontend] Error fetching from Gemini API:", err);

      const isNetworkError =
        err.name === "TypeError" || err.message.includes("fetch");

      if (isNetworkError && retryCount < maxRetries) {
        console.log(
          `[Frontend] Retrying due to network error (attempt ${retryCount + 1}/${maxRetries})`
        );
        setTimeout(
          () => handleGenerate(selectedLevel, customText, retryCount + 1),
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

    if (!user) {
      setGuestScore(finalScore);
      setShowLoginModal(true);
      return;
    }

    await submitQuizMutation.mutateAsync({
      totalQuestions: answers.length,
      correctAnswers: correct,
      score: finalScore,
      user,
    });

    localStorage.removeItem("cicada-session");

    if (correct === questions.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleReset = () => {
    setStory("");
    setQuestions([]);
    setOptions([]);
    setAnswers([]);
    setUserAnswers([]);
    setCurrentQuestion(0);
    setScore(null);
    localStorage.removeItem("cicada-session");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
        {/* Hero section - hidden when content is loaded */}
        {!story && !loading && (
          <div className="text-center mb-10 animate-fade-in">
            <div className="flex flex-col items-center gap-5">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">
                  AI 英语阅读实验室
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-xl font-medium leading-relaxed">
                利用 AI 技术，为你量身定制有趣的英语故事和精炼的阅读理解练习
              </p>
            </div>
          </div>
        )}

        {!story && !loading && (
          <div className="max-w-3xl mx-auto">
            <LevelSelectCard
              level={level}
              loading={loading}
              onLevelChange={setLevel}
              onGenerate={(customText) => handleGenerate(level, customText)}
            />
          </div>
        )}

        {/* Back Button and Content Area */}
        {story && (
          <div className="mb-6 animate-fade-in flex items-center justify-between">
            <Button
              onClick={handleReset}
              variant="ghost"
              className="group hover:bg-primary/10 text-primary font-medium flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
            >
              <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">返回重新选择</span>
            </Button>

            {(loading || story) && questions.length > 0 && (
              <div className="hidden lg:flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  沉浸式阅读
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content Section: Story and Quiz - Desktop Split Layout */}
        <div className={`${story && questions.length > 0
          ? "lg:flex lg:gap-8 lg:items-start"
          : "max-w-3xl mx-auto"}`}
        >
          {/* 文章卡片 - Left Panel */}
          {(loading || story) && (
            <div className={`${story && questions.length > 0
              ? "lg:w-[54%] lg:flex-shrink-0 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-3 custom-scrollbar"
              : "w-full"}`}
            >
              <StoryCard
                loading={loading}
                story={story}
                storyRef={storyRef}
                onQuizStart={(stopSpeaking) => {
                  storyCardRef.current = { stopSpeaking };
                }}
              />
            </div>
          )}

          {/* 题目卡片 - Right Panel */}
          {questions.length > 0 && (
            <div className={`animate-fade-in ${story
              ? "mt-6 lg:mt-0 lg:w-[46%] lg:flex-shrink-0"
              : "w-full"}`}
            >
              <QuizCard
                questions={questions}
                options={options}
                answers={answers}
                userAnswers={userAnswers}
                currentQuestion={currentQuestion}
                score={score}
                user={user}
                loading={loading}
                onCurrentQuestionChange={setCurrentQuestion}
                onAnswerChange={handleAnswerChange}
                onSubmit={handleSubmit}
                onGenerate={() => handleGenerate(currentStoryLevel)}
                onMyScores={() => router.push("/dashboard")}
              />
            </div>
          )}
        </div>

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
