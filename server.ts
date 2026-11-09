import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared server-side GoogleGenAI client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY در تنظیمات سیستم یافت نشد.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Generate 5 creative film ideas
app.post('/api/film/generate-ideas', async (req: Request, res: Response) => {
  try {
    const { topic, genre, count = 5 } = req.body;
    const ai = getAiClient();

    const prompt = topic && topic.trim().length > 0
      ? `شما یک مدیر خلاقیت و ایده‌پرداز ارشد سینمایی هستید. بر اساس موضوع "${topic}" (و ژانر مدنظر: ${genre || 'متنوع'})، ۵ ایده خلاقانه، بکر و سینمایی متفاوت طراحی کنید.`
      : `شما یک مدیر خلاقیت و ایده‌پرداز ارشد سینمایی هستید. ۵ ایده داستانی فوق‌العاده جذاب، بکر، عمیق و مناسب برای تولید فیلم کوتاه/محتوای سینمایی با هوش مصنوعی در ژانرهای مختلف پیشنهاد دهید. ایده‌ها نباید تکراری و کلیشه‌ای باشند.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `شما مدیر خلاقیت و سناریونویس سینمایی درجه یک هستید. خروجی باید یک آرایه از ۵ آبجکت جیسون با مشخصات زیر به زبان فارسی باشد.
        فیلدها:
        - id: شناسه کوتاه یکتا (مانند idea_1, idea_2)
        - title: عنوان جذاب سینمایی
        - genre: ژانر (مثلا معمایی، درام فلسفی، علمی-تخیلی، حماسی، نئونوآر)
        - shortDesc: توضیح کوتاه و محرک (یک جمله)
        - synopsis: خلاصه جذاب داستان و تعلیق اصلی (۲ تا ۳ جمله)
        - visualAppeal: جذابیت بصری و صحنه‌پردازی خاص
        - suggestedDuration: پیشنهاد مدت ویدئو (مثلا ۶۰ ثانیه، ۹۰ ثانیه، ۳ دقیقه)
        - tone: لحن اثر (مثلا تأمل‌برانگیز، پرهیجان، رازآلود)`,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    let ideas = [];
    try {
      ideas = JSON.parse(text);
    } catch {
      const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) ideas = JSON.parse(match[0]);
    }

    return res.json({ success: true, ideas });
  } catch (error: any) {
    console.error('Error generating ideas:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'خطا در تولید ایده‌های سینمایی',
    });
  }
});

// 2. Generate structured cinematic story arc
app.post('/api/film/generate-story', async (req: Request, res: Response) => {
  try {
    const { topic, settings, modificationAction, existingStory } = req.body;
    const ai = getAiClient();

    let instructionModifier = '';
    if (modificationAction === 'rewrite') {
      instructionModifier = 'داستان را از زاویه دید نو و با تغییر اساسی عناصر بازنویسی کنید.';
    } else if (modificationAction === 'change_ending') {
      instructionModifier = 'پایان‌بندی داستان را تغییر داده و یک غافلگیری (Plot Twist) عمیق و غیرمنتظره به آن اضافه کنید.';
    } else if (modificationAction === 'punchier') {
      instructionModifier = 'تعلیق، هیجان و کشش دراماتیک صحنه‌ها را بیشتر کنید و ریتم روایی را نفس‌گیرتر نمایید.';
    } else if (modificationAction === 'shorten') {
      instructionModifier = 'داستان را فشرده‌تر، موجزتر و ضربتی‌تر بنویسید به طوری که ضرب‌آهنگ سریع‌تری داشته باشد.';
    }

    const prompt = `
موضوع فیلم: ${topic}
نوع محتوا: ${settings?.contentType || 'داستانی'}
سبک بصری: ${settings?.visualStyle || 'سینمایی'}
مدت زمان اثر: ${settings?.duration || '۶۰ ثانیه'}
لحن نریشن: ${settings?.narrationTone || 'احساسی'}
زبان: ${settings?.language === 'en' ? 'انگلیسی' : 'فارسی'}
دستور ویژه: ${instructionModifier || 'یک داستان منسجم، با کشش روایی فوق‌العاده و پایان دراماتیک خلق کن.'}
${existingStory ? `داستان قبلی جهت بازبینی:\n${JSON.stringify(existingStory)}` : ''}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `شما یک فیلمنامه‌نویس و کارگردان سینمایی هستید. بر اساس اطلاعات ورودی، فیلمنامه و ساختار روایی کامل اثر را به صورت آبجکت JSON به زبان فارسی با ساختار زیر تولید کنید:
{
  "title": "عنوان جذاب فیلم",
  "logline": "ایده مرکزی داستان در یک جمله قوی",
  "coreMessage": "پیام اخلاقی یا فلسفی اصلی داستان",
  "synopsis": "خلاصه کل داستان در ۳ الی ۴ جمله منسجم",
  "hook": "شروع جذاب و قلاب اولیه برای جلب توجه مخاطب در ۵ ثانیه اول",
  "intro": "مقدمه و فضاسازی ابتدایی و معرفی شخصیت",
  "development": "گسترش داستان، بروز چالش و بالا رفتن تنش روایی",
  "climax": "نقطه اوج داستان و لحظه سرنوشت‌ساز",
  "resolution": "پایان‌بندی و نتیجه‌گیری ماندگار",
  "targetEmotion": "احساس هدف نهایی در مخاطب (مانند حیرت، امید، تأمل عمیق)",
  "isApproved": false
}`,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let story = {};
    try {
      story = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) story = JSON.parse(match[0]);
    }

    return res.json({ success: true, story });
  } catch (error: any) {
    console.error('Error generating story:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'خطا در نگارش داستان سینمایی',
    });
  }
});

