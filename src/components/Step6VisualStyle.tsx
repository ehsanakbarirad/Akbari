import React from 'react';
import { Palette, Sparkles, Sliders, CheckCircle2, ArrowLeft, Camera, Layers, Eye, Film } from 'lucide-react';
import { VisualStyleBible } from '../types/filmStudio';

interface Step6VisualStyleProps {
  styleBible: VisualStyleBible | undefined;
  onUpdateStyleBible: (style: VisualStyleBible) => void;
  onProceedToBeatImages: () => void;
}

export const Step6VisualStyle: React.FC<Step6VisualStyleProps> = ({
  styleBible,
  onUpdateStyleBible,
  onProceedToBeatImages,
}) => {
  const currentStyle: VisualStyleBible = styleBible || {
    artStyle: '35mm anamorphic film cinema style with high dynamic range',
    renderingEngine: 'Volumetric ray-tracing photorealism, fine brass and dust particles',
    colorPalette: ['#090A0F', '#18181B', '#D97706', '#F59E0B', '#38BDF8'],
    lighting: 'Dramatic chiaroscuro with soft golden rim highlights and deep velvety shadows',
    lensType: '50mm prime f/1.4 lens with smooth circular bokeh',
    depthOfField: 'Shallow depth of field with sharp focal subject and dreamy background falloff',
    contrast: 'Cinematic dynamic range with calibrated highlights',
    cinematicAtmosphere: 'Atmospheric haze, suspended dust motes, rich emotional aura',
    textureAndGrain: 'Kodak Vision3 500T organic 35mm film grain',
    cameraMovementRules: 'Slow deliberate push-in and subtle parallax panning',
    compositionRules: 'Rule of thirds with strong leading lines and balanced headroom',
  };

  const handleFieldChange = (field: keyof VisualStyleBible, value: any) => {
    const updated = { ...currentStyle, [field]: value };
    onUpdateStyleBible(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Palette className="w-4 h-4" />
          <span>مرحله ششم: کتابچه راهنمای سبک بصری (Visual Style Bible)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          دستورالعمل جامع زبان بصری پروژه
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          برای اینکه تمام پلان‌ها و تصاویر حس یکپارچه یک اثر سینمایی واحد را داشته باشند، تمام پارامترهای اپتیکال و رنگی زیر در تک‌تک پرامپت‌ها تزریق می‌شوند.
        </p>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Color Palette Display */}
        <div className="space-y-3 pb-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">پالت رنگ اختصاصی فیلم (Color Palette):</span>
            <span className="text-[11px] text-zinc-500">هارمونی رنگی صحنه‌ها</span>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {currentStyle.colorPalette?.map((color, i) => (
              <div key={i} className="space-y-1.5 text-center">
                <div
                  className="h-14 sm:h-16 rounded-2xl border border-zinc-700/80 shadow-inner flex items-center justify-center"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[11px] font-mono text-zinc-400 block" dir="ltr">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Visual Guidelines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Film className="w-4 h-4" />
              <span>سبک هنری و زبان بصری:</span>
            </div>
            <textarea
              value={currentStyle.artStyle}
              onChange={(e) => handleFieldChange('artStyle', e.target.value)}
              rows={2}
              className="w-full bg-transparent text-zinc-200 border-0 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>موتور و کیفیت رندرینگ:</span>
            </div>
            <textarea
              value={currentStyle.renderingEngine}
              onChange={(e) => handleFieldChange('renderingEngine', e.target.value)}
              rows={2}
              className="w-full bg-transparent text-zinc-200 border-0 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Camera className="w-4 h-4" />
              <span>نوع لنز و اپتیک:</span>
            </div>
            <textarea
              value={currentStyle.lensType}
              onChange={(e) => handleFieldChange('lensType', e.target.value)}
              rows={2}
              className="w-full bg-transparent text-zinc-200 border-0 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Sliders className="w-4 h-4" />
              <span>عمق میدان و بوکه (Depth of Field):</span>
            </div>
            <textarea
              value={currentStyle.depthOfField}
              onChange={(e) => handleFieldChange('depthOfField', e.target.value)}
              rows={2}
              className="w-full bg-transparent text-zinc-200 border-0 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Eye className="w-4 h-4" />
              <span>نورپردازی سینمایی (Lighting):</span>
            </div>
            <textarea
              value={currentStyle.lighting}
              onChange={(e) => handleFieldChange('lighting', e.target.value)}
              rows={2}
              className="w-full bg-transparent text-zinc-200 border-0 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Layers className="w-4 h-4" />
              <span>بافت تصویر و گرین نگاتیو:</span>
            </div>
            <textarea
              value={currentStyle.textureAndGrain}
              onChange={(e) => handleFieldChange('textureAndGrain', e.target.value)}
              rows={2}
              className="w-full bg-transparent text-zinc-200 border-0 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Composition and Camera rules */}
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs">
          <span className="font-bold text-amber-400 block">
            قوانین ترکیب‌بندی قاب‌ها و حرکت دوربین:
          </span>
          <p className="text-zinc-300 leading-relaxed">
            {currentStyle.compositionRules} — {currentStyle.cameraMovementRules}
          </p>
        </div>
      </div>

      {/* Bottom Confirmation Bar */}
      <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">
              تأیید استایل و شروع تولید تصاویر بیت‌ها
            </h4>
            <p className="text-xs text-zinc-400">
              با تأیید این بخش وارد استودیوی تولید تصاویر واقعی با Nano Banana خواهید شد.
            </p>
          </div>
        </div>

        <button
          onClick={onProceedToBeatImages}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>تولید تصاویر بیت‌ها با Nano Banana</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
