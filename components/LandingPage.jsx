"use client";

import { Button } from "@/components/ui/button";
import {
  Sparkles,
  BookOpen,
  BrainCircuit,
  Mic2,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_50%_40%,var(--primary)_0%,transparent_100%)] opacity-10" />
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>AI 驱动的英语学习新体验</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary">
              让英语阅读 <br className="sm:hidden" /> 变得生动有趣
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              知了英语利用先进的 AI 技术，为您量身定制英语故事和互动练习。从 A1 到 B2，开启您的个性化阅读之旅。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 h-12 sm:h-14 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-secondary hover:opacity-90 text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 font-bold tracking-wide border-0"
                >
                  立即开始 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 h-12 sm:h-14 rounded-2xl border-2 border-border hover:border-primary hover:text-primary hover:bg-primary/5 text-muted-foreground transition-all duration-300 bg-transparent"
                >
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">核心功能</h2>
              <p className="text-muted-foreground">
                全方位的 AI 辅助，让学习更高效
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <FeatureCard
                icon={<BookOpen className="w-10 h-10 text-blue-500" />}
                title="AI 定制故事"
                description="根据您的英语水平（A1-B2）自动生成有趣且富有教育意义的故事。"
              />
              <FeatureCard
                icon={<BrainCircuit className="w-10 h-10 text-purple-500" />}
                title="互动阅读理解"
                description="即时生成针对故事内容的理解题目，巩固学习效果。"
              />
              <FeatureCard
                icon={<Mic2 className="w-10 h-10 text-orange-500" />}
                title="智能语音朗读"
                description="AI 语音朗读故事内容，提升听力与发音水平。"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center lg:text-left">
                  如何使用知了英语？
                </h2>
                <div className="space-y-5">
                  <Step
                    number="1"
                    title="选择您的等级"
                    description="从 A1 到 B2，选择最适合您当前水平的难度。"
                  />
                  <Step
                    number="2"
                    title="生成专属故事"
                    description="AI 将在几秒钟内为您创作一篇全新的英语短文。"
                  />
                  <Step
                    number="3"
                    title="阅读与练习"
                    description="阅读故事，听语音朗读，并完成随堂测试。"
                  />
                  <Step
                    number="4"
                    title="追踪进度"
                    description="在个人仪表盘查看您的成绩统计和成长曲线。"
                  />
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 shadow-2xl border border-border">
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold">学习统计</h4>
                        <p className="text-xs text-muted-foreground">
                          实时追踪您的进步
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[75%]" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>阅读准确率</span>
                        <span className="font-bold">75%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-20 bg-muted/50 rounded-lg" />
                        <div className="h-20 bg-primary/20 rounded-lg" />
                        <div className="h-20 bg-muted/50 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              准备好提升您的英语水平了吗？
            </h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto">
              加入成千上万的学习者，体验 AI 带来的学习革命
            </p>
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="text-base sm:text-lg px-8 sm:px-10 h-12 sm:h-14 rounded-2xl font-bold hover:scale-105 transition-transform"
              >
                免费注册并开始学习
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
      <div className="mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
        {number}
      </div>
      <div className="pt-1">
        <h3 className="font-bold text-base md:text-lg mb-1">{title}</h3>
        <p className="text-sm md:text-base text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
