// components/AppFooter.js

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-700/50 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          © {currentYear} 知了英语 Cicada English
        </p>
      </div>
    </footer>
  );
}
