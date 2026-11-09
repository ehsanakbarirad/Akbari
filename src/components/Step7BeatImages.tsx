import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, RefreshCw, CheckCircle2, Download, Maximize2, Edit3, ArrowLeft, Layers, Camera, AlertCircle, Play, Check } from 'lucide-react';
import { Scene, Beat, CharacterBible, VisualStyleBible, ProjectSettings } from '../types/filmStudio';
import { generateImageFromPrompt } from '../services/api';

interface Step7BeatImagesProps {
  settings: ProjectSettings;
  scenes: Scene[];
  characters: CharacterBible[];
  visualStyleBible?: VisualStyleBible;
  onUpdateScenes: (scenes: Scene[]) => void;
  onProceedToVoiceover: () => void;
}

export const Step7BeatImages: React.FC<Step7BeatImagesProps> = ({
  settings,
  scenes,
  characters,
  visualStyleBible,
  onUpdateScenes,
  onProceedToVoiceover,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || '');
  const [generatingBeatId, setGeneratingBeatId] = useState<string | null>(null);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [editingPromptBeat, setEditingPromptBeat] = useState<Beat | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Model selection (Nano Banana 2 Lite vs Pro / 3.1 Flash Lite Image)
  const [activeModel, setActiveModel] = useState<'nano_banana_lite' | 'nano_banana_pro'>('nano_banana_lite');

  const currentScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  const formulateFullPrompt = (beat: Beat, scene: Scene): { prompt: string; refBase64?: string } => {
    // Find matching characters present in scene
    const sceneChars = characters.filter((c) =>
      scene.charactersPresent?.some((cp) => cp.includes(c.name) || c.name.includes(cp))
    );

    // Look for established reference image
    let refBase64: string | undefined = undefined;
    let charConsistencyRules = '';

    if (sceneChars.length > 0) {
      const primaryChar = sceneChars[0];
      charConsistencyRules = `Character details: ${primaryChar.name}, ${primaryChar.clothing}, ${primaryChar.facialFeatures}. Rules: ${primaryChar.persistentVisualRules}. `;
      const primaryRef = primaryChar.referenceImages?.find((r) => r.imageUrl);
      if (primaryRef?.imageUrl) {
        refBase64 = primaryRef.imageUrl;
      }
    }

    const stylePrefix = visualStyleBible?.artStyle
      ? `Visual Style: ${visualStyleBible.artStyle}, ${visualStyleBible.renderingEngine}, lighting: ${beat.lighting || visualStyleBible.lighting}, camera: ${beat.framing} ${beat.cameraAngle}, ${beat.cameraMovement}. `
      : '';

    const basePrompt = beat.imagePrompt || beat.description;
    const finalPrompt = `${stylePrefix}${charConsistencyRules}${basePrompt}, cinematic film still, masterpiece, highly detailed, photorealistic.`;

    return { prompt: finalPrompt, refBase64 };
  };

  const handleGenerateBeatImage = async (sceneId: string, beat: Beat) => {
    setGeneratingBeatId(beat.id);
    setErrorMessage(null);

    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;

    const { prompt, refBase64 } = formulateFullPrompt(beat, scene);

    try {
      const imageUrl = await generateImageFromPrompt(prompt, settings.aspectRatio, refBase64);

      const updatedScenes = scenes.map((s) => {
        if (s.id !== sceneId) return s;
        return {
          ...s,
          beats: s.beats.map((b) =>
            b.id === beat.id
              ? {
                  ...b,
                  imageUrl,
                  imageStatus: 'completed' as const,
                  imageError: undefined,
                  isApproved: true,
                }
              : b
          ),
        };
      });

      onUpdateScenes(updatedScenes);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || `خطا در رندر تصویر پلان B${beat.beatNumber}`);

      const updatedScenes = scenes.map((s) => {
        if (s.id !== sceneId) return s;
        return {
          ...s,
          beats: s.beats.map((b) =>
            b.id === beat.id
              ? {
                  ...b,
                  imageStatus: 'failed' as const,
                  imageError: err.message,
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

  // Batch generate all images in the active scene with sequential resilient queue
  const handleGenerateSceneImages = async (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;

    setIsBatchGenerating(true);
    setBatchProgress({ current: 0, total: scene.beats.length });

    for (let i = 0; i < scene.beats.length; i++) {
      const beat = scene.beats[i];
      setBatchProgress({ current: i + 1, total: scene.beats.length });
      try {
        await handleGenerateBeatImage(sceneId, beat);
      } catch (e) {
        console.error(`Continuing batch despite error on beat ${beat.id}`, e);
      }
    }

    setIsBatchGenerating(false);
  };

  // Batch generate all images across the entire project
  const handleGenerateAllProjectImages = async () => {
    const allBeatsCount = scenes.reduce((acc, s) => acc + s.beats.length, 0);
    setIsBatchGenerating(true);
    setBatchProgress({ current: 0, total: allBeatsCount });

    let count = 0;
    for (const scene of scenes) {
      for (const beat of scene.beats) {
        count++;
        setBatchProgress({ current: count, total: allBeatsCount });
        try {
          await handleGenerateBeatImage(scene.id, beat);
        } catch (e) {
          console.error(`Continuing queue on beat ${beat.id}`, e);
        }
      }
    }

    setIsBatchGenerating(false);
  };

  const handleSavePromptEdit = (sceneId: string, beatId: string) => {
    const updatedScenes = scenes.map((s) => {
      if (s.id !== sceneId) return s;
      return {
        ...s,
        beats: s.beats.map((b) => (b.id === beatId ? { ...b, imagePrompt: promptInput } : b)),
      };
    });
    onUpdateScenes(updatedScenes);
    setEditingPromptBeat(null);
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalImagesReady = scenes.reduce(
    (acc, s) => acc + s.beats.filter((b) => b.imageUrl).length,
    0
  );
  const totalBeats = scenes.reduce((acc, s) => acc + s.beats.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <ImageIcon className="w-4 h-4" />
          <span>مرحله هفتم: استودیوی تولید تصاویر پلان‌ها با Nano Banana</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          تولید تصاویر سینمایی با مدل هوش مصنوعی
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto">
          تصاویر به صورت واقعی با مدل Nano Banana (Gemini 3.1 Flash Lite Image) با حفظ ثبات کامل چهره کاراکترها و زبان بصری رندر می‌شوند.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Control & Batch Bar */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 text-xs text-zinc-300">
          <span className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>تصاویر آماده: {totalImagesReady} از {totalBeats} پلان</span>
          </span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400">کادر: {settings.aspectRatio}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Model Switcher Badge */}
          <div className="flex items-center bg-zinc-950 rounded-xl p-1 border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveModel('nano_banana_lite')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeModel === 'nano_banana_lite'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nano Banana 2
            </button>
            <button
              onClick={() => setActiveModel('nano_banana_pro')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeModel === 'nano_banana_pro'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nano Banana Pro
            </button>
          </div>

          <button
            onClick={() => handleGenerateSceneImages(currentScene.id)}
            disabled={isBatchGenerating}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تولید تمام تصاویر این سکانس</span>
          </button>

          <button
            onClick={handleGenerateAllProjectImages}
            disabled={isBatchGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-zinc-950" />
            <span>رندر تمام پلان‌های پروژه</span>
          </button>
        </div>
      </div>

      {/* Batch Progress Bar */}
      {isBatchGenerating && (
        <div className="bg-zinc-900/90 border border-amber-500/40 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300">
            <span>صف پردازش تصاویر در حال اجراست...</span>
            <span>
              {batchProgress.current} از {batchProgress.total} پلان
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
              style={{
                width: `${(batchProgress.current / Math.max(batchProgress.total, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Scene Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setSelectedSceneId(scene.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
              selectedSceneId === scene.id
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <span>سکانس {scene.sceneNumber}: {scene.title}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20">
              {scene.beats.filter((b) => b.imageUrl).length}/{scene.beats.length}
            </span>
          </button>
        ))}
      </div>

      {/* Beats Image Cards for current scene */}
      {currentScene && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentScene.beats.map((beat) => {
              const isGeneratingThis = generatingBeatId === beat.id;

              return (
                <div
                  key={beat.id}
                  className="bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center text-xs font-bold font-cinematic">
                        B{beat.beatNumber}
                      </span>
                      <span className="text-xs font-bold text-white">
                        پلان {beat.beatNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {beat.framing}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {beat.imageUrl && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                          <Check className="w-3 h-3" />
                          <span>تأیید شد</span>
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setEditingPromptBeat(beat);
                          setPromptInput(beat.imagePrompt || beat.description);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                        title="ویرایش پرامپت"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Image Display Box */}
                  <div
                    className={`rounded-2xl bg-zinc-950 border border-zinc-800/90 overflow-hidden relative flex items-center justify-center transition-all ${
                      settings.aspectRatio === '9:16'
                        ? 'aspect-[9/16] max-h-[380px]'
                        : settings.aspectRatio === '1:1'
                        ? 'aspect-square'
                        : 'aspect-video'
                    }`}
                  >
                    {beat.imageUrl ? (
                      <>
                        <img
                          src={beat.imageUrl}
                          alt={`Beat ${beat.beatNumber}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => setPreviewImageUrl(beat.imageUrl!)}
                            className="p-2.5 rounded-xl bg-zinc-900/90 text-white hover:text-amber-400"
                            title="بزرگ‌نمایی تصویر"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              downloadImage(
                                beat.imageUrl!,
                                `Scene_${currentScene.sceneNumber}_Beat_${beat.beatNumber}`
                              )
                            }
                            className="p-2.5 rounded-xl bg-zinc-900/90 text-white hover:text-amber-400"
                            title="دانلود تصویر"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <Camera className="w-10 h-10 text-zinc-700 mx-auto" />
                        <span className="text-xs text-zinc-500 block">
                          تصویر هنوز تولید نشده است
                        </span>
                      </div>
                    )}

                    {isGeneratingThis && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                        <span className="text-xs font-bold text-amber-300">
                          مدل Nano Banana در حال رندر پلان...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Beat Description & Prompt Preview */}
                  <div className="space-y-2 text-xs">
                    <p className="text-zinc-300 line-clamp-2 leading-relaxed">
                      {beat.description}
                    </p>
                    <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] text-zinc-400 line-clamp-2 font-mono" dir="ltr">
                      {beat.imagePrompt || beat.description}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenerateBeatImage(currentScene.id, beat)}
                      disabled={isGeneratingThis || isBatchGenerating}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        beat.imageUrl
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                          : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{beat.imageUrl ? 'تولید مجدد با پرامپت نو' : 'رندر با Nano Banana'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prompt Edit Modal */}
      {editingPromptBeat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                ویرایش پرامپت تصویر پلان B{editingPromptBeat.beatNumber}
              </h3>
              <button
                onClick={() => setEditingPromptBeat(null)}
                className="text-zinc-500 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-zinc-300 block">
                پرامپت تصویری ارسالی به مدل Nano Banana (انگلیسی):
              </label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={4}
                dir="ltr"
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-xl p-3 text-zinc-200 font-mono text-xs outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingPromptBeat(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => handleSavePromptEdit(editingPromptBeat.sceneId, editingPromptBeat.id)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20"
              >
                ذخیره پرامپت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl relative">
            <img src={previewImageUrl} alt="Beat Preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white font-bold flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom Confirmation Bar */}
      <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">تأیید تصاویر و رفتن به استودیوی نریشن</h4>
            <p className="text-xs text-zinc-400">
              در مرحله بعد صدای راوی با هوش مصنوعی و لحن احساسی ساخته و بررسی می‌شود.
            </p>
          </div>
        </div>

        <button
          onClick={onProceedToVoiceover}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>تولید صدای نریشن و گفتار</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
