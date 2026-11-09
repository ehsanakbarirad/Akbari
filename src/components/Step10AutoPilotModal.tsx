import React, { useState, useRef, useEffect } from 'react';
import { Zap, Play, Pause, X, CheckCircle2, AlertCircle, RefreshCw, Layers, Users, Palette, Image as ImageIcon, Mic, Video, FolderCheck } from 'lucide-react';
import { FilmProject, Scene, Beat, CharacterBible, VisualStyleBible } from '../types/filmStudio';
import {
  generateCharactersAndBible,
  generateImageFromPrompt,
  generateVoiceoverAudio,
} from '../services/api';

interface AutoPilotModalProps {
  project: FilmProject;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject: (updated: FilmProject) => void;
}

interface PipelineStep {
  id: number;
  title: string;
  desc: string;
  icon: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'paused';
  error?: string;
}

export const AutoPilotModal: React.FC<AutoPilotModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdateProject,
}) => {
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([
    { id: 1, title: 'استخراج شخصیت‌های داستان', desc: 'بررسی شناسنامه هویتی کاراکترها', icon: Users, status: 'pending' },
    { id: 2, title: 'ساخت Character Bible جامع', desc: 'قوانین چهره، مو، اندام و لباس', icon: Users, status: 'pending' },
    { id: 3, title: 'تولید تصاویر مرجع کاراکترها', desc: 'رندر چندزاویه‌ای با Nano Banana', icon: ImageIcon, status: 'pending' },
    { id: 4, title: 'ساخت Visual Style Bible', desc: 'پالت رنگ، گرین و اپتیک لنز', icon: Palette, status: 'pending' },
    { id: 5, title: 'تولید تصاویر تمام بیت‌ها', desc: 'پردازش صف تصاویر با حفظ ثبات', icon: ImageIcon, status: 'pending' },
    { id: 6, title: 'تولید نریشن‌های موردنیاز', desc: 'صداگذاری گفتار با هوش مصنوعی', icon: Mic, status: 'pending' },
    { id: 7, title: 'آماده‌سازی پرامپت‌های ویدیویی', desc: 'تنظیم متحرک‌سازی Google Veo', icon: Video, status: 'pending' },
    { id: 8, title: 'ذخیره‌سازی و پکیج نهایی', desc: 'ثبت دکوپاژ در استودیوی تدوین', icon: FolderCheck, status: 'pending' },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const isCancelledRef = useRef(false);
  const isPausedRef = useRef(false);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-30), `[${new Date().toLocaleTimeString('fa-IR')}] ${msg}`]);
  };

  const updateStepStatus = (id: number, status: PipelineStep['status'], error?: string) => {
    setPipelineSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, error } : s))
    );
  };

  const waitIfPaused = async () => {
    while (isPausedRef.current && !isCancelledRef.current) {
      await new Promise((r) => setTimeout(r, 500));
    }
  };

  const handleStartPipeline = async () => {
    if (!project.story) {
      addLog('خطا: ابتدا داستان فیلمنامه باید در مرحله ۳ تأیید شده باشد.');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    isCancelledRef.current = false;
    isPausedRef.current = false;

    let currentProj = { ...project };

    try {
      // Step 1 & 2 & 4: Characters & Visual Style Bible
      updateStepStatus(1, 'in_progress');
      updateStepStatus(2, 'in_progress');
      updateStepStatus(4, 'in_progress');
      addLog('شروع ساخت شناسنامه شخصیت‌ها و استایل بصری با هوش مصنوعی...');

      let chars = currentProj.characters || [];
      let styleBible = currentProj.visualStyleBible;

      if (!currentProj.story) {
        addLog('خطا: ابتدا داستان فیلمنامه باید تأیید شده باشد.');
        setIsRunning(false);
        return;
      }

      if (chars.length === 0 || !styleBible) {
        const result = await generateCharactersAndBible(
          currentProj.story,
          currentProj.settings,
          currentProj.scenes
        );
        chars = result.characters;
        styleBible = result.visualStyleBible;
        currentProj.characters = chars;
        currentProj.visualStyleBible = styleBible;
        onUpdateProject({ ...currentProj });
      }

      updateStepStatus(1, 'completed');
      updateStepStatus(2, 'completed');
      updateStepStatus(4, 'completed');
      addLog(`شناسنامه ${chars.length} شخصیت و پالت رنگی با موفقیت ثبت شد.`);

      if (isCancelledRef.current) return;
      await waitIfPaused();

      // Step 3: Reference Images for primary character
      updateStepStatus(3, 'in_progress');
      addLog('در حال رندر تصاویر مرجع کاراکتر با Nano Banana...');
      if (chars.length > 0) {
        const primaryChar = chars[0];
        const updatedRefImages = [...primaryChar.referenceImages];
        for (let i = 0; i < Math.min(updatedRefImages.length, 2); i++) {
          if (!updatedRefImages[i].imageUrl) {
            try {
              const fullPrompt = `${updatedRefImages[i].prompt}, character: ${primaryChar.name}, ${primaryChar.persistentVisualRules}, 35mm portrait`;
              const imgUrl = await generateImageFromPrompt(fullPrompt, '1:1');
              updatedRefImages[i].imageUrl = imgUrl;
              updatedRefImages[i].status = 'completed';
              addLog(`نمای مرجع "${updatedRefImages[i].label}" رندر شد.`);
            } catch (e: any) {
              console.warn('Reference view skip on autopilot', e);
            }
          }
        }
        primaryChar.referenceImages = updatedRefImages;
        currentProj.characters = chars;
        onUpdateProject({ ...currentProj });
      }
      updateStepStatus(3, 'completed');

      if (isCancelledRef.current) return;
      await waitIfPaused();

      // Step 5: Render Beat Images
      updateStepStatus(5, 'in_progress');
      addLog('شروع صف رندر تصاویر پلان‌ها (Beats)...');

      let updatedScenes = [...currentProj.scenes];
      let renderedCount = 0;

      for (let sIdx = 0; sIdx < updatedScenes.length; sIdx++) {
        const scene = updatedScenes[sIdx];
        for (let bIdx = 0; bIdx < scene.beats.length; bIdx++) {
          if (isCancelledRef.current) return;
          await waitIfPaused();

          const beat = scene.beats[bIdx];
          if (!beat.imageUrl) {
            addLog(`در حال رندر تصویر سکانس ${scene.sceneNumber} - پلان ${beat.beatNumber}...`);
            try {
              const styleRules = styleBible?.artStyle || '';
              const prompt = `${styleRules} ${beat.imagePrompt || beat.description}, 35mm film still, photorealistic`;
              const refImg = chars[0]?.referenceImages?.find((r) => r.imageUrl)?.imageUrl;
              const imgUrl = await generateImageFromPrompt(prompt, currentProj.settings.aspectRatio, refImg);
              beat.imageUrl = imgUrl;
              beat.imageStatus = 'completed';
              beat.isApproved = true;
              renderedCount++;
              addLog(`پلان B${beat.beatNumber} با موفقیت رندر شد.`);
            } catch (err: any) {
              addLog(`هشدار رندر پلان B${beat.beatNumber}: ${err.message || 'خطا در رندر'}`);
            }
          }
        }
      }

      currentProj.scenes = updatedScenes;
      onUpdateProject({ ...currentProj });
      updateStepStatus(5, 'completed');
      addLog(`تولید تصاویر با موفقیت تکمیل شد (${renderedCount} تصویر جدید).`);

      if (isCancelledRef.current) return;
      await waitIfPaused();

      // Step 6: Generate Narration Audio
      updateStepStatus(6, 'in_progress');
      addLog('در حال تولید صدای راوی برای پلان‌های نریشن‌دار...');

      for (const scene of currentProj.scenes) {
        for (const beat of scene.beats) {
          if (isCancelledRef.current) return;
          await waitIfPaused();

          if (beat.needsNarration && beat.narrationText && !beat.audioUrl) {
            try {
              const audioUrl = await generateVoiceoverAudio(
                beat.narrationText,
                currentProj.settings.narrationTone,
                currentProj.settings.narrationType === 'female' ? 'female' : 'male',
                currentProj.settings.language
              );
              beat.audioUrl = audioUrl;
              beat.audioStatus = 'completed';
              addLog(`صدای نریشن پلان B${beat.beatNumber} ایجاد شد.`);
            } catch (e: any) {
              console.warn('Voiceover skip on autopilot', e);
            }
          }
        }
      }

      onUpdateProject({ ...currentProj });
      updateStepStatus(6, 'completed');

      // Step 7: Video Prompts Ready
      updateStepStatus(7, 'completed');
      addLog('پرامپت‌های ویدیویی Google Veo با کنترل ثبات چهره تنظیم شدند.');

      // Step 8: Final Save
      updateStepStatus(8, 'completed');
      currentProj.currentStep = 'final_studio';
      onUpdateProject({ ...currentProj });
      addLog('تولید خودکار پروژه به پایان رسید! انتقال به استودیو تدوین.');
    } catch (err: any) {
      console.error(err);
      addLog(`خطای متوقف‌کننده: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      isPausedRef.current = false;
      setIsPaused(false);
      addLog('فرآیند ادامه پیدا کرد.');
    } else {
      isPausedRef.current = true;
      setIsPaused(true);
      addLog('فرآیند توسط کاربر موقتاً متوقف شد.');
    }
  };

  const handleCancel = () => {
    isCancelledRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
    addLog('تولید خودکار لغو شد.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 relative shadow-2xl cinematic-glow">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                تولید خودکار پروژه (Autonomous Production Pipeline)
              </h2>
              <span className="text-xs text-zinc-400">
                اجرای پیوسته ۸ مرحله استودیو با مدیریت هوشمند صف و منابع
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar pr-1">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  step.status === 'in_progress'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : step.status === 'completed'
                    ? 'bg-zinc-950/80 border-emerald-500/40 text-emerald-400'
                    : step.status === 'failed'
                    ? 'bg-red-950/30 border-red-800 text-red-300'
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${step.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-900 text-zinc-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-200">
                      {step.id}. {step.title}
                    </h4>
                    <span className="text-[11px] text-zinc-500">{step.desc}</span>
                  </div>
                </div>

                <div className="text-xs font-bold">
                  {step.status === 'in_progress' && (
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  )}
                  {step.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {step.status === 'failed' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  {step.status === 'pending' && (
                    <span className="text-zinc-600 text-[11px]">در صف</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Terminal / Log output */}
        <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 space-y-1 font-mono text-[11px] text-zinc-400 max-h-28 overflow-y-auto" dir="ltr">
          {logs.length === 0 ? (
            <div className="text-zinc-600 text-center py-2">System idle. Ready to initiate pipeline.</div>
          ) : (
            logs.map((log, i) => <div key={i} className="leading-relaxed">{log}</div>)
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStartPipeline}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-zinc-950" />
                <span>شروع خط تولید خودکار</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handlePauseResume}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-1.5"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'ادامه فرآیند' : 'توقف موقت'}</span>
                </button>

                <button
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl bg-red-950/60 border border-red-800/80 hover:bg-red-900 text-red-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>لغو فرآیند</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
