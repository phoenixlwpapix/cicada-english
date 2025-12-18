// components/AppFooter.js
import Link from "next/link";

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src="/cicada.png" alt="Logo" className="w-8 h-8" />
              <span className="font-bold text-xl text-primary">知了英语</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              适合中国小学生的 AI 英语阅读学习平台，让阅读变得生动有趣。
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  我的成绩
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  登录 / 注册
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">联系我们</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>邮箱: support@cicada-english.com</li>
              <li>反馈: 欢迎提交建议</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-700/30 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} 知了英语 Cicada English. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
