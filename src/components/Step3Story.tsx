import React, { useState } from 'react';
import { Film, CheckCircle, RefreshCw, Sparkles, Scissors, Zap, ArrowLeft, Heart, MessageSquare, Edit3, Bookmark } from 'lucide-react';
import { StoryArc, ProjectSettings } from '../types/filmStudio';
import { generateStoryArc } from '../services/api';

interface Step3StoryProps {
  topic: string;
  settings: ProjectSettings;
  story: StoryArc | undefined;
  onUpdateStory: (story: StoryArc) => void;
  onProceedToScenes: () => void;
}

export const Step3Story: React.FC<Step3StoryProps> = ({
  topic,
  settings,
  story,
  onUpdateStory,
  onProceedToScenes,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'screenplay'>('screenplay');
  const [editableStory, setEditableStory] = useState<StoryArc>(
    story || {
      title: 'عنوان اثر در حال تولید...',
      logline: '',
      coreMessage: '',
      synopsis: '',
      hook: '',
      intro: '',
      development: '',
      climax: '',
      resolution: '',
      targetEmotion: '',
      isApproved: false,
    }
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAction = async (action?: 'rewrite' | 'change_ending' | 'punchier' | 'shorten') => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const generated = await generateStoryArc(topic, settings, action, editableStory);
      setEditableStory(generated);
      onUpdateStory(generated);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'خطا در نگارش داستان');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFieldChange = (field: keyof StoryArc, value: string) => {
    const updated = { ...editableStory, [field]: value };
    setEditableStory(updated);
    onUpdateStory(updated);
  };

  const handleApproveAndProceed = () => {
    const approved = { ...editableStory, isApproved: true };
    setEditableStory(approved);
    onUpdateStory(approved);
    onProceedToScenes();
  };

  // If no story yet, auto-trigger first generation
  React.useEffect(() => {
    if (!story?.title || story.title.includes('در حال تولید')) {
      handleAction();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Film className="w-4 h-4" />
          <span>مرحله سوم: سناریونویسی و طراحی قوس دراماتیک</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          طراحی داستان کامل توسط سناریونیست هوش مصنوعی
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          فیلمنامه را مطالعه کنید، در صورت نیاز با دکمه‌های بازنویسی اصلاح کنید یا مستقیم متن را ویرایش نمایید.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
          {errorMessage}
        </div>
      )}

      {isGenerating ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-12 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <p className="text-zinc-200 text-base font-bold">
            سناریونیست در حال خلق ساختار روایی، نقاط اوج و دیالوگ‌هاست...
          </p>
          <p className="text-zinc-500 text-xs">
            بررسی کشش روایی و تطابق با مدت زمان {settings?.duration || '۶۰ ثانیه'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Story Box */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Title & Logline */}
            <div className="space-y-3 pb-6 border-b border-zinc-800">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  عنوان اثر
                </span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-amber-400" />
                  <span>احساس هدف: {editableStory.targetEmotion || 'حیرت و تأمل'}</span>
                </span>
              </div>

              <input
                type="text"
                value={editableStory.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full text-xl sm:text-2xl font-black text-white bg-transparent border-b border-dashed border-zinc-700 focus:border-amber-500 outline-none pb-1"
                placeholder="عنوان فیلم سینمایی..."
              />

              <div className="pt-2">
                <span className="text-xs font-bold text-zinc-400 block mb-1">
                  ایده مرکزی (Logline):
                </span>
                <textarea
                  value={editableStory.logline}
                  onChange={(e) => handleFieldChange('logline', e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-amber-200/90 text-xs sm:text-sm outline-none resize-none"
                  placeholder="لاگ‌لاین اثر..."
                />
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-400 block mb-1">
                  پیام اصلی و اخلاقی (Core Message):
                </span>
                <input
                  type="text"
                  value={editableStory.coreMessage}
                  onChange={(e) => handleFieldChange('coreMessage', e.target.value)}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-zinc-300 text-xs sm:text-sm outline-none"
                  placeholder="پیام کلیدی داستان..."
                />
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-300 block">
                خلاصه منسجم داستان (Synopsis):
              </span>
              <textarea
                value={editableStory.synopsis}
                onChange={(e) => handleFieldChange('synopsis', e.target.value)}
                rows={3}
                className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-zinc-300 text-xs sm:text-sm outline-none resize-none leading-relaxed"
                placeholder="خلاصه داستان..."
              />
            </div>

            {/* Dramatic Structure Sections (Hook, Intro, Development, Climax, Resolution) */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                مراحل قوس دراماتیک و جریان روایی (۵ مرحله استاندارد سینما)
              </h3>

              {/* 1. Hook */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">۱</span>
                  <span>شروع جذاب و قلاب اولیه (Hook - ۵ ثانیه اول)</span>
                </div>
                <textarea
                  value={editableStory.hook}
                  onChange={(e) => handleFieldChange('hook', e.target.value)}
                  rows={2}
                  className="w-full bg-transparent border-0 text-zinc-200 text-xs sm:text-sm outline-none resize-none focus:ring-0 leading-relaxed"
                />
              </div>

              {/* 2. Intro */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-200 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px]">۲</span>
                  <span>مقدمه و فضاسازی ابتدایی (Intro)</span>
                </div>
                <textarea
                  value={editableStory.intro}
                  onChange={(e) => handleFieldChange('intro', e.target.value)}
                  rows={2}
                  className="w-full bg-transparent border-0 text-zinc-200 text-xs sm:text-sm outline-none resize-none focus:ring-0 leading-relaxed"
                />
              </div>

              {/* 3. Development */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-200 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px]">۳</span>
                  <span>گسترش داستان، تنش و چالش روایی (Development)</span>
                </div>
                <textarea
                  value={editableStory.development}
                  onChange={(e) => handleFieldChange('development', e.target.value)}
                  rows={3}
                  className="w-full bg-transparent border-0 text-zinc-200 text-xs sm:text-sm outline-none resize-none focus:ring-0 leading-relaxed"
                />
              </div>

              {/* 4. Climax */}
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center text-[10px] font-bold">۴</span>
                  <span>نقطه اوج داستان و لحظه سرنوشت‌ساز (Climax)</span>
                </div>
                <textarea
                  value={editableStory.climax}
                  onChange={(e) => handleFieldChange('climax', e.target.value)}
                  rows={3}
                  className="w-full bg-transparent border-0 text-amber-100 text-xs sm:text-sm outline-none resize-none focus:ring-0 leading-relaxed"
                />
              </div>

              {/* 5. Resolution */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-200 text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px]">۵</span>
                  <span>پایان‌بندی و نتیجه‌گیری ماندگار (Resolution)</span>
                </div>
                <textarea
                  value={editableStory.resolution}
                  onChange={(e) => handleFieldChange('resolution', e.target.value)}
                  rows={2}
                  className="w-full bg-transparent border-0 text-zinc-200 text-xs sm:text-sm outline-none resize-none focus:ring-0 leading-relaxed"
                />
              </div>
            </div>

            {/* AI Action Rewrite Buttons */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-zinc-400 block">
                ابزارهای بازنویسی و تنظیم داستان با سناریونیست هوش مصنوعی:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleAction('rewrite')}
                  disabled={isGenerating}
                  className="py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>بازنویسی داستان</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('change_ending')}
                  disabled={isGenerating}
                  className="py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>تغییر پایان‌بندی</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('punchier')}
                  disabled={isGenerating}
                  className="py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>جذاب‌تر کردن اثر</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('shorten')}
                  disabled={isGenerating}
                  className="py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  <span>کوتاه‌تر و سریع‌تر</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">تأیید داستان برای ورود به مرحله سکانس‌ها</h4>
                <p className="text-xs text-zinc-400">
                  برای جلوگیری از هزینه‌های غیرضروری، ساخت سکانس‌ها و بیت‌ها پس از تأیید شما آغاز می‌شود.
                </p>
              </div>
            </div>

            <button
              onClick={handleApproveAndProceed}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>تأیید داستان و رفتن به سکانس‌ها</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
