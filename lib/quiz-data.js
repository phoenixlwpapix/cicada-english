// Quiz data management utilities for Supabase integration
import { supabase } from "./supabase";

// Data structure for individual quiz attempts
export const createQuizAttempt = (totalQuestions, correctAnswers, score) => ({
  total_questions: totalQuestions,
  correct_answers: correctAnswers,
  score,
  accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
});

// Data structure for user statistics
export const createUserStats = () => ({
  totalQuizzes: 0,
  totalQuestions: 0,
  totalCorrectAnswers: 0,
  totalScore: 0,
  averageScore: 0,
  overallAccuracy: 0,
  lastQuizDate: null,
});

// Calculate user statistics from quiz attempts
export const calculateUserStats = (attempts) => {
  if (attempts.length === 0) {
    return createUserStats();
  }

  const stats = createUserStats();
  stats.totalQuizzes = attempts.length;
  stats.totalQuestions = attempts.reduce(
    (sum, attempt) => sum + attempt.total_questions,
    0
  );
  stats.totalCorrectAnswers = attempts.reduce(
    (sum, attempt) => sum + attempt.correct_answers,
    0
  );
  stats.totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  stats.lastQuizDate = attempts[attempts.length - 1].created_at;

  // Recalculate averages
  stats.averageScore =
    stats.totalQuizzes > 0 ? stats.totalScore / stats.totalQuizzes : 0;
  stats.overallAccuracy =
    stats.totalQuestions > 0
      ? (stats.totalCorrectAnswers / stats.totalQuestions) * 100
      : 0;

  return stats;
};

// Save quiz attempt to Supabase
export const saveQuizAttempt = async (quizAttempt, user) => {
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Add user_id to the quiz attempt
  const attemptWithUserId = {
    ...quizAttempt,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("quiz_results")
    .insert([attemptWithUserId])
    .select();

  if (error) {
    console.error("Error saving quiz attempt:", error);
    throw error;
  }

  return data[0];
};

// Get all quiz attempts from Supabase for current user
export const getQuizAttempts = async () => {
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quiz attempts:", error);
    return [];
  }

  return data || [];
};

// Get user stats from Supabase
export const getUserStats = async () => {
  try {
    const attempts = await getQuizAttempts();
    return calculateUserStats(attempts);
  } catch (error) {
    console.error("Error calculating user stats:", error);
    return createUserStats();
  }
};

// Process quiz submission and update all data
export const processQuizSubmission = async ({
  totalQuestions,
  correctAnswers,
  score,
  user,
}) => {
  // Create new quiz attempt
  const quizAttempt = createQuizAttempt(totalQuestions, correctAnswers, score);

  // Save to Supabase
  const savedAttempt = await saveQuizAttempt(quizAttempt, user);

  // Get updated user stats
  const updatedStats = await getUserStats();

  return { quizAttempt: savedAttempt, updatedStats };
};

// Get quiz attempts for chart data (filtered by date range)
export const getQuizAttemptsForPeriod = async (days = 30) => {
  const attempts = await getQuizAttempts();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return attempts
    .filter((attempt) => new Date(attempt.created_at) >= cutoffDate)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
};

// Clear all data (for testing) - Note: This will delete user's actual data
export const clearAllData = async () => {
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("quiz_results")
    .delete()
    .eq("user_id", user.id); // Only delete current user's records

  if (error) {
    console.error("Error clearing quiz data:", error);
    throw error;
  } else {
    console.log("All quiz data cleared from Supabase for current user");
  }
};

// Get weekly leaderboard - top 5 users by total score this week
export const getWeeklyLeaderboard = async () => {
  try {
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Use database aggregation to get top 5 users by total score
    const { data: leaderboardData, error } = await supabase.rpc(
      "get_weekly_leaderboard",
      { seven_days_ago: sevenDaysAgo.toISOString() }
    );

    if (error) {
      console.error("Error fetching leaderboard data:", error);
      // Fallback to client-side aggregation if RPC fails
      return await getWeeklyLeaderboardFallback(sevenDaysAgo);
    }

    // Transform RPC result to match expected format
    return (leaderboardData || []).map((item) => ({
      email: item.email,
      totalScore: item.total_score,
    }));
  } catch (error) {
    console.error("Error getting weekly leaderboard:", error);
    return [];
  }
};

// Fallback method using client-side aggregation (slower but works)
const getWeeklyLeaderboardFallback = async (sevenDaysAgo) => {
  const { data: attempts, error } = await supabase
    .from("quiz_results")
    .select("user_id, score")
    .gte("created_at", sevenDaysAgo.toISOString());

  if (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }

  // Group by user_id and sum scores
  const userScores = {};
  attempts.forEach((attempt) => {
    if (!userScores[attempt.user_id]) {
      userScores[attempt.user_id] = 0;
    }
    userScores[attempt.user_id] += attempt.score;
  });

  // Get top 5 user_ids
  const topUserIds = Object.entries(userScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userId]) => userId);

  // Get emails from profiles table
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, email")
    .in("id", topUserIds);

  if (profileError) {
    console.error("Error fetching profile data:", profileError);
    // Fallback to user_id display
    return Object.entries(userScores)
      .map(([userId, totalScore]) => ({
        email: `用户 ${userId.slice(0, 8)}`,
        totalScore,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5);
  }

  // Create email map
  const emailMap = {};
  profiles.forEach((profile) => {
    emailMap[profile.id] = profile.email;
  });

  // Convert to array with emails
  const leaderboard = Object.entries(userScores)
    .map(([userId, totalScore]) => ({
      email: emailMap[userId] || `用户 ${userId.slice(0, 8)}`,
      totalScore,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5);

  return leaderboard;
};
