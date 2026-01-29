import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Siren,
  BookOpen,
  GraduationCap,
  Award,
  Sprout,
  PenTool,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function LevelSelectCard({
  level,
  loading,
  onLevelChange,
  onGenerate,
}) {
  const [mode, setMode] = useState("random"); // 'random' or 'custom'
  const [customText, setCustomText] = useState("");

  // CEFR级别描述信息
  const levelDescriptions = {
    A1: {
      text: "小学1 - 3年级，词汇量500-1000",
      icon: Sprout,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    A2: {
      text: "小学4 - 6年级，词汇量1000-2000",
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
    <section className="mb-8">
      <Card className="backdrop-blur-lg bg-card/80 border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <CardContent className="space-y-5 px-5 py-6 md:px-8 md:py-8">
          {/* Mode Selection */}
          <div className="flex justify-center">
            <div className="bg-muted/50 p-1.5 rounded-xl inline-flex gap-1">
              <button
                onClick={() => setMode("random")}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "random"
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  随机生成
                </div>
              </button>
              <button
                onClick={() => setMode("custom")}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "custom"
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  自定义文章
                </div>
              </button>
            </div>
          </div>

          {/* 难度选项卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {["A1", "A2", "B1", "B2"].map((lvl) => {
              const levelInfo = levelDescriptions[lvl];
              const LevelIcon = levelInfo.icon;
              const isSelected = level === lvl;

              return (
                <div
                  key={lvl}
                  onClick={() => onLevelChange(lvl)}
                  className={`cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] p-4 text-center space-y-2 rounded-xl border-2 ${
                    isSelected
                      ? `shadow-lg ${levelInfo.bgColor} border-current ${levelInfo.color}`
                      : "hover:shadow-md bg-card/50 border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? levelInfo.bgColor : 'bg-muted/50'}`}>
                      <LevelIcon
                        className={`w-4 h-4 ${
                          isSelected ? levelInfo.color : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xl font-bold ${
                        isSelected ? levelInfo.color : "text-foreground"
                      }`}
                    >
                      {lvl}
                    </span>
                  </div>
                  <div
                    className={`text-xs leading-relaxed ${
                      isSelected ? "text-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {levelInfo.text.split("，").map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Text Input */}
          {mode === "custom" && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300 space-y-3">
              <Label htmlFor="custom-text" className="text-sm font-medium">
                粘贴您的文章（支持中文，AI将自动翻译并生成题目）
              </Label>
              <Textarea
                id="custom-text"
                placeholder="在此粘贴文章内容..."
                className="min-h-[120px] resize-none rounded-xl border-border/50 focus:border-primary"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
            </div>
          )}

          {/* 生成按钮 */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={() =>
                onGenerate(mode === "custom" ? customText : undefined)
              }
              disabled={loading || (mode === "custom" && !customText.trim())}
              className="font-bold text-base bg-secondary2 hover:bg-secondary2/90 px-10 py-6 rounded-xl shadow-lg shadow-secondary2/20 hover:shadow-xl hover:shadow-secondary2/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  AI生成中...
                </>
              ) : (
                <>
                  <Siren className="w-5 h-5 mr-2" />
                  {mode === "custom" ? "基于文本生成" : "点我生成文章"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
