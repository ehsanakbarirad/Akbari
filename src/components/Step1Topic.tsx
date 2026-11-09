import React, { useState } from 'react';
import { Sparkles, Lightbulb, ArrowLeft, RefreshCw, Check, Clock, Eye, Film, BookOpen, Compass } from 'lucide-react';
import { FilmIdea } from '../types/filmStudio';
import { fetchFilmIdeas } from '../services/api';

interface Step1TopicProps {
  initialTopic: string;
  onTopicSelected: (topic: string, suggestedIdea?: FilmIdea) => void;
  onBackToDashboard: () => void;
}

export const Step1Topic: React.FC<Step1TopicProps> = ({
  initialTopic,
  onTopicSelected,
  onBackToDashboard,
}) => {
  const [mode, setMode] = useState<'custom' | 'generate'>('custom');
  const [topicInput, setTopicInput] = useState(initialTopic || '');
  const [ideas, setIdeas] = useState<FilmIdea[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [selectedIdeaForModal, setSelectedIdeaForModal] = useState<FilmIdea | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleQuickTopics = [
    { label: 'قدرت مطالعه کتاب', desc: 'سفر در دنیاهای نامحدود ذهن با باز شدن یک کتاب کهنه' },
    { label: 'داستان موفقیت یک انسان', desc: 'عبور از هزاران شکست تا رسیدن به قله آرزوها' },
    { label: 'زندگی بدون تکنولوژی', desc: 'تاریکی محض در یک شهر مدرن و بازگشت به آغوش ستاره‌ها' },
    { label: 'یک داستان ترسناک و معمایی', desc: 'سایه‌ای در قاب آینه قدیمی عمارتی در مه' },
    { label: 'معرفی سینمایی یک فیلم', desc: 'بررسی لایه‌های پنهان روان‌شناختی یک شاهکار کلاسیک' },
    { label: 'یک داستان احساسی و نوستالژیک', desc: 'نامه‌ای بعد از چهل سال به مقصد می‌رسد' },
    { label: 'تبلیغ سینمایی یک محصول', desc: 'معرفی دراماتیک یک ساعت مچی مقاوم در قطب شمال' },
  ];

  const handleGenerateIdeas = async () => {
    setIsLoadingIdeas(true);
    setErrorMessage(null);
    try {
      const generated = await fetchFilmIdeas(topicInput);
      setIdeas(generated);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'خطا در دریافت ایده‌ها. لطفاً مجدداً امتحان کنید.');
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const handleSwitchToGenerate = () => {
    setMode('generate');
    if (ideas.length === 0) {
      handleGenerateIdeas();
    }
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    onTopicSelected(topicInput.trim());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>مرحله اول: انتخاب موضوع و جرقه داستانی</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          دوست داری درباره چه موضوعی ویدئو بسازی؟
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          ایده ذهنی خودت را بنویس یا اجازه بده مدیر خلاقیت هوش مصنوعی ۵ ایده سینمایی شگفت‌انگیز برایت خلق کند.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center">
        <div className="bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 flex items-center gap-1 w-full max-w-md">
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mode === 'custom'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>حالت اول: من موضوع دارم</span>
          </button>
          <button
            onClick={handleSwitchToGenerate}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mode === 'generate'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>حالت دوم: برای من ایده بساز</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Custom Topic Input */}
      {mode === 'custom' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <form onSubmit={handleSubmitCustom} className="space-y-4">
            <label className="block text-sm font-bold text-zinc-200">
              موضوع یا ایده اولیه خود را بنویسید:
            </label>
            <div className="relative">
              <textarea
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="مثال: داستان ساعت‌سازی در آینده که خاطرات از دست رفته انسان‌ها را در چرخ‌دنده‌ها بازسازی می‌کند..."
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-2xl p-4 text-white placeholder-zinc-500 text-sm sm:text-base outline-none transition-all resize-none shadow-inner leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-zinc-500">
                می‌توانید یک جمله ساده بنویسید؛ هوش مصنوعی ساختار روایی را توسعه می‌دهد.
              </span>
              <button
                type="submit"
                disabled={!topicInput.trim()}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>تأیید موضوع و تنظیمات پروژه</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick suggestions */}
          <div className="pt-6 border-t border-zinc-800/80 space-y-3">
            <span className="text-xs font-bold text-zinc-400 block">
              یا از این موضوعات پیشنهادی انتخاب کنید:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sampleQuickTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopicInput(topic.label)}
                  className="text-right p-3 rounded-xl bg-zinc-950/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-amber-500/30 transition-all group flex flex-col justify-between"
                >
                  <span className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                    {topic.label}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                    {topic.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: AI Generates 5 Ideas */}
      {mode === 'generate' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            <div>
              <h3 className="text-sm font-bold text-white">۵ ایده بکر سینمایی با هوش مصنوعی</h3>
              <p className="text-xs text-zinc-400">
                هر ایده دارای ژانر، قلاب دراماتیک و جلوه بصری اختصاصی است.
              </p>
            </div>
            <button
              onClick={handleGenerateIdeas}
              disabled={isLoadingIdeas}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingIdeas ? 'animate-spin' : ''}`} />
              <span>۵ ایده جدید بساز</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {isLoadingIdeas ? (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-12 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <p className="text-zinc-300 text-sm font-bold">
                مدیر خلاقیت در حال طراحی ۵ ایده سینمایی و نگارش لاگ‌لاین‌هاست...
              </p>
              <p className="text-zinc-500 text-xs">
                بررسی تعلیق داستانی، ژانر و زیبایی‌شناسی قاب‌ها
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea, idx) => (
                <div
                  key={idea.id || idx}
                  className="bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-amber-500/5 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {idea.genre || 'سینمایی'}
                      </span>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{idea.suggestedDuration || '۶۰ ثانیه'}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {idea.title}
                    </h3>

                    <p className="text-zinc-300 text-xs font-medium leading-relaxed">
                      {idea.shortDesc}
                    </p>

                    <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">
                      {idea.synopsis}
                    </p>

                    <div className="pt-2 text-[11px] text-zinc-500 flex items-center gap-1.5 border-t border-zinc-800/80">
                      <Film className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                      <span className="line-clamp-1">جلوه بصری: {idea.visualAppeal}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center gap-2">
                    <button
                      onClick={() => onTopicSelected(`${idea.title}: ${idea.shortDesc}`, idea)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>انتخاب این ایده</span>
                    </button>

                    <button
                      onClick={() => setSelectedIdeaForModal(idea)}
                      className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                      <span>جزئیات</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Idea Details Modal */}
      {selectedIdeaForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                {selectedIdeaForModal.genre}
              </span>
              <button
                onClick={() => setSelectedIdeaForModal(null)}
                className="text-zinc-500 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-bold text-white">
              {selectedIdeaForModal.title}
            </h3>

            <p className="text-amber-200/90 text-sm font-medium">
              {selectedIdeaForModal.shortDesc}
            </p>

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <strong className="text-zinc-200 block text-xs">خلاصه کامل داستان:</strong>
              <p>{selectedIdeaForModal.synopsis}</p>
            </div>

            <div className="space-y-1 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300 block">جذابیت بصری و صحنه‌پردازی:</span>
              <p>{selectedIdeaForModal.visualAppeal}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500">
                مدت پیشنهادی: {selectedIdeaForModal.suggestedDuration}
              </span>
              <button
                onClick={() => {
                  onTopicSelected(
                    `${selectedIdeaForModal.title}: ${selectedIdeaForModal.shortDesc}`,
                    selectedIdeaForModal
                  );
                  setSelectedIdeaForModal(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
              >
                شروع با این ایده
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