// 3. Generate Scenes & Beats Breakdown
app.post('/api/film/generate-scenes-and-beats', async (req: Request, res: Response) => {
  try {
    const { story, settings } = req.body;
    const ai = getAiClient();

    const prompt = `
داستان فیلم:
عنوان: ${story?.title}
لاگ‌لاین: ${story?.logline}
قلاب اول: ${story?.hook}
مقدمه: ${story?.intro}
گسترش: ${story?.development}
نقطه اوج: ${story?.climax}
پایان‌بندی: ${story?.resolution}

تنظیمات:
سبک بصری: ${settings?.visualStyle}
مدت زمان اثر: ${settings?.duration}
نوع نریشن: ${settings?.narrationType}
لحن نریشن: ${settings?.narrationTone}
نسبت تصویر: ${settings?.aspectRatio || '16:9'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `شما متخصص Storyboard، کارگردان و دکوپاژ سینما هستید. این داستان را به سکانس‌های سینمایی (بین ۲ تا ۴ سکانس بر اساس مدت زمان) و هر سکانس را به بیت‌های مجزا (Beats) تقسیم کنید. هر Beat باید بیانگر یک پلان یا نمای مستقل سینمایی باشد که می‌تواند مستقیماً به یک تصویر خیره‌کننده و سپس یک کلیپ ویدئویی تبدیل شود.

پاسخ را به صورت آرایه‌ای از آبجکت‌های سکانس (JSON) به زبان فارسی به فرمت زیر ارائه دهید:
[
  {
    "id": "scene_1",
    "sceneNumber": 1,
    "title": "عنوان سکانس",
    "location": "مکان دقیق وقوع (مثلا: اتاق زیرشیروانی پر از غبار)",
    "timeOfDay": "زمان (مثلا: غروب پاییزی، نیمه‌شب بارانی)",
    "charactersPresent": ["نام شخصیت‌های حاضر"],
    "dramaticObjective": "هدف دراماتیک صحنه",
    "summary": "شرح وقایع این سکانس",
    "mood": "حس و حال اتمسفر صحنه",
    "durationSec": 15,
    "isApproved": false,
    "beats": [
      {
        "id": "beat_1_1",
        "sceneId": "scene_1",
        "beatNumber": 1,
        "description": "شرح دقیق اتفاق بصری این نما",
        "characterAction": "کنش فیزیکی و دقیق شخصیت در این نما",
        "facialExpression": "حالت چهره و میمیک صورت",
        "bodyLanguage": "زبان بدن و حالت ایستادن یا حرکت",
        "environmentDetail": "جزئیات نور، غبار، اشیاء و پس‌زمینه",
        "cameraAngle": "زاویه دوربین (مثلا: Low-angle, Eye-level, High-angle)",
        "framing": "نوع قاب (مثلا: Extreme Close-Up, Medium Shot, Wide Establishing Shot)",
        "cameraMovement": "حرکت دوربین (مثلا: Slow push-in, Orbit, Dolly track, Static)",
        "lighting": "نورپردازی سینمایی (مثلا: Golden hour rim lighting, Chiaroscuro high contrast, Neon volumetric)",
        "durationSec": 4,
        "needsNarration": true,
        "narrationText": "متن جذاب نریشن برای این پلان (اگر نیاز به نریشن ندارد رشته خالی بگذارید)",
        "dialogue": "دیالوگ احتمالی یا صدای درونی شخصیت",
        "soundFx": "افکت صوتی محیطی و موسیقی (مثلا: صدای تیک‌تاک ساعت کهنه، وزش ملایم باد)",
        "imagePrompt": "پرامپت انگلیسی فوق‌العاده باکیفیت و سینمایی برای تولید تصویر در مدل‌های تصویرسازی هوش مصنوعی شامل سبک، نور، زاویه و جزئیات دقیق بدون کلمات ممنوعه",
        "videoPrompt": "پرامپت انگلیسی دقیق برای ایجاد حرکت ویدئویی در مدل‌های ویدیوساز (حرکت سوژه، حرکت دوربین، حفظ ثبات شخصیت و اتمسفر)",
        "imageStatus": "idle",
        "audioStatus": "idle",
        "videoStatus": "idle",
        "isApproved": false
      }
    ]
  }
]`,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    let scenes = [];
    try {
      scenes = JSON.parse(text);
    } catch {
      const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) scenes = JSON.parse(match[0]);
    }

    return res.json({ success: true, scenes });
  } catch (error: any) {
    console.error('Error generating scenes and beats:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'خطا در سکانس‌بندی و تولید بیت‌های سینمایی',
    });
  }
});

// 4. Generate Character Bible & Visual Style Bible
app.post('/api/film/generate-characters-and-bible', async (req: Request, res: Response) => {
  try {
    const { story, settings, scenes } = req.body;
    const ai = getAiClient();

    const prompt = `
داستان فیلم:
${JSON.stringify(story)}

سبک بصری مدنظر:
${settings?.visualStyle}

سکانس‌ها و شخصیت‌های حاضر:
${JSON.stringify(scenes?.map((s: any) => ({ title: s.title, chars: s.charactersPresent })))}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `شما طراح ارشد شخصیت (Character Designer) و مدیر هنری پروژه هستید.
وظیفه شما ایجاد Character Bible دقیق برای حفظ ثبات شخصیت‌ها در تصاویر و همچنین Visual Style Bible کل پروژه است.

یک آبجکت JSON با ساختار زیر خروجی بده:
{
  "visualStyleBible": {
    "artStyle": "سبک دقیق هنری (مثلا: 35mm cinematic film grain, anamorphic widescreen)",
    "renderingEngine": "موتور یا شیوه رندر (مثلا: Hyper-detailed photorealism, volumetric rays)",
    "colorPalette": ["#1A1C29", "#D97706", "#4B5563", "#F3F4F6", "#0F172A"],
    "lighting": "شیوه نورپردازی غالب فیلم (مثلا: Moody cinematic lighting with soft rim highlights)",
    "lensType": "نوع لنز (مثلا: 50mm f/1.2 prime lens, subtle anamorphic bokeh)",
    "depthOfField": "عمق میدان (مثلا: Shallow depth of field with creamy background blur)",
    "contrast": "کنتراست و دامنه دینامیکی (مثلا: High dynamic range with deep rich shadows)",
    "cinematicAtmosphere": "اتمسفر کلی اثر",
    "textureAndGrain": "بافت تصویر و فیلم گرین",
    "cameraMovementRules": "قوانین حرکت دوربین",
    "compositionRules": "قوانین ترکیب‌بندی (مثلا: Rule of thirds, leading lines, headroom balance)"
  },
  "characters": [
    {
      "id": "char_1",
      "name": "نام شخصیت",
      "role": "نقش (قهرمان اصلی، راوی، رقیب و ...)",
      "approxAge": "سن تقریبی",
      "gender": "جنسیت ظاهری",
      "facialFeatures": "ویژگی‌های بارز چهره",
      "faceShape": "فرم صورت",
      "eyeColor": "رنگ و حالت چشم‌ها",
      "hairStyle": "مدل مو",
      "hairColor": "رنگ مو",
      "bodyType": "فرم اندام و استخوان‌بندی",
      "skinTone": "رنگ و بافت پوست",
      "clothing": "لباس اصلی دقیق",
      "shoes": "پوشش کفش",
      "accessories": "اکسسوری‌ها و لوازم همراه",
      "personality": "شخصیت رفتاری",
      "emotionalVibe": "حس احساسی که منتقل می‌کند",
      "persistentVisualRules": "دستورات صریح برای پرامپت‌ها جهت حفظ ثبات کامل چهره و لباس در تمام صحنه‌ها",
      "referenceImages": [
        {
          "id": "ref_1",
          "viewType": "front_full",
          "label": "نمای تمام‌رخ روبه‌رو (Front View)",
          "prompt": "Detailed cinematic portrait prompt in English for full front face with exact features and neutral lighting",
          "status": "idle"
        },
        {
          "id": "ref_2",
          "viewType": "three_quarter",
          "label": "نمای سه‌رخ (3/4 Perspective)",
          "prompt": "Cinematic portrait prompt in English for three-quarter angle view showing character facial structure",
          "status": "idle"
        },
        {
          "id": "ref_3",
          "viewType": "close_up",
          "label": "نمای نزدیک چهره و چشم‌ها (Close-Up)",
          "prompt": "Intense close-up cinematic shot in English focusing on eyes and expression with natural skin texture",
          "status": "idle"
        },
        {
          "id": "ref_4",
          "viewType": "full_body",
          "label": "نمای تمام‌قد با پوشش کامل (Full Body Standing)",
          "prompt": "Full-body cinematic portrait prompt in English showing complete outfit and posture",
          "status": "idle"
        }
      ]
    }
  ]
}`,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let bibleData = {};
    try {
      bibleData = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) bibleData = JSON.parse(match[0]);
    }

    return res.json({ success: true, data: bibleData });
  } catch (error: any) {
    console.error('Error generating character bible:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'خطا در طراحی شخصیت‌ها و استایل بصری',
    });
  }
});

