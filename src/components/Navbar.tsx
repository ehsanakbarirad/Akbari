import React from 'react';
import { Film, Sparkles, FolderKanban, PlayCircle, Settings, Layers, Users, Image as ImageIcon, Zap, ChevronLeft, Download } from 'lucide-react';
import { FilmProject } from '../types/filmStudio';

interface NavbarProps {
  currentProject: FilmProject | null;
  onOpenProjects: () => void;
  onOpenAutoPilot: () => void;
  onSelectStep: (step: FilmProject['currentStep']) => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  onOpenProjects,
  onOpenAutoPilot,
  onSelectStep,
  onGoHome,
}) => {
  const steps: { key: FilmProject['currentStep']; label: string; icon: any }[] = [
    { key: 'topic', label: 'موضوع', icon: Sparkles },
    { key: 'settings', label: 'تنظیمات', icon: Settings },
    { key: 'story', label: 'فیلمنامه', icon: Film },
    { key: 'scenes', label: 'سکانس‌ها', icon: Layers },
    { key: 'characters', label: 'شخصیت‌ها', icon: Users },
    { key: 'style', label: 'استایل بصری', icon: ImageIcon },
    { key: 'images', label: 'تصاویر بیت‌ها', icon: ImageIcon },
    { key: 'audio', label: 'نریشن', icon: PlayCircle },
    { key: 'video', label: 'ویدیو Veo', icon: Film },
    { key: 'final_studio', label: 'استودیو تدوین', icon: PlayCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentProject?.currentStep);

  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinematic font-black tracking-wider text-base sm:text-lg bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  AI FILM STUDIO
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                استودیوی سینمایی خودمختار
              </p>
            </div>
          </button>

          {currentProject && (
            <div className="hidden lg:flex items-center gap-2 mr-4 pr-4 border-r border-zinc-800">
              <span className="text-xs text-zinc-400">پروژه فعال:</span>
              <span className="text-xs font-medium text-amber-300 max-w-[150px] truncate">
                {currentProject.title}
              </span>
            </div>
          )}
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center gap-2">
          {currentProject && (
            <button
              onClick={onOpenAutoPilot}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-zinc-950" />
              <span className="hidden sm:inline">تولید خودکار پروژه</span>
              <span className="sm:hidden">تولید خودکار</span>
            </button>
          )}

          <a
            href="/api/download-github-zip"
            download="ai-film-studio-github.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-bold shadow-sm transition-all"
            title="دانلود سورس‌کد کامل پروژه برای گیت‌هاب (ZIP)"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">دانلود کد (GitHub ZIP)</span>
            <span className="md:hidden">کد گیت‌هاب</span>
          </a>

          <button
            onClick={onOpenProjects}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs sm:text-sm transition-all"
          >
            <FolderKanban className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">پروژه‌های من</span>
          </button>
        </div>
      </div>

      {/* Sub-nav for Workflow Steps when a project is open */}
      {currentProject && (
        <div className="bg-zinc-950/70 border-t border-zinc-900/90 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 flex items-center gap-1 sm:gap-2 min-w-max">
            {steps.map((s, idx) => {
              const isActive = currentProject.currentStep === s.key;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={s.key}
                  onClick={() => onSelectStep(s.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                      : isPast
                      ? 'text-zinc-300 hover:bg-zinc-900/60'
                      : 'text-zinc-500 hover:text-zinc-400 hover:bg-zinc-900/40'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-amber-500 text-zinc-950'
                        : isPast
                        ? 'bg-zinc-800 text-amber-400'
                        : 'bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
