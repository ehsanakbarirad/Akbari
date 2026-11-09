import React, { useState, useRef, useEffect } from 'react';
import { Film, Play, Pause, Download, Archive, RefreshCw, Volume2, Clock, CheckCircle2, FileText, ChevronRight, ChevronLeft, Eye, Sparkles } from 'lucide-react';
import { FilmProject, Scene, Beat } from '../types/filmStudio';
import JSZip from 'jszip';

interface Step11FinalStudioProps {
  project: FilmProject;
  onUpdateProject: (updated: FilmProject) => void;
  onGoBackToStep: (step: FilmProject['currentStep']) => void;
}

export const Step11FinalStudio: React.FC<Step11FinalStudioProps> = ({
  project,
  onUpdateProject,
  onGoBackToStep,
}) => {
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'storyboard'>('timeline');

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any>(null);

  // Flatten all beats sequentially
  const allBeats: { beat: Beat; scene: Scene }[] = [];
  project.scenes?.forEach((s) => {
    s.beats?.forEach((b) => {
      allBeats.push({ beat: b, scene: s });
    });
  });

  const currentItem = allBeats[currentBeatIndex] || allBeats[0];

  // Total project duration
  const totalDuration = allBeats.reduce((acc, item) => acc + (item.beat.durationSec || 4), 0);

  // Timeline player step handler
  useEffect(() => {
    if (!isPlayingTimeline) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (currentBeatIndex >= allBeats.length) {
      setIsPlayingTimeline(false);
      setCurrentBeatIndex(0);
      return;
    }

    const currentBeat = allBeats[currentBeatIndex]?.beat;
    const durationMs = (currentBeat?.durationSec || 4) * 1000;

    // Play narration audio if present
    if (currentBeat?.audioUrl) {
      if (!audioPlayerRef.current) audioPlayerRef.current = new Audio();
      audioPlayerRef.current.src = currentBeat.audioUrl;
      audioPlayerRef.current.play().catch((e) => console.log('Audio autoplay prevented', e));
    }

    timerRef.current = setTimeout(() => {
      setCurrentBeatIndex((prev) => prev + 1);
    }, durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlayingTimeline, currentBeatIndex, allBeats.length]);

  const togglePlay = () => {
    if (isPlayingTimeline) {
      setIsPlayingTimeline(false);
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
    } else {
      if (currentBeatIndex >= allBeats.length) setCurrentBeatIndex(0);
      setIsPlayingTimeline(true);
    }
  };

  // Generate and download entire project as a clean ZIP package
  const handleExportZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // 1. Project Information & Story
      const readmeText = `=====================================================
AI FILM STUDIO - AUTONOMOUS VIDEO PRODUCTION PLATFORM
Project Title: ${project.title}
Topic: ${project.topic}
Created: ${project.createdAt}
Duration: ${project.settings?.duration} | Aspect Ratio: ${project.settings?.aspectRatio}
=====================================================

--- SCREENPLAY & STORY ARC ---
Title: ${project.story?.title}
Logline: ${project.story?.logline}
Core Message: ${project.story?.coreMessage}
Synopsis: ${project.story?.synopsis}
Hook: ${project.story?.hook}
Intro: ${project.story?.intro}
Development: ${project.story?.development}
Climax: ${project.story?.climax}
Resolution: ${project.story?.resolution}
Target Emotion: ${project.story?.targetEmotion}

--- CHARACTERS BIBLE ---
${project.characters
  ?.map(
    (c, i) => `[Character ${i + 1}] ${c.name} (${c.role})
Age: ${c.approxAge} | Gender: ${c.gender}
Face: ${c.faceShape}, ${c.facialFeatures} | Hair: ${c.hairStyle} (${c.hairColor})
Clothing: ${c.clothing}
Rules: ${c.persistentVisualRules}`
  )
  .join('\n\n')}

--- VISUAL STYLE BIBLE ---
Art Style: ${project.visualStyleBible?.artStyle}
Rendering: ${project.visualStyleBible?.renderingEngine}
Lighting: ${project.visualStyleBible?.lighting}
Palette: ${project.visualStyleBible?.colorPalette?.join(', ')}
`;
      zip.file('README_PROJECT_BIBLE.txt', readmeText);

      // JSON metadata
      zip.file('project_data.json', JSON.stringify(project, null, 2));

      // 2. Storyboard Images
      const imagesFolder = zip.folder('storyboard_images');
      const audioFolder = zip.folder('narration_audio');
      const videoPromptsList: string[] = [];

      for (let sIdx = 0; sIdx < project.scenes.length; sIdx++) {
        const scene = project.scenes[sIdx];
        for (let bIdx = 0; bIdx < scene.beats.length; bIdx++) {
          const beat = scene.beats[bIdx];
          const filePrefix = `Scene_${String(scene.sceneNumber).padStart(2, '0')}_Beat_${String(beat.beatNumber).padStart(2, '0')}`;

          // Image
          if (beat.imageUrl && beat.imageUrl.startsWith('data:image')) {
            const base64Data = beat.imageUrl.split(',')[1];
            imagesFolder?.file(`${filePrefix}.png`, base64Data, { base64: true });
          }

          // Audio
          if (beat.audioUrl && beat.audioUrl.startsWith('data:audio')) {
            const base64Audio = beat.audioUrl.split(',')[1];
            audioFolder?.file(`${filePrefix}_narration.wav`, base64Audio, { base64: true });
          }

          // Video Prompt
          videoPromptsList.push(`[${filePrefix}]
Action: ${beat.description}
Framing: ${beat.framing} | Movement: ${beat.cameraMovement}
Veo Prompt: ${beat.videoPrompt || beat.description}
Narration: ${beat.narrationText || 'None'}
-----------------------------------------------------`);
        }
      }

      zip.file('video_prompts_veo.txt', videoPromptsList.join('\n\n'));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/\s+/g, '_')}_AI_Film_Production_Package.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Error generating zip export:', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Film className="w-4 h-4" />
          <span>مرحله دوازدهم: استودیوی تدوین، پخش تایم‌لاین و خروجی نهایی</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          استودیو تدوین و نمایش فیلم نهایی
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto">
          پلان‌ها، تصاویر و صداهای نریشن را به ترتیب خط زمانی مشاهده کنید، پیش‌نمایش اثر را ببینید یا پکیج جامع پروژه (ZIP) را دریافت کنید.
        </p>
      </div>

      {/* Main Studio Controls Bar */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex items-center text-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'timeline' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              پخش تایم‌لاین سینمایی
            </button>
            <button
              onClick={() => setViewMode('storyboard')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'storyboard' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              شبکه استوری‌بورد (Storyboard Grid)
            </button>
          </div>

          <span className="text-xs text-zinc-400 hidden sm:inline flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>زمان کل: {totalDuration} ثانیه</span>
          </span>
        </div>

        {/* Primary Export Button */}
        <button
          onClick={handleExportZip}
          disabled={isZipping}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isZipping ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Archive className="w-4 h-4" />
          )}
          <span>دانلود بسته کامل پروژه (ZIP شامل تصاویر، صداها و فیلمنامه)</span>
        </button>
      </div>

      {/* View 1: Cinematic Interactive Timeline Player */}
      {viewMode === 'timeline' && currentItem && (
        <div className="space-y-6">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6 shadow-2xl cinematic-glow">
            {/* Screen Player */}
            <div
              className={`w-full rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden relative flex items-center justify-center mx-auto ${
                project.settings?.aspectRatio === '9:16'
                  ? 'aspect-[9/16] max-h-[500px]'
                  : project.settings?.aspectRatio === '1:1'
                  ? 'aspect-square max-h-[460px]'
                  : 'aspect-video max-h-[480px]'
              }`}
            >
              {currentItem.beat.videoUrl ? (
                <video
                  src={currentItem.beat.videoUrl}
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              ) : currentItem.beat.imageUrl ? (
                <img
                  src={currentItem.beat.imageUrl}
                  alt={`Beat ${currentItem.beat.beatNumber}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Film className="w-12 h-12 text-zinc-700 mx-auto" />
                  <span className="text-xs text-zinc-500 block">
                    تصویر این پلان هنوز تولید نشده است
                  </span>
                </div>
              )}

              {/* Subtitles Overlay */}
              {currentItem.beat.needsNarration && currentItem.beat.narrationText && (
                <div className="absolute bottom-4 inset-x-4 bg-black/75 backdrop-blur-md p-3 rounded-xl border border-zinc-700/60 text-center">
                  <p className="text-xs sm:text-sm font-bold text-amber-200">
                    "{currentItem.beat.narrationText}"
                  </p>
                </div>
              )}

              {/* Badge Overlay */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-zinc-200 border border-zinc-700/60">
                سکانس {currentItem.scene.sceneNumber} — پلان {currentItem.beat.beatNumber} ({currentBeatIndex + 1}/{allBeats.length})
              </div>
            </div>

            {/* Playback Controls & Scrubber */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentBeatIndex(Math.max(0, currentBeatIndex - 1))}
                    disabled={currentBeatIndex === 0}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40"
                    title="پلان قبلی"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    {isPlayingTimeline ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-zinc-950" />}
                    <span>{isPlayingTimeline ? 'توقف پخش' : 'پخش فیلم کامل'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentBeatIndex(Math.min(allBeats.length - 1, currentBeatIndex + 1))}
                    disabled={currentBeatIndex === allBeats.length - 1}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40"
                    title="پلان بعدی"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-zinc-400">
                  مدت نما: <strong className="text-white">{currentItem.beat.durationSec || 4} ثانیه</strong>
                </div>
              </div>

              {/* Plan Scrubber Line */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar">
                {allBeats.map((item, idx) => {
                  const isCurrent = idx === currentBeatIndex;
                  const hasMedia = item.beat.imageUrl || item.beat.videoUrl;

                  return (
                    <button
                      key={item.beat.id}
                      onClick={() => setCurrentBeatIndex(idx)}
                      className={`h-12 rounded-lg border transition-all flex flex-col justify-between p-1.5 shrink-0 min-w-[70px] text-right ${
                        isCurrent
                          ? 'bg-amber-500/25 border-amber-500 text-amber-300'
                          : hasMedia
                          ? 'bg-zinc-950/80 border-zinc-800 text-zinc-400'
                          : 'bg-zinc-950/30 border-dashed border-zinc-800 text-zinc-600'
                      }`}
                    >
                      <span className="text-[10px] font-bold block font-cinematic">
                        S{item.scene.sceneNumber}:B{item.beat.beatNumber}
                      </span>
                      <span className="text-[9px] text-zinc-500 block truncate">
                        {item.beat.framing}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Beat Details Card */}
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-400 font-bold">
                <span>شرح صحنه دکوپاژ:</span>
                <span className="text-amber-400">{currentItem.scene.title}</span>
              </div>
              <p className="text-zinc-300 leading-relaxed">
                {currentItem.beat.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-zinc-500 border-t border-zinc-800/80">
                <span>زاویه: {currentItem.beat.cameraAngle}</span>
                <span>حرکت: {currentItem.beat.cameraMovement}</span>
                <span>نورپردازی: {currentItem.beat.lighting}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Storyboard Grid */}
      {viewMode === 'storyboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allBeats.map((item, idx) => (
              <div
                key={item.beat.id}
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-3 flex flex-col justify-between space-y-3"
              >
                <div className="aspect-video rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden relative flex items-center justify-center">
                  {item.beat.imageUrl ? (
                    <img
                      src={item.beat.imageUrl}
                      alt={`Beat ${item.beat.beatNumber}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Film className="w-8 h-8 text-zinc-700" />
                  )}
                  <span className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 font-cinematic">
                    S{item.scene.sceneNumber}:B{item.beat.beatNumber}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] text-amber-400/90 font-bold block">
                    {item.beat.framing} — {item.beat.cameraMovement}
                  </span>
                  <p className="text-zinc-300 text-[11px] line-clamp-2 leading-relaxed">
                    {item.beat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