// 5. Generate Real Image using Nano Banana / Gemini Flash Lite Image
app.post('/api/film/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '16:9', referenceImageBase64 } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'پرامپت تصویر الزامی است.' });
    }

    const ai = getAiClient();

    // Map aspect ratio safely to supported types: '1:1', '3:4', '4:3', '9:16', '16:9'
    let targetRatio = '16:9';
    if (aspectRatio === '9:16' || aspectRatio === '1:1' || aspectRatio === '4:3' || aspectRatio === '3:4' || aspectRatio === '16:9') {
      targetRatio = aspectRatio;
    }

    const contentsParts: any[] = [];
    if (referenceImageBase64) {
      // Strip potential data URL prefix if present
      const cleanBase64 = referenceImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contentsParts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/png',
        },
      });
      contentsParts.push({
        text: `Based on the character reference and style shown in the provided image, create this scene with perfect facial consistency and matching visual style: ${prompt}`,
      });
    } else {
      contentsParts.push({
        text: prompt,
      });
    }

    // Call gemini-3.1-flash-lite-image (Nano Banana series)
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: contentsParts,
      },
      config: {
        imageConfig: {
          aspectRatio: targetRatio as any,
        },
      },
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('مدل تصویری خروجی برنگرداند. لطفاً مجدداً امتحان کنید.');
    }

    return res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'خطا در اتصال به سرویس تولید تصویر Nano Banana',
    });
  }
});

