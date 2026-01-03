"use client";

import { Button } from "@/components/ui/button";
import {
  Sparkles,
  BookOpen,
  BrainCircuit,
  Image as ImageIcon,
  Mic2,
  ArrowRight,
  CheckCircle2,
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
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--primary-muted)_0%,transparent_100%)] opacity-20" />
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>AI 驱动的英语学习新体验</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              让英语阅读 <br /> 变得生动有趣
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              知了英语利用先进的 AI
              技术，为您量身定制英语故事、互动练习和精美插画。 从 A2 到
              C2，开启您的个性化阅读之旅。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="text-lg px-8 h-14 rounded-full bg-gradient-to-r from-[#03396c] via-[#2481b8] to-[#33a9d8] hover:from-[#022b52] hover:via-[#1a6a9b] hover:to-[#2888b0] text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 font-bold tracking-wide border-0"
                >
                  立即开始 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 h-14 rounded-full border-2 border-slate-200 hover:border-[#33a9d8] hover:text-[#33a9d8] hover:bg-blue-50/50 text-slate-600 transition-all duration-300 bg-transparent"
                >
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">核心功能</h2>
              <p className="text-muted-foreground">
                全方位的 AI 辅助，让学习更高效
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<BookOpen className="w-10 h-10 text-blue-500" />}
                title="AI 定制故事"
                description="根据您的英语水平（A2-C2）自动生成有趣且富有教育意义的故事。"
              />
              <FeatureCard
                icon={<BrainCircuit className="w-10 h-10 text-purple-500" />}
                title="互动阅读理解"
                description="即时生成针对故事内容的理解题目，巩固学习效果。"
              />
              <FeatureCard
                icon={<ImageIcon className="w-10 h-10 text-pink-500" />}
                title="精美 AI 插画"
                description="为每个故事生成独特的视觉插图，增强阅读沉浸感。"
              />
              <FeatureCard
                icon={<Mic2 className="w-10 h-10 text-orange-500" />}
                title="智能语音朗读"
                description="支持多种音色朗读故事，提升听力与发音水平。"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                  如何使用知了英语？
                </h2>
                <div className="space-y-6">
                  <Step
                    number="1"
                    title="选择您的等级"
                    description="从 A2 到 C2，选择最适合您当前水平的难度。"
                  />
                  <Step
                    number="2"
                    title="生成专属故事"
                    description="AI 将在几秒钟内为您创作一篇全新的英语短文。"
                  />
                  <Step
                    number="3"
                    title="阅读与练习"
                    description="阅读故事，查看插画，并完成随堂测试。"
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
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              准备好提升您的英语水平了吗？
            </h2>
            <p className="text-xl opacity-90 mb-10">
              加入成千上万的学习者，体验 AI 带来的学习革命。
            </p>
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 h-16 rounded-full font-bold"
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
    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
