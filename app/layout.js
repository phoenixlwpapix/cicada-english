// app/layout.js
import "./globals.css";
import Head from "next/head";
import AppFooter from "@/components/AppFooter";
import ClientLayout from "./client-layout";

export const metadata = {
  title: "知了英语 Cicada English",
  description: "适合中国小学生的AI英语阅读学习网站",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="flex flex-col min-h-screen transition-colors duration-300 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-100">
        <div className="flex-grow">
          <ClientLayout>{children}</ClientLayout>
        </div>

        <AppFooter />
      </body>
    </html>
  );
}
