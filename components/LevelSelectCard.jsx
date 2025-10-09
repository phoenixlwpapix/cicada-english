import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren, BookOpen, GraduationCap, Award } from "lucide-react";

export default function LevelSelectCard({
  level,
  loading,
  onLevelChange,
  onGenerate,
}) {
  // CEFR级别描述信息
  const levelDescriptions = {
    A1: {
      text: "小学1-3年级，词汇量500-1000",
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    A2: {
      text: "小学4-6年级，词汇量1000-2000",
      icon: BookOpen,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    B1: {
      text: "初中，词汇量2000-3000",
      icon: GraduationCap,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    B2: {
      text: "高中，词汇量3000-4000",
      icon: Award,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  };

  const currentLevel = levelDescriptions[level] || levelDescriptions.A1;
  const IconComponent = currentLevel.icon;

  return (
    <section className="mb-16">
      <Card className="backdrop-blur-lg bg-card/70 border-border shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
        <CardContent className="space-y-6 px-4 sm:px-8 py-6 sm:py-8">
          {/* 难度选项卡片 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["A1", "A2", "B1", "B2"].map((lvl) => {
                const levelInfo = levelDescriptions[lvl];
                const LevelIcon = levelInfo.icon;
                const isSelected = level === lvl;

                return (
                  <Card
                    key={lvl}
                    onClick={() => onLevelChange(lvl)}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? `ring-2 ring-primary shadow-lg ${levelInfo.bgColor}`
                        : "hover:shadow-md bg-card"
                    }`}
                  >
                    <CardContent className="p-3 text-center space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <LevelIcon
                          className={`w-4 h-4 ${
                            isSelected
                              ? levelInfo.color
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`text-lg font-bold ${
                            isSelected ? levelInfo.color : "text-foreground"
                          }`}
                        >
                          {lvl}
                        </span>
                      </div>
                      <div
                        className={`text-sm ${
                          isSelected
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {levelInfo.text}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={() => onGenerate()}
              disabled={loading}
              className="font-bold text-base px-8 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: "var(--secondary2)" }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  AI生成中...
                </>
              ) : (
                <>
                  <Siren className="w-5 h-5 mr-2" />
                  点我生成文章
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
