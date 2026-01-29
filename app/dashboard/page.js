"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookOpen, Target, Award, Home } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import {
  getUserStats,
  getQuizAttemptsForPeriod,
  getWeeklyLeaderboard,
} from "@/lib/quiz-data";

const chartConfig = {
  score: {
    label: "分数",
    color: "var(--secondary)",
  },
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const hasBeenLoggedIn = useRef(false);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    if (user) {
      hasBeenLoggedIn.current = true;
    }

    if (!loading && !user) {
      // If user was previously logged in (logout), go to home
      // If user was never logged in (direct access), go to login
      if (hasBeenLoggedIn.current) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // Helper function to group attempts by date
  const groupByDate = (attempts) => {
    const grouped = {};
    attempts.forEach((attempt) => {
      const date = new Date(attempt.created_at).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(attempt.score);
    });
    return Object.entries(grouped).map(([date, scores]) => ({
      date,
      score: scores.reduce((a, b) => a + b, 0) / scores.length,
    }));
  };

  // Query for user stats
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStats,
  });

  // Query for chart data based on period
  const { data: chartAttempts, isLoading: chartLoading } = useQuery({
    queryKey: ["quizAttempts", period === "week" ? 7 : 30],
    queryFn: () => getQuizAttemptsForPeriod(period === "week" ? 7 : 30),
  });

  // Query for leaderboard
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getWeeklyLeaderboard,
  });

  // Process data for display
  const stats = userStats
    ? {
        totalQuestions: userStats.totalQuestions,
        totalCorrectAnswers: userStats.totalCorrectAnswers,
        accuracy: Math.round(userStats.overallAccuracy),
        weeklyData: [],
        monthlyData: [],
      }
    : {
        totalQuestions: 0,
        totalCorrectAnswers: 0,
        accuracy: 0,
        weeklyData: [],
        monthlyData: [],
      };

  const chartDataFiltered = chartAttempts
    ? chartAttempts.map((attempt) => ({
        date: new Date(attempt.created_at).toLocaleDateString(),
        score: attempt.score,
      }))
    : [];

  const dataLoaded = !statsLoading && !chartLoading && !leaderboardLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <AppHeader />
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 md:px-8 lg:px-12 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between pt-2">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="flex items-center gap-2 hover:bg-primary/10 text-primary rounded-xl px-4 py-2"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">返回首页</span>
          </Button>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            {dataLoaded ? "成绩统计" : "获取成绩中..."}
          </h2>
          <div className="w-24" /> {/* Spacer for balance */}
        </div>

        {/* Stats Overview - Horizontal on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary/80">总答题数</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalQuestions}</div>
              <p className="text-xs text-muted-foreground mt-1">累计练习题目</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-secondary">答对题数</CardTitle>
              <div className="p-2 rounded-lg bg-secondary/10">
                <Award className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{stats.totalCorrectAnswers}</div>
              <p className="text-xs text-muted-foreground mt-1">正确回答数量</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-accent">正确率</CardTitle>
              <div className="p-2 rounded-lg bg-accent/10">
                <Target className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.accuracy}%</div>
              <p className="text-xs text-muted-foreground mt-1">总体准确度</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Score Trends Chart - Takes more space */}
          <Card className="lg:col-span-3 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">
                    {period === "week" ? "本周分数趋势" : "本月分数趋势"}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPeriod("week")}
                    variant={period === "week" ? "default" : "outline"}
                    size="sm"
                    className="rounded-lg"
                  >
                    本周
                  </Button>
                  <Button
                    onClick={() => setPeriod("month")}
                    variant={period === "month" ? "default" : "outline"}
                    size="sm"
                    className="rounded-lg"
                  >
                    本月
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6 pb-6">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartDataFiltered}
                  margin={{
                    left: 4,
                    right: 4,
                    top: 16,
                    bottom: 8,
                  }}
                >
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="score" fill="var(--color-score)" radius={6} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Weekly Leaderboard - Side panel */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-lg">本周成绩榜</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.email}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all hover:scale-[1.02] cursor-pointer ${
                        index === 0
                          ? "bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20"
                          : index === 1
                          ? "bg-gradient-to-r from-slate-400/10 to-slate-400/5 border border-slate-400/20"
                          : index === 2
                          ? "bg-gradient-to-r from-amber-700/10 to-amber-700/5 border border-amber-700/20"
                          : "bg-muted/50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                            index === 0
                              ? "bg-amber-500 text-white"
                              : index === 1
                              ? "bg-slate-400 text-white"
                              : index === 2
                              ? "bg-amber-700 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium text-foreground text-sm truncate max-w-[120px]">
                          {entry.email}
                        </span>
                      </div>
                      <span className="font-bold text-foreground whitespace-nowrap">
                        {entry.totalScore} 分
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Award className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">暂无排行数据</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">完成练习后即可上榜</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
