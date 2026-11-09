import React, { useState } from 'react';
import { Settings, Sparkles, ArrowLeft, Wand2, Monitor, Smartphone, Square, Check, Layers } from 'lucide-react';
import { ProjectSettings, ContentType, VisualStyle, VideoDuration, AspectRatio, NarrationType, NarrationTone, DetailLevel } from '../types/filmStudio';

interface Step2SettingsProps {
  topic: string;
  settings: ProjectSettings;
  onUpdateSettings: (settings: ProjectSettings) => void;
  onProceedToStory: () => void;
}

export const Step2Settings: React.FC<Step2SettingsProps> = ({
  topic,
  settings,
  onUpdateSettings,
  onProceedToStory,
}) => {
  const [current, setCurrent] = useState<ProjectSettings>(settings);
  const [isAutoSuggesting, setIsAutoSuggesting] = useState(false);

  const contentTypes: { value: ContentType; label: string; desc: string }[] = [
    { value: 'narrative', label: 'داستانی', desc: 'پیرنگ دراماتیک با نقطه اوج و تحول' },
    { value: 'educational', label: 'آموزشی', desc: 'انتقال مهارت با تصویرسازی شفاف' },
    { value: 'motivational', label: 'انگیزشی', desc: 'ضرب‌آهنگ تپنده، انرژی‌بخش و الهام‌بخش' },
    { value: 'commercial', label: 'تبلیغاتی', desc: 'جذابیت بصری فوق‌العاده برای محصول/برند' },
    { value: 'documentary', label: 'مستند', desc: 'روایت عمیق، حقیقت‌محور و کاوشگرانه' },
    { value: 'film_intro', label: 'معرفی فیلم', desc: 'تحلیل سینمایی و تریلر جذاب' },
    { value: 'fantasy', label: 'فانتزی', desc: 'جهان‌سازی تخیلی، سحرآمیز و بی‌پایان' },
    { value: 'horror', label: 'ترسناک', desc: 'تعلیق دلهره‌آور، سایه‌های سنگین و شوک' },
    { value: 'emotional', label: 'احساسی', desc: 'لحظات ماندگار عاطفی و اشک و لبخند' },
  ];

  const visualStyles: { value: VisualStyle; label: string; desc: string }[] = [
    { value: 'cinematic_realistic', label: 'سینمایی رئال', desc: 'نورپردازی 35mm و لنز آنامورفیک' },
    { value: 'hyper_realism', label: 'فوتورئالیسم 8K', desc: 'بافت دقیق پوست، رفلکس و نور طبیعی' },
    { value: '3d_animation', label: 'انیمیشن سه‌بعدی', desc: 'سبک پیکسار و دیزنی با رندر پرشور' },
    { value: 'cartoon_anime', label: 'کارتونی / انیمه', desc: 'خطوط گیرا، نقاشی دست و پالت رنگ زنده' },
    { value: 'neo_noir', label: 'نئونوآر مدرن', desc: 'کنتراست شدید، نورهای نئونی در باران' },
    { value: 'fantasy_epic', label: 'حماسی افسانه‌ای', desc: 'فضاهای باشکوه، قلعه‌ها و ذرات جادویی' },
    { value: 'vintage_film', label: 'کلاسیک قدیمی', desc: 'گرین نگاتیو کداک و گرمای دهه‌های گذشته' },
  ];

  const durations: { value: VideoDuration; label: string }[] = [
    { value: '30s', label: '۳۰ ثانیه (ریلز / تیک‌تاک)' },
    { value: '60s', label: '۶۰ ثانیه (استاندارد)' },
    { value: '90s', label: '۹۰ ثانیه (روایت کامل)' },
    { value: '3m', label: '۳ دقیقه (داستان عمیق)' },
    { value: '5m', label: '۵ دقیقه (فیلم کوتاه)' },
  ];

  const aspectRatios: { value: AspectRatio; label: string; icon: any; desc: string }[] = [
    { value: '16:9', label: 'افقی 16:9', icon: Monitor, desc: 'سینما، یوتیوب و تلویزیون' },
    { value: '9:16', label: 'عمودی 9:16', icon: Smartphone, desc: 'استوری، ریلز و موبایل' },
    { value: '1:1', label: 'مربعی 1:1', icon: Square, desc: 'پست اینستاگرام و سوشال' },
  ];

  const narrationTones: { value: NarrationTone; label: string }[] = [
    { value: 'emotional', label: 'احساسی و عمیق' },
    { value: 'epic', label: 'حماسی و باشکوه' },
    { value: 'documentary', label: 'مستند و موقر' },
    { value: 'calm', label: 'آرام و زمزمه‌گونه' },
    { value: 'thrilling', label: 'هیجان‌انگیز و پرتعلیق' },
    { value: 'dark', label: 'تاریک و رازآلود' },
  ];

  const updateField = <K extends keyof ProjectSettings>(key: K, value: ProjectSettings[K]) => {
    const updated = { ...current, [key]: value };
    setCurrent(updated);
    onUpdateSettings(updated);
  };

  const handleSmartAutoConfig = () => {
    setIsAutoSuggesting(true);
    // Intelligent heuristic based on topic keywords
    setTimeout(() => {
      let suggestedType: ContentType = 'narrative';
      let suggestedStyle: VisualStyle = 'cinematic_realistic';
      let suggestedTone: NarrationTone = 'emotional';
      let suggestedDuration: VideoDuration = '60s';

      const lower = topic.toLowerCase();
      if (lower.includes('ترسناک') || lower.includes('وحشت') || lower.includes('جن') || lower.includes('عمارت')) {
        suggestedType = 'horror';
        suggestedStyle = 'neo_noir';
        suggestedTone = 'dark';
      } else if (lower.includes('موفقیت') || lower.includes('انگیزه') || lower.includes('پشتکار') || lower.includes('کتاب')) {
        suggestedType = 'motivational';
        suggestedStyle = 'cinematic_realistic';
        suggestedTone = 'epic';
      } else if (lower.includes('تبلیغ') || lower.includes('محصول') || lower.includes('برند')) {
        suggestedType = 'commercial';
        suggestedStyle = 'hyper_realism';
        suggestedTone = 'thrilling';
        suggestedDuration = '30s';
      } else if (lower.includes('کودک') || lower.includes('انیمیشن') || lower.includes('حیوان')) {
        suggestedType = 'fantasy';
        suggestedStyle = '3d_animation';
        suggestedTone = 'calm';
      } else if (lower.includes('مستند') || lower.includes('تاریخ') || lower.includes('علم')) {
        suggestedType = 'documentary';
        suggestedStyle = 'vintage_film';
        suggestedTone = 'documentary';
        suggestedDuration = '90s';
      }

      const smartSettings: ProjectSettings = {
        ...current,
        contentType: suggestedType,
        visualStyle: suggestedStyle,
        narrationTone: suggestedTone,
        duration: suggestedDuration,
        narrationType: 'male',
        language: 'fa',
        detailLevel: 'medium',
        characterCount: 2,
        autoMode: true,
      };

      setCurrent(smartSettings);
      onUpdateSettings(smartSettings);
      setIsAutoSuggesting(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Settings className="w-4 h-4" />
          <span>مرحله دوم: مشخصات فنی و پارامترهای تولید</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          تنظیمات ساخت فیلم سینمایی
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          سبک بصری، کادربندی و لحن گفتار اثر را مطابق با سلیقه یا پلتفرم انتشار خود تنظیم کنید.
        </p>

        {/* Smart AI Auto Config Button */}
        <div className="pt-2">
          <button
            onClick={handleSmartAutoConfig}
            disabled={isAutoSuggesting}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-400/30 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all active:scale-95"
          >
            <Wand2 className={`w-4 h-4 text-amber-400 ${isAutoSuggesting ? 'animate-spin' : ''}`} />
            <span>پیشنهاد هوشمند تنظیمات توسط Gemini (بر اساس موضوع)</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* 1. Content Type */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-zinc-200 block">
            ۱. نوع و فرمت محتوا:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {contentTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => updateField('contentType', t.value)}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  current.contentType === t.value
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20'
                    : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold">{t.label}</span>
                  {current.contentType === t.value && (
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Visual Style */}
        <div className="space-y-3 pt-4 border-t border-zinc-800/80">
          <label className="text-sm font-bold text-zinc-200 block">
            ۲. سبک بصری و زبان تصویر:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {visualStyles.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => updateField('visualStyle', s.value)}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  current.visualStyle === s.value
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20'
                    : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold">{s.label}</span>
                  {current.visualStyle === s.value && (
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Aspect Ratio */}
        <div className="space-y-3 pt-4 border-t border-zinc-800/80">
          <label className="text-sm font-bold text-zinc-200 block">
            ۳. نسبت تصویر (Aspect Ratio):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {aspectRatios.map((ar) => {
              const Icon = ar.icon;
              return (
                <button
                  key={ar.value}
                  type="button"
                  onClick={() => updateField('aspectRatio', ar.value)}
                  className={`p-3.5 rounded-xl border text-right transition-all flex items-center gap-3 ${
                    current.aspectRatio === ar.value
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20'
                      : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${current.aspectRatio === ar.value ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-900 text-zinc-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold block">{ar.label}</span>
                    <span className="text-[11px] text-zinc-500">{ar.desc}</span>
                  </div>
                  {current.aspectRatio === ar.value && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Duration & Detail Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/80">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-200 block">
              ۴. مدت زمان تخمینی اثر:
            </label>
            <div className="space-y-1.5">
              {durations.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => updateField('duration', d.value)}
                  className={`w-full py-2 px-3 rounded-lg border text-right text-xs font-medium transition-all flex items-center justify-between ${
                    current.duration === d.value
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                      : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{d.label}</span>
                  {current.duration === d.value && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-zinc-200 block mb-2">
                ۵. جزئیات روایت داستان:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['short', 'medium', 'detailed'] as DetailLevel[]).map((dl) => (
                  <button
                    key={dl}
                    type="button"
                    onClick={() => updateField('detailLevel', dl)}
                    className={`py-2 px-2 rounded-lg border text-center text-xs font-bold transition-all ${
                      current.detailLevel === dl
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {dl === 'short' ? 'کوتاه و ضربتی' : dl === 'medium' ? 'استاندارد' : 'مفصل و سینمایی'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-200 block mb-2">
                ۶. تعداد شخصیت‌های اصلی داستان:
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => updateField('characterCount', count)}
                    className={`w-12 h-10 rounded-xl border font-bold text-sm transition-all ${
                      current.characterCount === count
                        ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
                <span className="text-xs text-zinc-500">شخصیت کلیدی</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Narration & Voiceover */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-4">
          <label className="text-sm font-bold text-zinc-200 block">
            ۷. نریشن و صداگذاری:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { type: 'male' as NarrationType, label: 'صدای راوی مرد (حماسی / سینمایی)' },
              { type: 'female' as NarrationType, label: 'صدای راوی زن (احساسی / دلنشین)' },
              { type: 'none' as NarrationType, label: 'بدون نریشن (موزیکال / صامت)' },
            ].map((n) => (
              <button
                key={n.type}
                type="button"
                onClick={() => updateField('narrationType', n.type)}
                className={`p-3 rounded-xl border text-right text-xs font-bold transition-all flex items-center justify-between ${
                  current.narrationType === n.type
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-zinc-950/70 border-zinc-800 text-zinc-400'
                }`}
              >
                <span>{n.label}</span>
                {current.narrationType === n.type && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            ))}
          </div>

          {current.narrationType !== 'none' && (
            <div className="pt-2">
              <span className="text-xs text-zinc-400 block mb-2">لحن نریشن:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {narrationTones.map((tone) => (
                  <button
                    key={tone.value}
                    type="button"
                    onClick={() => updateField('narrationTone', tone.value)}
                    className={`py-2 px-2.5 rounded-lg border text-center text-xs font-medium transition-all ${
                      current.narrationTone === tone.value
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="pt-6 border-t border-zinc-800 flex items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            موضوع انتخابی: <strong className="text-amber-300">{topic.slice(0, 40)}...</strong>
          </div>
          <button
            onClick={onProceedToStory}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 active:scale-95"
          >
            <span>نگارش داستان و فیلمنامه با Gemini</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
