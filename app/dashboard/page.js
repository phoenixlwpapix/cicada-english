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
import { TrendingUp, BookOpen, Target, Award } from "lucide-react";
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
      <div className="px-4 sm:px-12 lg:px-24 py-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold py-1 mb-2">
            <span className="text-primary">
              {dataLoaded ? "成绩统计" : "获取成绩中..."}
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Statistics Cards - Left Column */}
          <div className="flex flex-col gap-6 h-full">
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总答题数</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuestions}</div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  总计答对题数
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalCorrectAnswers}
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">正确率</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.accuracy}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Score Trends - Right Column */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {period === "week" ? "本周分数趋势" : "本月分数趋势"}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPeriod("week")}
                      variant={period === "week" ? "default" : "outline"}
                    >
                      本周
                    </Button>
                    <Button
                      onClick={() => setPeriod("month")}
                      variant={period === "month" ? "default" : "outline"}
                    >
                      本月
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden px-2 sm:px-6">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartDataFiltered}
                    margin={{
                      left: 4,
                      right: 4,
                      top: 12,
                      bottom: 12,
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
                    <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Weekly Leaderboard */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>本周成绩榜</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard && leaderboard.length > 0 ? (
              <>
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.email}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0
                              ? "bg-secondary text-foreground"
                              : index === 1
                              ? "bg-accent text-accent-foreground"
                              : index === 2
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium text-foreground">
                          {entry.email}
                        </span>
                      </div>
                      <span className="font-bold text-foreground">
                        {entry.totalScore} 分
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-4">暂无数据</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
