"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppHeader from "@/components/AppHeader";
import { commonWords } from "@/lib/words"; // 1. 引入你的单词列表
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, Brain } from "lucide-react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks"; // 方便适配屏幕大小
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

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

  const [showConfetti, setShowConfetti] = useState(false);

  const storyRef = useRef(null);

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

  const handleGenerate = async (wordsToUse) => {
    setLoading(true);
    setScore(null);
    setStory("");
    setQuestions("");
    console.log("[Frontend] Starting generation with words:", wordsToUse);

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
      const data = await res.json();
      console.log("[Frontend] API response data:", data);

      if (!res.ok) {
        console.error("[Frontend] API error:", data);
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

  const handleSubmit = () => {
    let correct = 0;
    for (let i = 0; i < answers.length; i++) {
      if (userAnswers[i] === answers[i]) correct++;
    }
    setScore(correct * 20);

    if (correct === questions.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // 5 秒后关闭动画
    }
  };

  // 3. 为新按钮创建一个新的处理函数
  const handleRandomGenerate = () => {
    // 从单词列表中随机选5个
    const shuffled = [...commonWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 5);

    // 将单词数组转换成逗号分隔的字符串
    const selectedWordsString = selectedWords.join(", ");
    // <-- 新增：用随机生成的单词字符串来更新输入框的状态
    setWords(selectedWordsString);
    // 使用随机选出的单词字符串，调用我们的核心生成函数
    handleGenerate(selectedWordsString);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-900/50 dark:to-cyan-900/50 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-lg font-medium text-emerald-700 dark:text-emerald-300">
              知了英语AI阅读训练
            </span>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI将根据你输入的单词自动生成有趣的故事和阅读理解题，让学习充满乐趣！
          </p>
        </div>

        {/* 单词输入卡片 */}
        <section className="mb-16">
          <Card className="backdrop-blur-lg bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    输入至少一个单词
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    输入你想在文章中出现的英语单词，以空格分隔
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  value={words}
                  onChange={(e) => setWords(e.target.value)}
                  placeholder="例如：dog, sunny, friend, happy, school..."
                  className="min-h-[100px] text-base resize-none"
                  disabled={loading}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleGenerate(words)}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        AI生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        开启AI阅读
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleRandomGenerate}
                    disabled={loading}
                    // 给一个不同的样式来区分
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {/* 这里我们不需要复杂的加载状态，因为它很快 */}
                    <>
                      {/* 你可以换一个不同的图标 */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v2M12 4V2M8 4H6a2 2 0 0 0-2 2v2M4 12H2M20 12h2M12 20v2M4 16v2a2 2 0 0 0 2 2h2M20 16v2a2 2 0 0 1-2 2h-2M12 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4Z" />
                      </svg>
                      随机灵感
                    </>
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
              className="backdrop-blur-lg bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group animate-fade-in-up"
            >
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      阅读文章
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      仔细阅读下面的故事
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown>{story}</ReactMarkdown>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 题目卡片 */}
        {questions.length > 0 && (
          <div className="mt-12">
            <Card className="backdrop-blur-lg bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group animate-fade-in-up">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        阅读理解题
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        测试你的理解能力
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {currentQuestion + 1} / {questions.length}
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    className="rounded-xl bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700"
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
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-125"
                            : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    disabled={currentQuestion === questions.length - 1}
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="rounded-xl bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700"
                  >
                    下一题
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Question */}
                <div className="bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-700 dark:to-purple-900/20 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-6">
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
                                  ? "bg-purple-500 border-purple-500 text-white"
                                  : "border-slate-300 dark:border-slate-500 text-slate-500 dark:text-slate-400"
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
                <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
                  {userAnswers.every((answer) => answer !== "") &&
                    score === null && (
                      <Button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Brain className="w-5 h-5 mr-2" />
                        提交答案
                      </Button>
                    )}

                  {score !== null && (
                    <div className="space-y-4">
                      <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
                          <Sparkles className="w-8 h-8" />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                          你的得分：{score} / 100
                        </h3>

                        <div className="text-lg">
                          {score === 100 && (
                            <p className="text-green-600 dark:text-green-400 font-semibold flex items-center justify-center gap-2">
                              🎉 完美无瑕！你是英语小能手！
                            </p>
                          )}
                          {score >= 80 && score < 100 && (
                            <p className="text-blue-600 dark:text-blue-400 font-semibold">
                              🎆 太棒了！继续加油！
                            </p>
                          )}
                          {score >= 60 && score < 80 && (
                            <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                              😊 不错哦！再努力一点就更好了！
                            </p>
                          )}
                          {score < 60 && (
                            <p className="text-orange-600 dark:text-orange-400 font-semibold">
                              💪 加油！练习使人进步！
                            </p>
                          )}
                        </div>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-4">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 ease-out"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button
                          onClick={handleRandomGenerate}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          生成新的学习内容
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
