import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren } from "lucide-react";

export default function WordInputCard({
  difficulty,
  length,
  loading,
  onDifficultyChange,
  onLengthChange,
  onGenerate,
}) {
  return (
    <section className="mb-16">
      <Card className="backdrop-blur-lg bg-card/70 border-border shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <CardContent className="space-y-4 px-3 sm:px-6 py-4 sm:py-6">
          <div className="space-y-4 px-2 sm:px-4">
            <div className="space-y-4">
              {/* 难度选项 */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 rounded-lg p-3">
                  <span className="text-lg font-medium text-primary/90 mr-2">
                    CEFR水平:
                  </span>
                  {["A1", "A2", "B1", "B2"].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => onDifficultyChange(level)}
                      disabled={loading}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                {/* 难度提示 */}
                <div className="text-center text-sm text-muted-foreground">
                  A1:小学1-3年级 A2:小学4-6年级 B1:初中 B2:高中
                </div>
              </div>

              {/* 长度选项 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 rounded-lg p-2 sm:p-3">
                <span className="text-base sm:text-lg font-medium text-primary/90">
                  文章长度:
                </span>
                <input
                  type="range"
                  min="200"
                  max="400"
                  step="50"
                  value={length}
                  onChange={(e) => onLengthChange(Number(e.target.value))}
                  disabled={loading}
                  className="w-48 sm:w-48 accent-primary/80"
                />
                <span className="text-sm sm:text-base">{length} 字</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => onGenerate(difficulty, length)}
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
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
