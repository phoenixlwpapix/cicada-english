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
  onMyScores,
}) {
  return (
    <div className="animate-fade-in-up transition-all duration-500">
      <Card className="overflow-hidden border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl">
        <CardContent className="p-0 space-y-0">
          {/* Quiz Header */}
          <div className="p-5 sm:p-6 bg-muted/30 border-b border-border/50">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-secondary text-primary-foreground shadow-lg">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-card-foreground">
                    阅读理解题
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    测试你的理解能力
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-border/50">
                <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
                  进度
                </span>
                <span className="text-sm font-bold text-secondary">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentQuestion === 0}
                onClick={() => onCurrentQuestionChange(currentQuestion - 1)}
                className="hover:bg-secondary/10 hover:text-secondary group transition-all px-2 sm:px-4"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-1 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">上一题</span>
              </Button>

              <div className="flex gap-1.5 sm:gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onCurrentQuestionChange(index)}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentQuestion
                      ? "bg-secondary w-6 sm:w-8"
                      : userAnswers[index] !== ""
                        ? "bg-secondary/40 hover:bg-secondary/60"
                        : "bg-muted hover:bg-muted-foreground/30"
                      }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                disabled={currentQuestion === questions.length - 1}
                onClick={() => onCurrentQuestionChange(currentQuestion + 1)}
                className="hover:bg-secondary/10 hover:text-secondary group transition-all px-2 sm:px-4"
              >
                <span className="hidden sm:inline">下一题</span>
                <ArrowRight className="w-4 h-4 sm:ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="p-5 sm:p-6 md:p-8 space-y-6">
            {/* Question Text */}
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 w-1 h-full bg-secondary rounded-full opacity-60" />
              <div className="text-lg sm:text-xl font-bold text-card-foreground leading-relaxed">
                {questions[currentQuestion]}
              </div>
            </div>

            {/* Options */}
            <div className="grid gap-3">
              {options[currentQuestion].map((opt, i) => {
                const isSelected = userAnswers[currentQuestion] === opt;
                const isCorrect = answers[currentQuestion] === opt;
                const letters = ["A", "B", "C", "D"];

                let optionStyle = "bg-background/40 border-border/60 hover:border-secondary/50 hover:bg-secondary/5 shadow-sm";

                if (score !== null) {
                  if (isCorrect) {
                    optionStyle = "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300 shadow-green-500/10";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300 shadow-red-500/10";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-secondary/10 border-secondary shadow-secondary/10 scale-[1.02]";
                }

                return (
                  <label
                    key={i}
                    className={`block cursor-pointer transition-all duration-300 ${score !== null ? "cursor-not-allowed" : "active:scale-[0.98]"
                      }`}
                  >
                    <div className={`group/option flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 ${optionStyle}`}>
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 border-2 flex items-center justify-center text-base sm:text-lg font-bold transition-all duration-300 ${isSelected
                        ? "bg-secondary border-secondary text-white shadow-md shadow-secondary/20"
                        : "border-border/60 text-muted-foreground group-hover/option:border-secondary/50 group-hover/option:text-secondary"
                        }`}>
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

                      <div className="flex-1 text-base sm:text-lg font-medium leading-snug">
                        {opt}
                      </div>

                      {score !== null && (isCorrect || (isSelected && !isCorrect)) && (
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center animate-in zoom-in duration-300 ${isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }`}>
                          {isCorrect ? (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Submit and Results Section */}
            <div className="pt-5 border-t border-border/50">
              {userAnswers.every((answer) => answer !== "") && score === null && (
                <div className="flex justify-center">
                  <Button
                    onClick={onSubmit}
                    className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-bold rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    提交全部答案
                  </Button>
                </div>
              )}

              {score !== null && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="p-6 sm:p-8 rounded-2xl bg-muted/30 border border-border/50 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />

                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary text-white mb-5 shadow-xl shadow-secondary/20 rotate-3">
                      <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">
                      最终得分：{score} / {questions.length * 20}
                    </h3>

                    <div className="text-lg sm:text-xl font-medium mb-6">
                      {score / (questions.length * 20) === 1 && (
                        <p className="text-green-500 flex items-center justify-center gap-2">
                          完美无瑕！你是英语小能手！
                        </p>
                      )}
                      {score / (questions.length * 20) >= 0.8 &&
                        score / (questions.length * 20) < 1 && (
                          <p className="text-blue-500 font-bold">
                            太棒了！继续保持！
                          </p>
                        )}
                      {score / (questions.length * 20) >= 0.6 &&
                        score / (questions.length * 20) < 0.8 && (
                          <p className="text-amber-500 font-bold">
                            不错哦！再努力一点就更好了！
                          </p>
                        )}
                      {score / (questions.length * 20) < 0.6 && (
                        <p className="text-orange-500 font-bold">
                          加油！练习使人进步！
                        </p>
                      )}
                    </div>

                    <div className="max-w-sm mx-auto h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full bg-secondary shadow-[0_0_10px_rgba(51,169,216,0.4)] transition-all duration-1000 ease-out"
                        style={{
                          width: `${(score / (questions.length * 20)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button
                      onClick={onGenerate}
                      disabled={loading}
                      className="flex-1 sm:flex-none px-8 py-5 text-base font-bold bg-secondary2 hover:bg-secondary2/90 text-white rounded-xl shadow-lg shadow-secondary2/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      下一篇练习
                    </Button>
                    {user && (
                      <Button
                        onClick={onMyScores}
                        className="flex-1 sm:flex-none px-8 py-5 text-base font-bold bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-lg shadow-secondary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                      >
                        查看成绩单
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
