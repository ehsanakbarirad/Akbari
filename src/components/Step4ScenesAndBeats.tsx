import React, { useState } from 'react';
import { Layers, Film, Clock, MapPin, Users, Camera, Mic, Volume2, CheckCircle2, ChevronDown, ChevronUp, Edit3, ArrowLeft, RefreshCw, Eye } from 'lucide-react';
import { Scene, Beat, StoryArc, ProjectSettings } from '../types/filmStudio';
import { generateScenesAndBeats } from '../services/api';

interface Step4ScenesAndBeatsProps {
  story: StoryArc;
  settings: ProjectSettings;
  scenes: Scene[];
  onUpdateScenes: (scenes: Scene[]) => void;
  onProceedToCharacters: () => void;
}

export const Step4ScenesAndBeats: React.FC<Step4ScenesAndBeatsProps> = ({
  story,
  settings,
  scenes,
  onUpdateScenes,
  onProceedToCharacters,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSceneId, setExpandedSceneId] = useState<string | null>(scenes[0]?.id || null);
  const [editingBeat, setEditingBeat] = useState<Beat | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const generated = await generateScenesAndBeats(story, settings);
      onUpdateScenes(generated);
      if (generated.length > 0) {
        setExpandedSceneId(generated[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'خطا در سکانس‌بندی و دکوپاژ سینمایی');
    } finally {
      setIsGenerating(false);
    }
  };

  // If scenes are empty, auto-generate
  React.useEffect(() => {
    if (!scenes || scenes.length === 0) {
      handleGenerate();
    }
  }, []);

  const toggleSceneExpand = (id: string) => {
    setExpandedSceneId(expandedSceneId === id ? null : id);
  };

  const handleUpdateBeat = (sceneId: string, updatedBeat: Beat) => {
    const updatedScenes = scenes.map((s) => {
      if (s.id !== sceneId) return s;
      return {
        ...s,
        beats: s.beats.map((b) => (b.id === updatedBeat.id ? updatedBeat : b)),
      };
    });
    onUpdateScenes(updatedScenes);
    setEditingBeat(null);
  };

  const toggleBeatApproval = (sceneId: string, beatId: string) => {
    const updatedScenes = scenes.map((s) => {
      if (s.id !== sceneId) return s;
      return {
        ...s,
        beats: s.beats.map((b) =>
          b.id === beatId ? { ...b, isApproved: !b.isApproved } : b
        ),
      };
    });
    onUpdateScenes(updatedScenes);
  };

  const totalBeats = scenes.reduce((acc, s) => acc + (s.beats?.length || 0), 0);
  const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSec || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Layers className="w-4 h-4" />
          <span>مرحله چهارم: دکوپاژ سینمایی، سکانس‌بندی و بیت‌ها</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          سکانس‌بندی و پلان‌های بصری (Beats)
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          فیلمنامه به {scenes.length} سکانس و {totalBeats} بیت مستقل تقسیم شده است. هر بیت مستقیماً به یک پلان تصویر و ویدیوی اختصاصی تبدیل خواهد شد.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center gap-4 text-xs text-zinc-300">
          <span className="flex items-center gap-1.5 font-bold">
            <Film className="w-4 h-4 text-amber-400" />
            <span>{scenes.length} سکانس سینمایی</span>
          </span>
          <span className="flex items-center gap-1.5 font-bold">
            <Camera className="w-4 h-4 text-amber-400" />
            <span>{totalBeats} پلان تصویری (Beat)</span>
          </span>
          <span className="flex items-center gap-1.5 font-bold">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>مدت تقریبی: {totalDuration} ثانیه</span>
          </span>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>دکوپاژ مجدد سکانس‌ها</span>
        </button>
      </div>

      {isGenerating ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-12 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <p className="text-zinc-200 text-base font-bold">
            کارگردان و متخصص Storyboard در حال محاسبه زوایای دوربین، پلان‌ها و نورپردازی هستند...
          </p>
          <p className="text-zinc-500 text-xs">
            تنظیم زاویه لنز، حرکت پوش‌این و اوربیت، و هماهنگی نریشن با بیت‌ها
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Scenes List */}
          {scenes.map((scene) => {
            const isExpanded = expandedSceneId === scene.id;

            return (
              <div
                key={scene.id}
                className="bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl transition-all"
              >
                {/* Scene Header Card */}
                <div
                  onClick={() => toggleSceneExpand(scene.id)}
                  className="p-5 sm:p-6 bg-zinc-900/90 hover:bg-zinc-850 cursor-pointer flex items-center justify-between gap-4 transition-colors border-b border-zinc-800/80"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-cinematic">
                        SCENE #{scene.sceneNumber}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {scene.title}
                      </h3>
                      <span className="text-xs text-zinc-500 font-medium mr-2">
                        ({scene.beats?.length || 0} پلان بصری)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{scene.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{scene.timeOfDay}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>حاضرین: {scene.charactersPresent?.join('، ') || 'راوی'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left hidden sm:block">
                      <span className="text-[11px] text-zinc-500 block">اتمسفر صحنه:</span>
                      <span className="text-xs font-medium text-amber-300/90">{scene.mood}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Scene Summary and Beats */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Scene Narrative Objective */}
                    <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                        <span>هدف دراماتیک سکانس:</span>
                        <span className="text-amber-400 font-normal">{scene.dramaticObjective}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {scene.summary}
                      </p>
                    </div>

                    {/* Beats Grid / Accordion */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        <span>پلان‌های دکوپاژ شده این سکانس (Beats)</span>
                      </h4>

                      <div className="grid grid-cols-1 gap-4">
                        {scene.beats?.map((beat) => (
                          <div
                            key={beat.id}
                            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                              beat.isApproved
                                ? 'bg-zinc-950/80 border-amber-500/40'
                                : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center text-xs font-bold font-cinematic">
                                  B{beat.beatNumber}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-zinc-200">
                                  پلان {beat.beatNumber} ({beat.durationSec || 4} ثانیه)
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700">
                                  {beat.framing}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700">
                                  {beat.cameraAngle}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() => setEditingBeat(beat)}
                                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 transition-all"
                                >
                                  <Edit3 className="w-3 h-3 text-amber-400" />
                                  <span>ویرایش</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleBeatApproval(scene.id, beat.id)}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                    beat.isApproved
                                      ? 'bg-amber-500 text-zinc-950'
                                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{beat.isApproved ? 'تأیید شد' : 'تأیید پلان'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Beat Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
                              {/* Visual Action & Character */}
                              <div className="space-y-2">
                                <div>
                                  <span className="text-zinc-500 font-bold block mb-0.5">شرح بصری نما:</span>
                                  <p className="text-zinc-200 leading-relaxed">{beat.description}</p>
                                </div>
                                <div>
                                  <span className="text-zinc-500 font-bold block mb-0.5">کنش شخصیت و میمیک:</span>
                                  <p className="text-zinc-300 leading-relaxed">
                                    {beat.characterAction} — {beat.facialExpression}
                                  </p>
                                </div>
                                <div className="text-[11px] text-zinc-400 pt-1">
                                  <span>حرکت دوربین: </span>
                                  <strong className="text-amber-400/90">{beat.cameraMovement}</strong>
                                </div>
                              </div>

                              {/* Audio / Narration & Sound FX */}
                              <div className="space-y-2 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60">
                                {beat.needsNarration && beat.narrationText ? (
                                  <div>
                                    <span className="text-amber-400 font-bold flex items-center gap-1 mb-1">
                                      <Mic className="w-3 h-3" />
                                      <span>متن نریشن راوی:</span>
                                    </span>
                                    <p className="text-zinc-200 italic leading-relaxed">
                                      "{beat.narrationText}"
                                    </p>
                                  </div>
                                ) : (
                                  <div className="text-zinc-500">بدون نریشن کلامی (پلان تصویری/صامت)</div>
                                )}

                                {beat.dialogue && (
                                  <div className="pt-1">
                                    <span className="text-zinc-400 font-bold block mb-0.5">دیالوگ صحنه:</span>
                                    <p className="text-amber-300/90">{beat.dialogue}</p>
                                  </div>
                                )}

                                <div className="pt-1 text-[11px] text-zinc-400 flex items-center gap-1 border-t border-zinc-800/80">
                                  <Volume2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                  <span className="line-clamp-1">صدا و افکت: {beat.soundFx}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Confirmation Bar */}
          <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  تأیید سکانس‌ها و ورود به طراحی شخصیت‌ها
                </h4>
                <p className="text-xs text-zinc-400">
                  در مرحله بعد، شناسنامه دقیق بصری شخصیت‌ها (Character Bible) جهت تثبیت چهره‌ها خلق می‌شود.
                </p>
              </div>
            </div>

            <button
              onClick={onProceedToCharacters}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>تأیید سکانس‌ها و طراحی شخصیت‌ها</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Beat Edit Modal */}
      {editingBeat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                ویرایش جزئیات پلان B{editingBeat.beatNumber}
              </h3>
              <button
                onClick={() => setEditingBeat(null)}
                className="text-zinc-500 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">شرح بصری نما:</label>
                <textarea
                  value={editingBeat.description}
                  onChange={(e) => setEditingBeat({ ...editingBeat, description: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-zinc-200 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">کنش و میمیک شخصیت:</label>
                <textarea
                  value={editingBeat.characterAction}
                  onChange={(e) => setEditingBeat({ ...editingBeat, characterAction: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-zinc-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">نوع قاب:</label>
                  <input
                    type="text"
                    value={editingBeat.framing}
                    onChange={(e) => setEditingBeat({ ...editingBeat, framing: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-2 text-zinc-200 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">حرکت دوربین:</label>
                  <input
                    type="text"
                    value={editingBeat.cameraMovement}
                    onChange={(e) => setEditingBeat({ ...editingBeat, cameraMovement: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-2 text-zinc-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">متن نریشن راوی:</label>
                <textarea
                  value={editingBeat.narrationText}
                  onChange={(e) => setEditingBeat({ ...editingBeat, narrationText: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-zinc-200 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingBeat(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => handleUpdateBeat(editingBeat.sceneId, editingBeat)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20"
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
