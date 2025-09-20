// app/layout.js
import "./globals.css";
import Head from "next/head";
import AppFooter from "@/components/AppFooter";
import ClientLayout from "./client-layout";

export const metadata = {
  title: "知了英语 Cicada English",
  description: "适合中国小学生的英语阅读学习网站",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="flex flex-col min-h-screen transition-colors duration-300 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-100">
        {/* 3. 创建一个 div 来包裹主内容，并添加 flex-grow */}
        <div className="flex-grow">
          <ClientLayout>{children}</ClientLayout>
        </div>

        {/* 4. 在 body 的末尾、主内容div的外面添加页脚 */}
        <AppFooter />
      </body>
    </html>
  );
}
