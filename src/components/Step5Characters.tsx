import React, { useState } from 'react';
import { Users, Sparkles, Image as ImageIcon, RefreshCw, CheckCircle2, ShieldCheck, ArrowLeft, Download, Maximize2, AlertCircle } from 'lucide-react';
import { CharacterBible, CharacterReferenceView, VisualStyleBible, StoryArc, ProjectSettings, Scene } from '../types/filmStudio';
import { generateCharactersAndBible, generateImageFromPrompt } from '../services/api';

interface Step5CharactersProps {
  story: StoryArc;
  settings: ProjectSettings;
  scenes: Scene[];
  characters: CharacterBible[];
  visualStyleBible?: VisualStyleBible;
  onUpdateCharacters: (characters: CharacterBible[]) => void;
  onUpdateStyleBible: (style: VisualStyleBible) => void;
  onProceedToStyle: () => void;
}

export const Step5Characters: React.FC<Step5CharactersProps> = ({
  story,
  settings,
  scenes,
  characters,
  visualStyleBible,
  onUpdateCharacters,
  onUpdateStyleBible,
  onProceedToStyle,
}) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(characters[0]?.id || '');
  const [generatingRefId, setGeneratingRefId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExtractCharacters = async () => {
    setIsExtracting(true);
    setErrorMessage(null);
    try {
      const result = await generateCharactersAndBible(story, settings, scenes);
      onUpdateCharacters(result.characters);
      if (result.visualStyleBible) {
        onUpdateStyleBible(result.visualStyleBible);
      }
      if (result.characters.length > 0) {
        setSelectedCharacterId(result.characters[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'خطا در استخراج شناسنامه شخصیت‌ها');
    } finally {
      setIsExtracting(false);
    }
  };

  // If no characters yet, auto-extract
  React.useEffect(() => {
    if (!characters || characters.length === 0) {
      handleExtractCharacters();
    } else if (!selectedCharacterId && characters.length > 0) {
      setSelectedCharacterId(characters[0].id);
    }
  }, []);

  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId) || characters[0];

  const handleGenerateReferenceImage = async (charId: string, refView: CharacterReferenceView) => {
    setGeneratingRefId(refView.id);
    setErrorMessage(null);
    try {
      // Formulate complete consistent prompt
      const fullPrompt = `${refView.prompt}, visual character bible consistency: ${selectedCharacter?.persistentVisualRules || ''}, 35mm film still, photorealistic high resolution`;
      const imageUrl = await generateImageFromPrompt(fullPrompt, '1:1');

      const updatedCharacters = characters.map((c) => {
        if (c.id !== charId) return c;
        return {
          ...c,
          referenceImages: c.referenceImages.map((r) =>
            r.id === refView.id ? { ...r, imageUrl, status: 'completed' as const } : r
          ),
        };
      });

      onUpdateCharacters(updatedCharacters);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'خطا در رندر تصویر مرجع کاراکتر با Nano Banana');
      const updatedCharacters = characters.map((c) => {
        if (c.id !== charId) return c;
        return {
          ...c,
          referenceImages: c.referenceImages.map((r) =>
            r.id === refView.id ? { ...r, status: 'failed' as const, error: err.message } : r
          ),
        };
      });
      onUpdateCharacters(updatedCharacters);
    } finally {
      setGeneratingRefId(null);
    }
  };

  const handleGenerateAllReferencesForCharacter = async (charId: string) => {
    const char = characters.find((c) => c.id === charId);
    if (!char) return;
    for (const ref of char.referenceImages) {
      if (!ref.imageUrl) {
        await handleGenerateReferenceImage(charId, ref);
      }
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Users className="w-4 h-4" />
          <span>مرحله پنجم: پرونده اختصاصی و تثبیت چهره شخصیت‌ها (Character Bible)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          طراحی کاراکتر و تولید تصاویر مرجع (Reference)
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto">
          برای جلوگیری از تغییر چهره، رنگ مو یا لباس در طول فیلم، برای هر شخصیت تصاویر مرجع چندزاویه‌ای با مدل Nano Banana تولید و تثبیت می‌شود.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Re-extract Action */}
      <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>قانون ثبات شخصیت: تمام پلان‌های مرتبط با کاراکتر از تصاویر مرجع زیر استفاده می‌کنند.</span>
        </div>
        <button
          onClick={handleExtractCharacters}
          disabled={isExtracting}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isExtracting ? 'animate-spin' : ''}`} />
          <span>استخراج مجدد شناسنامه شخصیت‌ها</span>
        </button>
      </div>

      {isExtracting ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-12 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <p className="text-zinc-200 text-base font-bold">
            طراح ارشد شخصیت در حال اسکن کل فیلمنامه و تنظیم مشخصات ژنتیکی و پوشش کاراکترهاست...
          </p>
          <p className="text-zinc-500 text-xs">
            تحلیل بافت چهره، رنگ پوست، فرم مو و استایل اختصاصی
          </p>
        </div>
      ) : characters.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          شخصیتی یافت نشد. دکمه استخراج مجدد را بزنید.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Character Tabs Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedCharacterId(char.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
                  selectedCharacter?.id === char.id
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{char.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20">
                  {char.role}
                </span>
              </button>
            ))}
          </div>

          {selectedCharacter && (
            <div className="space-y-6">
              {/* Character Details Dossier */}
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                      پرونده کاراکتر (Bible ID: {selectedCharacter.id})
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {selectedCharacter.name}
                    </h2>
                    <span className="text-xs text-zinc-400">
                      نقش داستانی: {selectedCharacter.role} — سن تقریبی: {selectedCharacter.approxAge} — جنسیت: {selectedCharacter.gender}
                    </span>
                  </div>

                  <button
                    onClick={() => handleGenerateAllReferencesForCharacter(selectedCharacter.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all flex items-center gap-2 self-start sm:self-auto"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>رندر تمام نماهای مرجع با Nano Banana</span>
                  </button>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 font-bold block mb-1">فرم و استخوان‌بندی چهره:</span>
                    <p className="text-zinc-200">{selectedCharacter.faceShape || 'استخوانی'}</p>
                  </div>
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 font-bold block mb-1">رنگ و حالت چشم‌ها:</span>
                    <p className="text-zinc-200">{selectedCharacter.eyeColor || 'قهوه‌ای تیره'}</p>
                  </div>
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 font-bold block mb-1">مدل و رنگ مو:</span>
                    <p className="text-zinc-200">{selectedCharacter.hairStyle} ({selectedCharacter.hairColor})</p>
                  </div>
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 font-bold block mb-1">رنگ و بافت پوست:</span>
                    <p className="text-zinc-200">{selectedCharacter.skinTone || 'طبیعی'}</p>
                  </div>
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 font-bold block mb-1">لباس و پوشش اصلی:</span>
                    <p className="text-zinc-200">{selectedCharacter.clothing}</p>
                  </div>
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 font-bold block mb-1">اکسسوری و نشان خاص:</span>
                    <p className="text-zinc-200">{selectedCharacter.accessories || 'ندارد'}</p>
                  </div>
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 font-bold block mb-1">شخصیت رفتاری:</span>
                    <p className="text-zinc-200">{selectedCharacter.personality}</p>
                  </div>
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 font-bold block mb-1">حس و اتمسفر چهره:</span>
                    <p className="text-zinc-200">{selectedCharacter.emotionalVibe}</p>
                  </div>
                </div>

                {/* Persistent Visual Rules */}
                <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>دستورالعمل ثابت پرامپت‌ها جهت تضمین ثبات چهره (Consistency Prompt):</span>
                  </div>
                  <p className="text-amber-100 text-xs font-mono leading-relaxed" dir="ltr">
                    {selectedCharacter.persistentVisualRules}
                  </p>
                </div>

                {/* Reference Images Gallery */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>نماهای مرجع چندگانه کاراکتر (Reference Views)</span>
                    </h3>
                    <span className="text-[11px] text-zinc-500">
                      تولید شده با مدل Nano Banana (Gemini 3.1 Flash Lite Image)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedCharacter.referenceImages?.map((refView) => {
                      const isGeneratingThis = generatingRefId === refView.id;

                      return (
                        <div
                          key={refView.id}
                          className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-3 flex flex-col justify-between space-y-3 group hover:border-zinc-700 transition-all"
                        >
                          {/* Image Box */}
                          <div className="aspect-square rounded-xl bg-zinc-900 border border-zinc-800/80 overflow-hidden relative flex items-center justify-center">
                            {refView.imageUrl ? (
                              <>
                                <img
                                  src={refView.imageUrl}
                                  alt={refView.label}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setPreviewImageUrl(refView.imageUrl!)}
                                    className="p-2 rounded-xl bg-zinc-900/90 text-white hover:text-amber-400"
                                    title="بزرگ‌نمایی"
                                  >
                                    <Maximize2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => downloadImage(refView.imageUrl!, `${selectedCharacter.name}_${refView.viewType}`)}
                                    className="p-2 rounded-xl bg-zinc-900/90 text-white hover:text-amber-400"
                                    title="دانلود تصویر"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="p-4 text-center space-y-2">
                                <Users className="w-8 h-8 text-zinc-700 mx-auto" />
                                <span className="text-[11px] text-zinc-500 block">هنوز رندر نشده</span>
                              </div>
                            )}

                            {isGeneratingThis && (
                              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center space-y-2">
                                <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                                <span className="text-[11px] font-bold text-amber-300">
                                  در حال رندر Nano Banana...
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Info & Button */}
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-zinc-200 block">
                              {refView.label}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleGenerateReferenceImage(selectedCharacter.id, refView)}
                              disabled={isGeneratingThis}
                              className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                refView.imageUrl
                                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{refView.imageUrl ? 'رندر مجدد' : 'تولید تصویر مرجع'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Confirmation Bar */}
          <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">تأیید شناسنامه شخصیت‌ها و ورود به استایل بصری</h4>
                <p className="text-xs text-zinc-400">
                  در مرحله بعد، دفترچه قوانین استایل بصری (پالت رنگ، نورپردازی، لنز و بافت) مرور می‌شود.
                </p>
              </div>
            </div>

            <button
              onClick={onProceedToStyle}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>مشاهده و تأیید استایل بصری</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl relative">
            <img src={previewImageUrl} alt="Reference Preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white font-bold flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