// 6. Generate Voiceover / Speech TTS
app.post('/api/film/generate-voiceover', async (req: Request, res: Response) => {
  try {
    const { text, tone = 'emotional', gender = 'male', language = 'fa' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'متن نریشن الزامی است.' });
    }

    const ai = getAiClient();
    // Choose appropriate voice
    const voiceName = gender === 'female' ? 'Kore' : 'Puck';

    const styleDesc = `A cinematic, ${tone} storytelling narrator with clear pacing and emotional gravity.`;

    const interaction = await ai.interactions.create({
      model: 'gemini-3.8-flash-lite-tts',
      input: [
        {
          type: 'text',
          text,
          annotations: [
            {
              type: 'speech_metadata',
              style: styleDesc,
            },
          ],
        },
      ],
      response_format: { type: 'audio' },
      generation_config: {
        speech_config: [
          {
            language: language === 'en' ? 'en-US' : 'fa-IR',
            voice: voiceName,
          },
        ],
      },
    });

    const audio = interaction.output_audio;
    if (audio?.data) {
      const mime = audio.mime_type || 'audio/wav';
      const audioUrl = `data:${mime};base64,${audio.data}`;
      return res.json({ success: true, audioUrl });
    }

    throw new Error('فایل صوتی تولید نشد.');
  } catch (error: any) {
    console.error('Error in voiceover TTS:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'خطا در ساخت صدای نریشن با هوش مصنوعی',
    });
  }
});

