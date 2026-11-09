import React from 'react';
import { Film, Sparkles, Plus, Image as ImageIcon, Video, Mic, DollarSign, Clock, ArrowLeft, Play, Trash2, Cpu, CheckCircle2, ChevronLeft, Download } from 'lucide-react';
import { FilmProject } from '../types/filmStudio';

interface DashboardViewProps {
  projects: FilmProject[];
  onStartNewProject: () => void;
  onOpenProject: (project: FilmProject) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
  onOpenCharactersTab: () => void;
  onOpenImagesTab: () => void;
  onOpenSettingsTab: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  onStartNewProject,
  onOpenProject,
  onDeleteProject,
  onOpenCharactersTab,
  onOpenImagesTab,
  onOpenSettingsTab,
}) => {
  // Aggregate stats across all projects
  const totalImages = projects.reduce((acc, p) => {
    let count = p.stats?.generatedImagesCount || 0;
    p.scenes?.forEach((s) => s.beats?.forEach((b) => {
      if (b.imageUrl) count++;
    }));
    return acc + count;
  }, 0);

  const totalVideos = projects.reduce((acc, p) => {
    let count = p.stats?.generatedVideosCount || 0;
    p.scenes?.forEach((s) => s.beats?.forEach((b) => {
      if (b.videoUrl) count++;
    }));
    return acc + count;
  }, 0);

  const totalAudio = projects.reduce((acc, p) => {
    let count = p.stats?.generatedAudioCount || 0;
    p.scenes?.forEach((s) => s.beats?.forEach((b) => {
      if (b.audioUrl) count++;
    }));
    return acc + count;
  }, 0);

  const totalEstimatedCost = projects.reduce((acc, p) => acc + (p.stats?.estimatedCostUsd || 0), 0) + (totalImages * 0.02) + (totalVideos * 0.08);

  const specialistTeam = [
    { title: 'مدیر خلاقیت و ایده‌پرداز', desc: 'طراحی سوژه، تعلیق و ایده ناب' },
    { title: 'نویسنده و سناریونویس', desc: 'نگارش ساختار دراماتیک و لاگ‌لاین' },
    { title: 'کارگردان و دکوپاژ', desc: 'تقسیم‌بندی سکانس‌ها و بیت‌ها' },
    { title: 'طراح استوری‌بورد', desc: 'تنظیم زوایای لنز، قاب و نورپردازی' },
    { title: 'طراح شخصیت (Bible)', desc: 'تثبیت چهره و لباس در تمام صحنه‌ها' },
    { title: 'مدیر هنری و استایل', desc: 'پالت رنگ، فیلم گرین و کنتراست' },
    { title: 'تولید تصویر با Nano Banana', desc: 'خلق تصاویر سینمایی با مدل 3.1 Flash' },
    { title: 'تولید ویدیو با Google Veo', desc: 'متحرک‌سازی و انتقال پلان‌ها' },
    { title: 'صداگذاری و نریشن هوشمند', desc: 'تولید صدای چندزبانه و احساسی' },
    { title: 'تدوینگر نهایی', desc: 'ترکیب خط زمانی و استودیوی نهایی' },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/80 to-[#090a0f] border border-amber-500/20 p-6 sm:p-12 text-center shadow-2xl cinematic-glow">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>پلتفرم خودمختار تولید فیلم و محتوای سینمایی هوشمند</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          از یک ایده تا یک فیلم سینمایی؛{' '}
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            همه‌چیز با هوش مصنوعی.
          </span>
        </h1>

        <p className="text-zinc-300 text-base sm:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          تنها کافی است موضوع مورد نظرتان را بگویید؛ تیم ۱۱ نفره متخصصین مجازی سیستم، از سناریونویسی و طراحی کاراکتر تا رندر تصاویر و ویدئوهای سینمایی را برایتان خلق می‌کنند.
        </p>

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onStartNewProject}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <Play className="w-5 h-5 fill-zinc-950 group-hover:scale-110 transition-transform" />
            <span>شروع ساخت ویدئو</span>
          </button>
        </div>

        {/* Secondary quick navigation buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-8 pt-6 border-t border-zinc-800/60 max-w-3xl mx-auto">
          <button
            onClick={onStartNewProject}
            className="px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>شروع پروژه جدید</span>
          </button>

          <button
            onClick={onOpenCharactersTab}
            className="px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>شخصیت‌های من</span>
          </button>

          <button
            onClick={onOpenImagesTab}
            className="px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>کتابخانه تصاویر</span>
          </button>

          <button
            onClick={onOpenSettingsTab}
            className="px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
          >
            <Film className="w-4 h-4 text-amber-400" />
            <span>تنظیمات تولید</span>
          </button>

          <a
            href="/api/download-github-zip"
            download="ai-film-studio-github.zip"
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
            title="دانلود فایل فشرده کل پروژه برای بارگذاری در گیتهاب"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>دانلود کل پروژه برای گیت‌هاب (ZIP)</span>
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-xs sm:text-sm font-medium">تصاویر تولید شده</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-cinematic">
            {totalImages}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">رندر شده با Nano Banana</span>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-xs sm:text-sm font-medium">ویدیوهای تولید شده</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-cinematic">
            {totalVideos}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">مدل‌های Google Veo</span>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-xs sm:text-sm font-medium">نریشن‌های صوتی</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-cinematic">
            {totalAudio}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Google Speech TTS</span>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-xs sm:text-sm font-medium">هزینه تقریبی API</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-cinematic">
            ${totalEstimatedCost.toFixed(3)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">مصرف هوشمند و بهینه</span>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">پروژه‌های اخیر شما</h2>
          </div>
          <button
            onClick={onStartNewProject}
            className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
          >
            <span>پروژه جدید</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl p-8 text-center">
            <Film className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm mb-4">هنوز پروژه‌ای ثبت نشده است.</p>
            <button
              onClick={onStartNewProject}
              className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-sm hover:bg-amber-400 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>ساخت اولین فیلم سینمایی</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => {
              // Count images in project
              let imgCount = 0;
              proj.scenes?.forEach((s) => s.beats?.forEach((b) => {
                if (b.imageUrl) imgCount++;
              }));

              return (
                <div
                  key={proj.id}
                  onClick={() => onOpenProject(proj)}
                  className="group bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all cursor-pointer relative shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                          {proj.settings?.contentType || 'داستانی'}
                        </span>
                        <h3 className="text-base font-bold text-white mt-2 group-hover:text-amber-300 transition-colors line-clamp-1">
                          {proj.title || 'بدون عنوان'}
                        </h3>
                      </div>
                      <button
                        onClick={(e) => onDeleteProject(proj.id, e)}
                        className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-all"
                        title="حذف پروژه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {proj.story?.logline || proj.topic || 'بدون توضیحات'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{imgCount} تصویر</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{proj.settings?.duration || '۶۰ ثانیه'}</span>
                      </span>
                    </div>

                    <span className="text-amber-400/90 font-medium group-hover:translate-x-[-2px] transition-transform flex items-center gap-0.5">
                      <span>ادامه</span>
                      <ArrowLeft className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Specialist AI Production Team Showcase */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-6 sm:p-8">
        <div className="max-w-2xl mb-6">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
            خط تولید سینمایی هوشمند
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            تیم ۱۰ نفره متخصصین در خدمت فیلم شما
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            سیستم در هر مرحله نقش یک متخصص حقیقی صنعت سینما را ایفا کرده و گام به گام تا رندر نهایی پیش می‌رود.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {specialistTeam.map((member, i) => (
            <div
              key={i}
              className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-amber-500/80 font-cinematic mb-1 block">
                  ROLE #{i + 1}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-200 mb-1">
                  {member.title}
                </h4>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 font-light">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
