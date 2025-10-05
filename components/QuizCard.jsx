import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Brain, Sparkles } from "lucide-react";

export default function QuizCard({
  questions,
  options,
  answers,
  userAnswers,
  currentQuestion,
  score,
  user,
  loading,
  onCurrentQuestionChange,
  onAnswerChange,
  onSubmit,
  onGenerate,
}) {
  return (
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
              onClick={() => onCurrentQuestionChange(currentQuestion - 1)}
              className="font-bold text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              上一题
            </Button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onCurrentQuestionChange(index)}
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
              onClick={() => onCurrentQuestionChange(currentQuestion + 1)}
              className="font-bold text-base"
            >
              下一题
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Question */}
          <div className="bg-muted rounded-xl p-6 border border-border/50">
            <div className="text-lg font-semibold text-card-foreground mb-6">
              {questions[currentQuestion]}
            </div>
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
                        onChange={() => onAnswerChange(opt)}
                        className="hidden"
                      />
                      <div className="flex-1 text-lg">{opt}</div>
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
            {userAnswers.every((answer) => answer !== "") && score === null && (
              <div className="flex justify-center">
                <Button onClick={onSubmit} className="font-bold text-base">
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
                    你的得分：{score} / {questions.length * 20}
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
                    onClick={onGenerate}
                    disabled={loading}
                    className="font-bold text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        再来一篇
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