// 7. Generate Video with Veo / Omni Flash
app.post('/api/film/generate-video', async (req: Request, res: Response) => {
  try {
    const { imageBase64, videoPrompt, aspectRatio = '16:9', duration = '5s' } = req.body;
    if (!videoPrompt) {
      return res.status(400).json({ success: false, error: 'پرامپت ویدئو الزامی است.' });
    }

    const ai = getAiClient();

    const inputParts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      inputParts.push({
        type: 'image',
        mime_type: 'image/png',
        data: cleanBase64,
      });
    }
    inputParts.push({
      type: 'text',
      text: videoPrompt,
    });

    // Call gemini-omni-1.2-flash (Veo / Video generation)
    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.2-flash',
        input: inputParts,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
          duration: '5s',
          resolution: '720p',
        },
      },
      { timeout: 180000 } // 3 min timeout
    );

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      const mime = videoPart.mime_type || 'video/mp4';
      const videoUrl = `data:${mime};base64,${videoPart.data}`;
      return res.json({ success: true, videoUrl });
    }

    throw new Error('مدل ویدیوساز خروجی فایل ویدیو ارسال نکرد.');
  } catch (error: any) {
    console.error('Video generation error:', error);
    // Explicitly retain prompt and return clear error message per instructions
    return res.status(500).json({
      success: false,
      error: error.message || 'سرویس تولید ویدیوی Google Veo در این لحظه در دسترس نیست یا نیاز به سهمیه ویدیویی دارد. پرامپت دقیق ویدیویی محفوظ ماند.',
    });
  }
});

// 8. Download complete project source code as GitHub-ready ZIP
app.get('/api/download-github-zip', async (req: Request, res: Response) => {
  try {
    const zip = new JSZip();

    const ignoredNames = new Set([
      'node_modules',
      'dist',
      '.git',
      '.DS_Store',
      'coverage',
      'build',
      '.npm',
      '.turbo',
      'bun.lock',
    ]);

    const addDirectory = (dir: string, currentZip: JSZip) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (ignoredNames.has(file) || file.endsWith('.zip') || file.endsWith('.log')) {
          continue;
        }
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          const folderZip = currentZip.folder(file);
          if (folderZip) {
            addDirectory(filePath, folderZip);
          }
        } else {
          const content = fs.readFileSync(filePath);
          currentZip.file(file, content);
        }
      }
    };

    addDirectory(__dirname, zip);

    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="ai-film-studio-github.zip"'
    );
    res.setHeader('Content-Length', buffer.length.toString());
    return res.send(buffer);
  } catch (error: any) {
    console.error('Error bundling source zip:', error);
    return res.status(500).json({ success: false, error: 'خطا در ایجاد فایل فشرده سورس‌کد' });
  }
});

// Set up Vite dev server or static serve
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 AI FILM STUDIO running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
