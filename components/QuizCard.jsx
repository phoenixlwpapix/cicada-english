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
      <Card className="overflow-hidden border-border/60 shadow-2xl bg-card/50 backdrop-blur-xl group">
        <CardContent className="p-0 space-y-0">
          {/* Quiz Header */}
          <div className="p-6 bg-muted/30 border-b border-border/50">
            <div className="flex items-center justify-between mb-6">
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

              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-full px-4 py-1.5 border border-border/50 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  进度
                </span>
                <span className="text-sm font-black text-secondary">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                disabled={currentQuestion === 0}
                onClick={() => onCurrentQuestionChange(currentQuestion - 1)}
                className="hover:bg-secondary/10 hover:text-secondary group transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                上一题
              </Button>

              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onCurrentQuestionChange(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentQuestion
                      ? "bg-secondary w-8"
                      : userAnswers[index] !== ""
                        ? "bg-secondary/40"
                        : "bg-muted hover:bg-muted/80"
                      }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                disabled={currentQuestion === questions.length - 1}
                onClick={() => onCurrentQuestionChange(currentQuestion + 1)}
                className="hover:bg-secondary/10 hover:text-secondary group transition-all"
              >
                下一题
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Question Text */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-secondary rounded-full opacity-50" />
              <div className="text-xl font-bold text-card-foreground leading-relaxed">
                {questions[currentQuestion]}
              </div>
            </div>

            {/* Options */}
            <div className="grid gap-4">
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
                    className={`block cursor-pointer transition-all duration-300 ${score !== null ? "cursor-not-allowed" : "active:scale-95"
                      }`}
                  >
                    <div className={`group/option flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${optionStyle}`}>
                      <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg font-black transition-all duration-300 ${isSelected
                        ? "bg-secondary border-secondary text-white scale-110 shadow-lg shadow-secondary/20"
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

                      <div className="flex-1 text-lg font-medium leading-snug">
                        {opt}
                      </div>

                      {score !== null && (isCorrect || (isSelected && !isCorrect)) && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center animate-in zoom-in duration-300 ${isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }`}>
                          {isCorrect ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
            <div className="pt-6 border-t border-border/50">
              {userAnswers.every((answer) => answer !== "") && score === null && (
                <div className="flex justify-center">
                  <Button
                    onClick={onSubmit}
                    className="w-full sm:w-auto px-12 py-7 text-lg font-black rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                  >
                    <Brain className="w-6 h-6 mr-3" />
                    提交全部答案
                  </Button>
                </div>
              )}

              {score !== null && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="p-8 rounded-3xl bg-muted/30 border border-border/50 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />

                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary text-white mb-6 shadow-2xl shadow-secondary/20 rotate-3">
                      <Sparkles className="w-10 h-10" />
                    </div>

                    <h3 className="text-3xl font-black text-card-foreground mb-3">
                      最终得分：{score} / {questions.length * 20}
                    </h3>

                    <div className="text-xl font-medium mb-8">
                      {score / (questions.length * 20) === 1 && (
                        <p className="text-green-500 flex items-center justify-center gap-2">
                          🎉 完美无瑕！你是英语小能手！
                        </p>
                      )}
                      {score / (questions.length * 20) >= 0.8 &&
                        score / (questions.length * 20) < 1 && (
                          <p className="text-blue-500 font-bold">
                            🎆 太棒了！继续保持！
                          </p>
                        )}
                      {score / (questions.length * 20) >= 0.6 &&
                        score / (questions.length * 20) < 0.8 && (
                          <p className="text-amber-500 font-bold">
                            😊 不错哦！再努力一点就更好了！
                          </p>
                        )}
                      {score / (questions.length * 20) < 0.6 && (
                        <p className="text-orange-500 font-bold">
                          💪 加油！练习使人进步！
                        </p>
                      )}
                    </div>

                    <div className="max-w-md mx-auto h-4 bg-muted rounded-full overflow-hidden shadow-inner p-1">
                      <div
                        className="h-2 rounded-full bg-secondary shadow-[0_0_15px_rgba(51,169,216,0.5)] transition-all duration-1000 ease-out"
                        style={{
                          width: `${(score / (questions.length * 20)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                      onClick={onGenerate}
                      disabled={loading}
                      className="flex-1 sm:flex-none px-10 py-7 text-lg font-black bg-secondary2 hover:bg-secondary2/90 text-white rounded-2xl shadow-xl hover:shadow-secondary2/20 hover:-translate-y-1 transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      下一篇练习
                    </Button>
                    {user && (
                      <Button
                        onClick={onMyScores}
                        className="flex-1 sm:flex-none px-10 py-7 text-lg font-black bg-secondary hover:bg-secondary/90 text-white rounded-2xl shadow-xl hover:shadow-secondary/20 hover:-translate-y-1 transition-all duration-300"
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
