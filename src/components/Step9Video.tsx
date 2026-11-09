import React, { useState } from 'react';
import { Video, Film, Play, RefreshCw, Copy, Check, Download, AlertCircle, ArrowLeft, Camera, Sparkles, CheckCircle2 } from 'lucide-react';
import { Scene, Beat, ProjectSettings } from '../types/filmStudio';
import { generateVideoClip } from '../services/api';

interface Step9VideoProps {
  settings: ProjectSettings;
  scenes: Scene[];
  onUpdateScenes: (scenes: Scene[]) => void;
  onProceedToFinalStudio: () => void;
}

export const Step9Video: React.FC<Step9VideoProps> = ({
  settings,
  scenes,
  onUpdateScenes,
  onProceedToFinalStudio,
}) => {
  const [generatingBeatId, setGeneratingBeatId] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<{ [beatId: string]: string }>({});

  const beatsWithImages = scenes.flatMap((s) =>
    s.beats.map((b) => ({ beat: b, scene: s }))
  );

  const handleGenerateVideo = async (sceneId: string, beat: Beat) => {
    if (!beat.imageUrl) {
      setErrorMessage({
        ...errorMessage,
        [beat.id]: 'ابتدا تصویر این پلان را در مرحله هفتم رندر کنید تا به عنوان فریم آغازین ویدیو استفاده شود.',
      });
      return;
    }

    setGeneratingBeatId(beat.id);
    const newErrors = { ...errorMessage };
    delete newErrors[beat.id];
    setErrorMessage(newErrors);

    try {
      const fullVideoPrompt = `${beat.videoPrompt || beat.description}. Camera motion: ${beat.cameraMovement || 'slow cinematic dolly'}. Rules: Keep strict character facial identity, unchanged clothing, natural human motion without morphing or artifacts, cinematic lighting.`;

      const videoUrl = await generateVideoClip(beat.imageUrl, fullVideoPrompt, settings.aspectRatio);

      const updatedScenes = scenes.map((s) => {
        if (s.id !== sceneId) return s;
        return {
          ...s,
          beats: s.beats.map((b) =>
            b.id === beat.id
              ? {
                  ...b,
                  videoUrl,
                  videoStatus: 'completed' as const,
                  videoError: undefined,
                }
              : b
          ),
        };
      });

      onUpdateScenes(updatedScenes);
    } catch (err: any) {
      console.error(err);
      const userFriendlyError = err.message || 'سرویس مدل Google Veo در این لحظه در دسترس نیست یا به سهمیه ویدیویی نیاز دارد.';
      setErrorMessage({
        ...errorMessage,
        [beat.id]: userFriendlyError,
      });

      const updatedScenes = scenes.map((s) => {
        if (s.id !== sceneId) return s;
        return {
          ...s,
          beats: s.beats.map((b) =>
            b.id === beat.id
              ? {
                  ...b,
                  videoStatus: 'failed' as const,
                  videoError: userFriendlyError,
                }
              : b
          ),
        };
      });
      onUpdateScenes(updatedScenes);
    } finally {
      setGeneratingBeatId(null);
    }
  };

  const handleCopyPrompt = (beatId: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(beatId);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleDownloadSpec = (beat: Beat, scene: Scene) => {
    const content = `AI FILM STUDIO - VIDEO PRODUCTION SPECIFICATION
Scene ${scene.sceneNumber}: ${scene.title}
Beat ${beat.beatNumber}
Framing: ${beat.framing} | Angle: ${beat.cameraAngle}
Camera Movement: ${beat.cameraMovement}
Duration: ${beat.durationSec || 4}s

VIDEO PROMPT (Google Veo):
${beat.videoPrompt || beat.description}

STRICT CONSISTENCY RULES:
- Maintain character facial identity
- Maintain exact clothing and colors
- Natural fluid motion without distortion
- Cinematic lighting: ${beat.lighting}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Veo_Prompt_Scene${scene.sceneNumber}_Beat${beat.beatNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Video className="w-4 h-4" />
          <span>مرحله نهم: تبدیل تصاویر به ویدیو با مدل‌های Google Veo</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          تولید ویدیوهای متحرک سینمایی
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto">
          برای هر پلان با تصویر تأییدشده، پرامپت حرکتی دقیق با حفظ هویت چهره و ثبات لباس تولید شده و آماده رندر با Google Veo است.
        </p>
      </div>

      {/* Grid of Video Beat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {beatsWithImages.map(({ beat, scene }) => {
          const isGeneratingThis = generatingBeatId === beat.id;
          const error = errorMessage[beat.id] || beat.videoError;

          return (
            <div
              key={beat.id}
              className="bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center text-xs font-bold font-cinematic">
                    B{beat.beatNumber}
                  </span>
                  <span className="text-xs font-bold text-white">
                    سکانس {scene.sceneNumber} — پلان {beat.beatNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {beat.videoUrl ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                      <Check className="w-3 h-3" />
                      <span>ویدیو آماده است</span>
                    </span>
                  ) : beat.imageUrl ? (
                    <span className="text-[11px] text-zinc-400">فریم آغازین آماده</span>
                  ) : (
                    <span className="text-[11px] text-amber-400/90">نیازمند تصویر اولیه</span>
                  )}
                </div>
              </div>

              {/* Video or Image Preview */}
              <div
                className={`rounded-2xl bg-zinc-950 border border-zinc-800/90 overflow-hidden relative flex items-center justify-center ${
                  settings.aspectRatio === '9:16'
                    ? 'aspect-[9/16] max-h-[380px]'
                    : settings.aspectRatio === '1:1'
                    ? 'aspect-square'
                    : 'aspect-video'
                }`}
              >
                {beat.videoUrl ? (
                  <video
                    src={beat.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : beat.imageUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={beat.imageUrl}
                      alt={`Beat ${beat.beatNumber} frame`}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[11px] text-zinc-300 flex items-center gap-1.5 font-medium">
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>فریم مبدأ: {beat.framing} ({beat.cameraMovement})</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <Film className="w-10 h-10 text-zinc-700 mx-auto" />
                    <span className="text-xs text-zinc-500 block">تصویر مبدأ هنوز رندر نشده</span>
                  </div>
                )}

                {isGeneratingThis && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                    <span className="text-xs font-bold text-amber-300">
                      در حال پردازش ویدیوی سینمایی با Google Veo...
                    </span>
                    <span className="text-[11px] text-zinc-400 max-w-xs">
                      اعمال قوانین حرکت بدون اعوجاج، فیزیک مو و لباس و عمق نورپردازی
                    </span>
                  </div>
                )}
              </div>

              {/* Veo Video Prompt Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>پرامپت ویدیویی Google Veo:</span>
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(beat.id, beat.videoPrompt || beat.description)}
                    className="text-[11px] text-zinc-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedPromptId === beat.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>کپی پرامپت</span>
                      </>
                    )}
                  </button>
                </div>

                <div
                  className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-300 font-mono leading-relaxed max-h-24 overflow-y-auto"
                  dir="ltr"
                >
                  {beat.videoPrompt || beat.description}
                </div>
              </div>

              {/* Error notice if API quota or unavailable */}
              {error && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-[11px] text-amber-200/90 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>وضعیت تولید ویدیو:</span>
                  </div>
                  <p className="leading-relaxed">{error}</p>
                  <p className="text-zinc-400 text-[10px]">
                    پرامپت و تصویر مبدأ کاملاً محفوظ هستند و می‌توانید مشخصات را کپی کرده یا مجدداً تلاش کنید.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerateVideo(scene.id, beat)}
                  disabled={isGeneratingThis || !beat.imageUrl}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:pointer-events-none text-zinc-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{beat.videoUrl ? 'تولید مجدد ویدیو' : 'تولید ویدیو با Google Veo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadSpec(beat, scene)}
                  className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  title="دانلود پرامپت و مشخصات ویدیویی"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Confirmation Bar */}
      <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">
              اتمام مرحله ویدیو و ورود به استودیوی تدوین نهایی
            </h4>
            <p className="text-xs text-zinc-400">
              در استودیوی تدوین، فیلم کامل را بازبینی، سینک نریشن را تست کرده و پکیج نهایی (ZIP) را دانلود کنید.
            </p>
          </div>
        </div>

        <button
          onClick={onProceedToFinalStudio}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>ورود به استودیو تدوین و خروجی نهایی</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
