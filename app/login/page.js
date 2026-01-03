"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Leaf, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        if (isSignUp) {
          setError("注册成功！请检查您的邮箱以确认账户。");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("发生错误，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-green-100">
      {/* Left Column - Brand & Inspiration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#f2fcf5] flex-col justify-between p-12 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <Image
              src="/cicada.png"
              alt="Cicada Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">知了英语</span>
        </div>

        {/* Center Illustration Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Main Mascot Effect */}
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-full scale-90 animate-pulse"></div>
            <Image
              src="/cicada.png"
              alt="Cicada Mascot"
              width={200}
              height={200}
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              priority
            />
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-green-50 animate-bounce delay-100">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="absolute bottom-4 -left-8 bg-white p-3 rounded-xl shadow-lg border border-blue-50 animate-bounce delay-700">
              <span className="text-2xl">📚</span>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl font-extrabold text-[#03396c] leading-tight">
              每日阅读，<br />
              <span className="text-[#33a9d8]">每日成长</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              与 AI 一起探索精彩的英语世界。量身定制的故事，让学习不再枯燥。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex gap-6 text-sm text-slate-500 font-medium">
          <span>© 2025 Cicada English</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full my-auto"></span>
          <span>Privacy</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full my-auto"></span>
          <span>Terms</span>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <Link href="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <div className="bg-slate-100 p-1.5 rounded-lg">
            <Image src="/cicada.png" alt="Logo" width={20} height={20} className="w-5 h-5" />
          </div>
          <span className="font-bold">知了英语</span>
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              {isSignUp ? "开始您的学习之旅" : "欢迎回来"}
            </h1>
            <p className="text-slate-500 text-lg">
              {isSignUp ? "创建账户，即可免费体验 AI 故事生成。" : "登录账户，继续您的阅读进度。"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium ml-1">
                邮箱地址
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#33a9d8] transition-colors" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#33a9d8] focus:ring-[#33a9d8] rounded-xl transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  密码
                </Label>
                {!isSignUp && (
                  <button type="button" className="text-sm font-medium text-[#33a9d8] hover:text-[#2888b0] hover:underline">
                    忘记密码？
                  </button>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#33a9d8] transition-colors" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "设置一个安全的密码" : "请输入密码"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#33a9d8] focus:ring-[#33a9d8] rounded-xl transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-slate-500 ml-1">
                  密码长度至少 6 位，建议包含字母和数字。
                </p>
              )}
            </div>

            {error && (
              <div className={`p-4 rounded-xl text-sm flex items-start gap-3 ${error.includes("成功") || error.includes("请检查")
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${error.includes("成功") || error.includes("请检查") ? "bg-green-500" : "bg-red-500"
                  }`} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#03396c] hover:bg-[#022b52] text-white text-base font-bold rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  处理中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isSignUp ? "立即注册" : "登录账户"}
                  {!loading && <ArrowRight className="w-5 h-5 ml-1 opacity-80" />}
                </span>
              )}
            </Button>
          </form>

          <div className="pt-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  {isSignUp ? "已有账户？" : "还没有账户？"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="mt-4 px-6 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-transparent hover:border-slate-200 transition-all duration-200"
            >
              {isSignUp ? "去登录" : "注册新账户"}
            </button>
          </div>

          {/* Mobile Home Link */}
          <div className="text-center lg:hidden mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800"
            >
              ← 返回主页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
