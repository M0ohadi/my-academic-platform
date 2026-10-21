import React from 'react';
import { GraduationCap, Code2, ShieldCheck, Sparkles, BookMarked, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenFastAPIModal: () => void;
  onOpenEthicsModal: () => void;
  onScrollToServices: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenFastAPIModal,
  onOpenEthicsModal,
  onScrollToServices,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Academic Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 ring-1 ring-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-black font-cairo tracking-tight text-white">
                  إسناد
                </span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-400/30">
                  الأكاديمي الذكي
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal hidden sm:block">
                منظومة البحث الرصين لطلبة الماجستير والدكتوراه
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onScrollToServices}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>الخدمات الـ 10</span>
            </button>

            <button
              onClick={onOpenFastAPIModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/70 border border-emerald-700/40 transition-colors"
              title="عرض كود بايثون و FastAPI لنقطة النهاية"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>كود Python (FastAPI)</span>
            </button>

            <button
              onClick={onOpenEthicsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
              title="ميثاق الأمانة العلمية وضوابط الذكاء الاصطناعي"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">ميثاق الأمانة العلمية</span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>خالٍ من الهلوسة (Zero Hallucination)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
