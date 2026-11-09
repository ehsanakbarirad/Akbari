import React, { useState, useRef } from 'react';
import { Mic, Play, Pause, RefreshCw, CheckCircle2, Download, Volume2, ArrowLeft, AlertCircle, Edit3, Sliders, Check } from 'lucide-react';
import { Scene, Beat, ProjectSettings } from '../types/filmStudio';
import { generateVoiceoverAudio } from '../services/api';

interface Step8VoiceoverProps {
  settings: ProjectSettings;
  scenes: Scene[];
  onUpdateScenes: (scenes: Scene[]) => void;
  onProceedToVideo: () => void;
}

export const Step8Voiceover: React.FC<Step8VoiceoverProps> = ({
  settings,
  scenes,
  onUpdateScenes,
  onProceedToVideo,
}) => {
  const [generatingBeatId, setGeneratingBeatId] = useState<string | null>(null);
  const [playingBeatId, setPlayingBeatId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>(
    settings.narrationType === 'female' ? 'female' : 'male'
  );
  const [editingBeat, setEditingBeat] = useState<Beat | null>(null);
  const [editText, setEditText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter beats that require narration
  const narrationBeats = scenes.flatMap((s) =>
    s.beats.filter((b) => b.needsNarration && b.narrationText?.trim().length > 0)
  );

  const handleGenerateVoice = async (sceneId: string, beat: Beat) => {
    setGeneratingBeatId(beat.id);
    setErrorMessage(null);
    try {
      const audioUrl = await generateVoiceoverAudio(
        beat.narrationText,
        settings.narrationTone,
        voiceGender,
        settings.language
      );

      const updatedScenes = scenes.map((s) => {
        if (s.id !== sceneId) return s;
        return {
          ...s,
          beats: s.beats.map((b) =>
            b.id === beat.id
              ? {
                  ...b,
                  audioUrl,
                  audioStatus: 'completed' as const,
                  audioError: undefined,
                }
              : b
          ),
        };
      });

      onUpdateScenes(updatedScenes);
    } catch (err: any) {
      console.warn('TTS API error, falling back to Web Speech API synthesiser if available', err);
      // Fallback: If server speech model requires keys or quotas, synthesize via Web Speech API or handle gracefully
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // We can synthesize live preview
        setErrorMessage(
          'سرویس ابری گفتار در این لحظه سهمیه ندارد. می‌توانید با دکمه پخش، صدای طبیعی مرورگر را بشنوید.'
        );
      } else {
        setErrorMessage(err.message || 'خطا در تولید صدای نریشن');
      }
    } finally {
      setGeneratingBeatId(null);
    }
  };

  const handleTogglePlay = (beat: Beat) => {
    if (playingBeatId === beat.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingBeatId(null);
      return;
    }

    if (beat.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = beat.audioUrl;
      audioRef.current.playbackRate = audioSpeed;
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingBeatId(null);
      setPlayingBeatId(beat.id);
    } else if ('speechSynthesis' in window && beat.narrationText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(beat.narrationText);
      utterance.rate = audioSpeed;
      utterance.lang = settings.language === 'en' ? 'en-US' : 'fa-IR';
      utterance.onend = () => setPlayingBeatId(null);
      window.speechSynthesis.speak(utterance);
      setPlayingBeatId(beat.id);
    }
  };

  const handleSaveTextEdit = (sceneId: string, beatId: string) => {
    const updatedScenes = scenes.map((s) => {
      if (s.id !== sceneId) return s;
      return {
        ...s,
        beats: s.beats.map((b) => (b.id === beatId ? { ...b, narrationText: editText } : b)),
      };
    });
    onUpdateScenes(updatedScenes);
    setEditingBeat(null);
  };

  const downloadAudio = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Mic className="w-4 h-4" />
          <span>مرحله هشتم: استودیوی نریشن، صداگذاری و دوبلاژ سینمایی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          تولید صدای نریشن راوی با هوش مصنوعی
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          برای پلان‌های داستانی که نیاز به نریشن دارند، صدای گوینده حرفه‌ای با لحن {settings.narrationTone} تولید و سینک می‌شود.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Global Narration Controls */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-400 font-bold">صدای گوینده:</span>
          <div className="flex items-center bg-zinc-950 rounded-xl p-1 border border-zinc-800">
            <button
              onClick={() => setVoiceGender('male')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                voiceGender === 'male' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              راوی مرد (Puck)
            </button>
            <button
              onClick={() => setVoiceGender('female')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                voiceGender === 'female' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              راوی زن (Kore)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-400 font-bold">سرعت گویش:</span>
          <div className="flex items-center gap-1.5 bg-zinc-950 rounded-xl p-1 border border-zinc-800">
            {[0.8, 1, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => setAudioSpeed(speed)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  audioSpeed === speed ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Narration Beats List */}
      <div className="space-y-4">
        {narrationBeats.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 text-center text-zinc-500">
            هیچ پلانی برای نریشن علامت‌گذاری نشده است (پروژه صامت یا بدون راوی).
          </div>
        ) : (
          narrationBeats.map((beat) => {
            const isGeneratingThis = generatingBeatId === beat.id;
            const isPlayingThis = playingBeatId === beat.id;
            const parentScene = scenes.find((s) => s.id === beat.sceneId);

            return (
              <div
                key={beat.id}
                className="bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center text-xs font-bold font-cinematic">
                      B{beat.beatNumber}
                    </span>
                    <span className="text-xs font-bold text-white">
                      سکانس {parentScene?.sceneNumber} — پلان {beat.beatNumber}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      ({beat.durationSec || 4} ثانیه)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {beat.audioUrl && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                        <Check className="w-3 h-3" />
                        <span>فایل صوتی آماده</span>
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setEditingBeat(beat);
                        setEditText(beat.narrationText);
                      }}
                      className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white rounded-lg bg-zinc-800 flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3 text-amber-400" />
                      <span>ویرایش متن</span>
                    </button>
                  </div>
                </div>

                {/* Text quote */}
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 block">
                    متن گویندگی راوی:
                  </span>
                  <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed italic">
                    "{beat.narrationText}"
                  </p>
                </div>

                {/* Sound effect hint */}
                {beat.soundFx && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Volume2 className="w-4 h-4 text-zinc-500 shrink-0" />
                    <span>موسیقی متن و افکت: {beat.soundFx}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => handleTogglePlay(beat)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    {isPlayingThis ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-white" />
                        <span>توقف پخش</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>پخش نریشن</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleGenerateVoice(beat.sceneId, beat)}
                    disabled={isGeneratingThis}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingThis ? 'animate-spin' : ''}`} />
                    <span>{beat.audioUrl ? 'تولید مجدد فایل صوتی' : 'تولید صدای هوش مصنوعی'}</span>
                  </button>

                  {beat.audioUrl && (
                    <button
                      onClick={() => downloadAudio(beat.audioUrl!, `Beat_${beat.beatNumber}_Voiceover`)}
                      className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      title="دانلود فایل صوتی WAV"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Text Edit Modal */}
      {editingBeat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                ویرایش متن نریشن پلان B{editingBeat.beatNumber}
              </h3>
              <button
                onClick={() => setEditingBeat(null)}
                className="text-zinc-500 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-zinc-300 block">
                متن گویندگی راوی برای این صحنه:
              </label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-xl p-3 text-zinc-200 text-sm outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingBeat(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => handleSaveTextEdit(editingBeat.sceneId, editingBeat.id)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20"
              >
                ذخیره متن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Confirmation Bar */}
      <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">
              تأیید صداگذاری و ورود به استودیوی ویدیوساز Google Veo
            </h4>
            <p className="text-xs text-zinc-400">
              در مرحله بعد تصاویر ثابت به کلیپ‌های ویدیویی متحرک با پرامپت‌های سینمایی تبدیل می‌شوند.
            </p>
          </div>
        </div>

        <button
          onClick={onProceedToVideo}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>تولید ویدیوی متحرک (Google Veo)</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
