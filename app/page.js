"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppHeader from "@/components/AppHeader";
import { commonWords } from "@/lib/words"; // 1. 引入你的单词列表
import { processQuizSubmission, migrateLegacyData } from "@/lib/quiz-data";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Brain,
  Siren,
} from "lucide-react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks"; // 方便适配屏幕大小
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

  // Migrate legacy data on component mount
  useEffect(() => {
    migrateLegacyData();
  }, []);

  // Stop bouncing animation when generation starts
  useEffect(() => {
    if (loading) {
      setIsBouncing(false);
    }
  }, [loading]);

  const handleGenerate = async (wordsToUse, retryCount = 0) => {
    const maxRetries = 2;
    setLoading(true);
    setScore(null);
    setStory("");
    setQuestions("");
    console.log(
      "[Frontend] Starting generation with words:",
      wordsToUse,
      "Retry:",
      retryCount
    );

    try {
      const wordsArray = wordsToUse
        .split(",")
        .map((w) => w.trim())
        .filter((w) => w.length > 0);
      console.log("[Frontend] Processed words array:", wordsArray);

      if (wordsArray.length === 0) {
        alert("请输入至少一个单词！");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ words: wordsArray }),
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
            () => handleGenerate(wordsToUse, retryCount + 1),
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
            () => handleGenerate(wordsToUse, retryCount + 1),
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

      // 简单地解析结果（更好的做法是根据返回格式再细化）
      const storyMatch = result.match(/Story:\s*([\s\S]*?)\nQuestions:/i);
      const questionsBlock = result.match(/Questions:\s*([\s\S]*)/i);

      console.log("[Frontend] Story match:", storyMatch);
      console.log("[Frontend] Questions block:", questionsBlock);

      const parsedStory = storyMatch ? storyMatch[1].trim() : "";
      const parsedQuestions = [];
      const parsedOptions = [];
      const parsedAnswers = [];

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
          () => handleGenerate(wordsToUse, retryCount + 1),
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

  // 3. 为新按钮创建一个新的处理函数
  const handleRandomGenerate = () => {
    const shuffled = [...commonWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 5);
    const selectedWordsString = selectedWords.join(", ");

    setWords(selectedWordsString);

    handleGenerate(selectedWordsString);
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
                AI生成有趣的故事和阅读理解题，快来挑战吧！
              </h1>
            </div>
          </div>
        </div>

        {/* 单词输入卡片 */}
        <section className="mb-16">
          <Card className="backdrop-blur-lg bg-card/70 border-border shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="space-y-6">
              <div className="space-y-4 px-4">
                <div className="flex justify-center">
                  <Button
                    onClick={handleRandomGenerate}
                    disabled={loading}
                    className="font-bold text-base"
                    style={{ backgroundColor: "var(--secondary2)" }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        AI生成中...
                      </>
                    ) : (
                      <>
                        <Siren className="w-5 h-5 mr-2" />
                        点我随机生成
                      </>
                    )}
                  </Button>
                </div>

                <Textarea
                  value={words}
                  onChange={(e) => setWords(e.target.value)}
                  placeholder="或输入指定单词，如：dog, sunny, friend, happy, school..."
                  className="min-h-[60px] text-base resize-none"
                  disabled={loading}
                />

                <div className="flex justify-center">
                  <Button
                    onClick={() => handleGenerate(words)}
                    disabled={loading}
                    className="font-bold text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        AI生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        指定单词生成
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 文章卡片 */}
        {story && (
          <section className="mb-16">
            <Card
              ref={storyRef}
              className="backdrop-blur-lg bg-card/70 border-border shadow-xl hover:shadow-2xl transition-all duration-300 group animate-fade-in-up"
            >
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-secondary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-card-foreground">
                      阅读文章
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      仔细阅读下面的故事
                    </p>
                  </div>
                </div>

                <div className="text-lg bg-muted text-primary rounded-xl p-6 border border-border/50">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="mt-4" {...props} />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-2xl font-bold mt-6 mb-4"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-xl font-semibold mt-5 mb-3"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="ml-6 list-disc" {...props} />
                      ),
                    }}
                  >
                    {story}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 题目卡片 */}
        {questions.length > 0 && (
          <div className="mt-12">
            <Card className="backdrop-blur-lg bg-card/70 border-border shadow-xl hover:shadow-2xl transition-all duration-300 group animate-fade-in-up">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-secondary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-card-foreground">
                        阅读理解题
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        测试你的理解能力
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {currentQuestion + 1} / {questions.length}
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    className="font-bold text-base"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    上一题
                  </Button>

                  <div className="flex gap-2">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentQuestion
                            ? "bg-primary scale-125"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    disabled={currentQuestion === questions.length - 1}
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="font-bold text-base"
                  >
                    下一题
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Question */}
                <div className="bg-muted rounded-xl p-6 border border-border/50">
                  <p className="text-lg font-medium text-card-foreground mb-6">
                    {questions[currentQuestion]}
                  </p>
                  <div className="space-y-3">
                    {options[currentQuestion].map((opt, i) => {
                      const isSelected = userAnswers[currentQuestion] === opt;
                      const isCorrect = answers[currentQuestion] === opt;
                      const letters = ["A", "B", "C", "D"];

                      let optionStyle =
                        "bg-white dark:bg-slate-600 border-slate-200 dark:border-slate-500 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-500";

                      if (score !== null) {
                        if (isCorrect) {
                          optionStyle =
                            "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300";
                        } else if (isSelected && !isCorrect) {
                          optionStyle =
                            "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300";
                        }
                      } else if (isSelected) {
                        optionStyle =
                          "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300";
                      }

                      return (
                        <label
                          key={i}
                          className={`block cursor-pointer transition-all duration-200 ${
                            score !== null
                              ? "cursor-not-allowed"
                              : "hover:scale-[1.02]"
                          }`}
                        >
                          <div
                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${optionStyle}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                                isSelected
                                  ? "bg-secondary border-secondary text-primary-foreground"
                                  : "border-border text-muted-foreground"
                              }`}
                            >
                              {letters[i]}
                            </div>
                            <input
                              type="radio"
                              name={`question-${currentQuestion}`}
                              value={opt}
                              checked={isSelected}
                              disabled={score !== null}
                              onChange={() => handleAnswerChange(opt)}
                              className="hidden"
                            />
                            <span className="flex-1 text-base">{opt}</span>
                            {score !== null && isCorrect && (
                              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                            {score !== null && isSelected && !isCorrect && (
                              <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit and Results Section */}
                <div className="border-t border-border pt-6">
                  {userAnswers.every((answer) => answer !== "") &&
                    score === null && (
                      <div className="flex justify-center">
                        <Button
                          onClick={handleSubmit}
                          className="font-bold text-base"
                        >
                          <Brain className="w-5 h-5 mr-2" />
                          提交答案
                        </Button>
                      </div>
                    )}

                  {score !== null && (
                    <div className="space-y-4">
                      <div className="text-center p-6 rounded-xl bg-muted border border-border/50">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-primary-foreground mb-4">
                          <Sparkles className="w-8 h-8" />
                        </div>

                        <h3 className="text-2xl font-bold text-card-foreground mb-2">
                          你的得分：{score} / 100
                        </h3>

                        <div className="text-lg">
                          {score === 100 && (
                            <p className="text-green-600 dark:text-green-300 font-semibold flex items-center justify-center gap-2">
                              🎉 完美无瑕！你是英语小能手！
                            </p>
                          )}
                          {score >= 80 && score < 100 && (
                            <p className="text-blue-600 dark:text-blue-300 font-semibold">
                              🎆 太棒了！继续加油！
                            </p>
                          )}
                          {score >= 60 && score < 80 && (
                            <p className="text-yellow-600 dark:text-yellow-300 font-semibold">
                              😊 不错哦！再努力一点就更好了！
                            </p>
                          )}
                          {score < 60 && (
                            <p className="text-orange-600 dark:text-orange-300 font-semibold">
                              💪 加油！练习使人进步！
                            </p>
                          )}
                        </div>

                        <div className="w-full bg-muted rounded-full h-3 mt-4">
                          <div
                            className="h-3 rounded-full bg-accent transition-all duration-1000 ease-out"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button
                          onClick={handleRandomGenerate}
                          className="font-bold text-base"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          再来一篇
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Login Modal for Guest Users */}
        <Dialog open={showLoginModal} onOpenChange={handleModalClose}>
          <DialogContent>
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle>答题完成！</DialogTitle>
              <DialogDescription>
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
