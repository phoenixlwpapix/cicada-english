import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren } from "lucide-react";

export default function LevelSelectCard({
  level,
  loading,
  onLevelChange,
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
                  {["A1", "A2", "B1", "B2", "X1"].map((lvl) => (
                    <Button
                      key={lvl}
                      variant={level === lvl ? "default" : "outline"}
                      size="sm"
                      onClick={() => onLevelChange(lvl)}
                      disabled={loading}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      {lvl}
                    </Button>
                  ))}
                </div>
                {/* 难度提示 */}
                <div className="text-center text-sm text-muted-foreground">
                  A1:小学1-3年级 A2:小学4-6年级 B1:初中 B2:高中 X1:天马行空
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => onGenerate()}
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
