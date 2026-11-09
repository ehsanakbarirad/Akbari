import { FilmProject, ProjectSettings } from '../types/filmStudio';

const STORAGE_KEY = 'ai_film_studio_projects';
const ACTIVE_PROJECT_KEY = 'ai_film_studio_active_id';

export const DEFAULT_SETTINGS: ProjectSettings = {
  contentType: 'narrative',
  visualStyle: 'cinematic_realistic',
  duration: '60s',
  aspectRatio: '16:9',
  language: 'fa',
  narrationType: 'male',
  narrationTone: 'emotional',
  detailLevel: 'medium',
  characterCount: 2,
  autoMode: false,
};

// Seed sample project showcasing power of AI Film Studio
const SAMPLE_PROJECT: FilmProject = {
  id: 'proj_sample_01',
  title: 'نگهبان ساعت کهکشان',
  topic: 'داستان آخرین ساعت‌ساز زمین که زمان را کوک می‌کند',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentStep: 'final_studio',
  settings: {
    contentType: 'narrative',
    visualStyle: 'cinematic_realistic',
    duration: '60s',
    aspectRatio: '16:9',
    language: 'fa',
    narrationType: 'male',
    narrationTone: 'epic',
    detailLevel: 'detailed',
    characterCount: 1,
    autoMode: false,
  },
  story: {
    title: 'نگهبان ساعت کهکشان',
    logline: 'در جهانی که زمان یخ زده است، پیرمردی در برجی خاموش آخرین چرخ‌دنده خورشید را کوک می‌کند.',
    coreMessage: 'امید و پشتکار، حتی در تاریک‌ترین دوران‌ها می‌تواند نبض زندگی را دوباره جاری سازد.',
    synopsis: 'در آخرین بقایای سیاره، زمان از حرکت ایستاده است. سهراب، کهنسال‌ترین ساعت‌ساز تاریخ، در بالای برج نجومی غبارآلود با چرخ‌دنده‌های برنجی کلنجار می‌رود تا نور خورشید را بازگرداند.',
    hook: 'تصویر عقربه‌ای برنجی و غول‌پیکر که در ثانیه پایانی گیر کرده و غبار کیهانی روی آن نشسته است.',
    intro: 'سهراب با ذره‌بینی بر چشم، در میان هزاران چرخ‌دنده طلایی معلق قدم برمی‌دارد.',
    development: 'با قرار دادن قطعه بلورین در قلب ساعت، لرزشی پرقدرت برج را تکان می‌دهد و چرخ‌ها شروع به ناله می‌کنند.',
    climax: 'فشار دادن اهرم اصلی و درخشش ناگهانی پرتوی زرین در آسمان تاریک.',
    resolution: 'عقربه‌ها به حرکت درمی‌آیند و نخستین سپیده‌دم پس از صد سال بر شهر سرد می‌تابد.',
    targetEmotion: 'حیرت، حماسه و امید دوباره',
    isApproved: true,
  },
  visualStyleBible: {
    artStyle: 'Cinematic 35mm anamorphic film, warm golden hour tones mixed with cold teal shadows',
    renderingEngine: 'Photorealistic volumetric light rays, fine brass and dust particles',
    colorPalette: ['#0F172A', '#D97706', '#B45309', '#1E293B', '#F59E0B'],
    lighting: 'Chiaroscuro high contrast, volumetric god rays streaming through stained glass windows',
    lensType: '50mm prime f/1.4 lens with creamy circular bokeh and subtle anamorphic streak',
    depthOfField: 'Shallow depth of field focusing on weathered hands and intricate gears',
    contrast: 'Rich cinematic dynamic range, crushed blacks with radiant golden highlights',
    cinematicAtmosphere: 'Suspended in time, solemn, mysterious yet warm with timeless craftsmanship',
    textureAndGrain: 'Subtle Kodak Vision3 film grain texture',
    cameraMovementRules: 'Slow deliberate push-ins and gentle orbiting around central mechanics',
    compositionRules: 'Strict rule of thirds with leading mechanical lines guiding towards the character eye level',
  },
  characters: [
    {
      id: 'char_sohrab',
      name: 'سهراب (ساعت‌ساز)',
      role: 'نگهبان کهنه‌کار زمان',
      approxAge: '۶۸ سال',
      gender: 'مرد',
      facialFeatures: 'خطوط عمیق خرد و تجربه بر پیشانی، ریش نقره‌ای آراسته و چشمانی متمرکز با بینشی عمیق',
      faceShape: 'استخوانی و پروقار',
      eyeColor: 'قهوه‌ای روشن با رگه‌های کهربایی',
      hairStyle: 'موی خاکستری-نقره‌ای رو به عقب',
      hairColor: 'نقره‌ای',
      bodyType: 'کمی خمیده از سال‌ها کار روی میز اما با صلابت',
      skinTone: 'گندمگون مایل به آفتاب‌سوخته با چین‌وچروک‌های طبیعی',
      clothing: 'پیش‌بند چرمی کهنه با جیب‌های پر از پیچ‌گوشتی‌های ظریف و پیراهن پشمی قهوه‌ای سیر',
      shoes: 'چکمه‌های چرمی کار قهوه‌ای مات',
      accessories: 'ذره‌بین چشمی برنجی (Loupe) روی چشم راست و ساعت جیبی نقره‌ای متصل به زنجیر',
      personality: 'آرام، صبور، پر از سکوت معنادار و وفادار به پیمان زمان',
      emotionalVibe: 'حس نوستالژی، فداکاری و پایداری',
      persistentVisualRules: 'Maintain consistent facial bone structure, silver hair with loupe on right eye, worn leather artisan apron',
      referenceImages: [
        {
          id: 'ref_sohrab_1',
          viewType: 'front_full',
          label: 'نمای تمام‌رخ روبه‌رو (Front View)',
          prompt: 'Cinematic portrait of Sohrab, an old master clockmaker with silver beard, brass jeweler loupe on right eye, weathered face, intense focus, wearing leather apron, warm workshop lighting',
          status: 'idle',
        },
        {
          id: 'ref_sohrab_2',
          viewType: 'close_up',
          label: 'نمای نزدیک چهره و نگاه (Close-Up)',
          prompt: 'Macro cinematic close up on master clockmaker eyes reflecting golden gears, intense concentration, extreme skin detail and fine silver eyebrow hairs',
          status: 'idle',
        },
      ],
    },
  ],
  scenes: [
    {
      id: 'scene_1',
      sceneNumber: 1,
      title: 'برج خاموش زمان',
      location: 'بالای برج نجومی با سقف شیشه‌ای گنبدی',
      timeOfDay: 'گرگ‌ومیش ابدی و مه سرد',
      charactersPresent: ['سهراب'],
      dramaticObjective: 'نمایش سکون جهان و شروع آخرین تلاش برای روشن کردن زمان',
      summary: 'سهراب در میان چرخ‌دنده‌های خاموش قدم برمی‌دارد و آخرین قطعه از دست‌رفته را آماده می‌کند.',
      mood: 'خلوت، حماسی و رازآلود',
      durationSec: 20,
      isApproved: true,
      beats: [
        {
          id: 'beat_1_1',
          sceneId: 'scene_1',
          beatNumber: 1,
          description: 'نمای معرف عریض از برج ساعت غول‌پیکر در میان ابرهای خاکستری معلق',
          characterAction: 'سهراب در سایه چارچوب پنجره ایستاده و به آسمان مات می‌نگرد',
          facialExpression: 'متفکر، با نگاهی نگران اما مصمم',
          bodyLanguage: 'ایستاده، با دستانی لمس‌کننده اهرم بزرگ برنجی',
          environmentDetail: 'غبار معلق در پرتوهای کم‌جان نور خاکستری، عقربه‌های بی‌حرکت روی صفحه بزرگ',
          cameraAngle: 'Low-angle majestic wide shot',
          framing: 'Extreme Wide Shot',
          cameraMovement: 'Slow dramatic push-in towards the central glass dome',
          lighting: 'Moody cinematic twilight with subtle volumetric glow',
          durationSec: 5,
          needsNarration: true,
          narrationText: 'صد سال بود که نبض این جهان خوابیده بود؛ تا آنکه آخرین نگهبان، سکوت را شکست.',
          dialogue: '',
          soundFx: 'وزش باد سرد کیهانی، سکوت وهم‌انگیز، صدای مبهم تپش قلب',
          imagePrompt: 'Masterpiece cinematic wide establishing shot of a colossal vintage clocktower floating amidst misty clouds, atmospheric volumetric rays, brass mechanisms, 8k resolution, cinematic lighting',
          videoPrompt: 'Cinematic camera slowly drifting forward towards the towering clocktower while mist rolls gently between gothic pillars, hyper-realistic motion',
          imageStatus: 'idle',
          audioStatus: 'idle',
          videoStatus: 'idle',
          isApproved: true,
        },
        {
          id: 'beat_1_2',
          sceneId: 'scene_1',
          beatNumber: 2,
          description: 'نمای کلوزآپ از دستان پینه‌بسته سهراب در حال جا انداختن بلور طلایی در چرخ‌دنده اصلی',
          characterAction: 'انگشتان ظریف او بلور درخشان را با موچین‌های زرین هدایت می‌کنند',
          facialExpression: 'تمرکز بی‌نهایت، نفس حبس‌شده در سینه',
          bodyLanguage: 'دست‌ها با دقتی جراح‌گونه به جلو متمایل شده‌اند',
          environmentDetail: 'انعکاس نور طلایی بلور بر چهره و عینک ذره‌بینی او',
          cameraAngle: 'Slight high angle close-up',
          framing: 'Macro Close-Up',
          cameraMovement: 'Subtle tilt down to follow the crystal into the gear notch',
          lighting: 'Radiant golden core light illuminating weathered hands against deep dark background',
          durationSec: 5,
          needsNarration: true,
          narrationText: 'یک حرکت اشتباه، می‌توانست تمام خاطره‌های جهان را تا ابد خاکستر کند.',
          dialogue: '',
          soundFx: 'صدای کلیک مکانیکی ظریف و طنین پرتو بلورین',
          imagePrompt: 'Cinematic macro close-up of old artisan hands holding a glowing golden crystal into intricate brass gears, radiant light reflections, cinematic depth of field, 35mm photograph',
          videoPrompt: 'Delicate fingers gently locking a glowing crystal into the brass gears, sharp focus with sparkling light rays emitting as the teeth mesh',
          imageStatus: 'idle',
          audioStatus: 'idle',
          videoStatus: 'idle',
          isApproved: true,
        },
      ],
    },
    {
      id: 'scene_2',
      sceneNumber: 2,
      title: 'بیداری نبض جهان',
      location: 'مرکز موتورخانه ساعت بزرگ',
      timeOfDay: 'طلوع نخستین سپیده‌دم',
      charactersPresent: ['سهراب'],
      dramaticObjective: 'رسیدن به اوج و شروع به کار کردن دوباره چرخ‌دنده‌ها و نورافشانی خورشید',
      summary: 'با آزاد شدن قفل اصلی، عقربه‌ها شروع به گردش کرده و پرتوهای طلایی سراسر جهان را در بر می‌گیرند.',
      mood: 'پیروزمندانه، باشکوه و سرشار از حیات',
      durationSec: 20,
      isApproved: true,
      beats: [
        {
          id: 'beat_2_1',
          sceneId: 'scene_2',
          beatNumber: 1,
          description: 'چرخش پرسرعت چرخ‌دنده‌های کهکشان و بلند شدن جرقه‌های نورانی برنجی',
          characterAction: 'سهراب گامی به عقب برمی‌دارد و لبخندی آرام چهره‌اش را روشن می‌کند',
          facialExpression: 'اشک شوق و لبخندی پر از آرامش و آسودگی خیال',
          bodyLanguage: 'دست‌ها روی سینه قرار گرفته و سر به سوی آسمان بلند شده',
          environmentDetail: 'هزاران دندانه طلایی با ریتمی موزون به چرخش درآمده و غبارها تبدیل به نور شده‌اند',
          cameraAngle: 'Low-angle heroic',
          framing: 'Medium Shot with spinning background',
          cameraMovement: 'Smooth 180 degree orbit around Sohrab',
          lighting: 'Blinding golden sunrise breaking through the massive clock face',
          durationSec: 6,
          needsNarration: true,
          narrationText: 'و سرانجام، زمان دوباره آموخت که چگونه بتپد.',
          dialogue: '',
          soundFx: 'طنین ناقوس عظیم، چرخش غرورانگیز چرخ‌دنده‌ها و اوج‌گیری سمفونی ارکسترال',
          imagePrompt: 'Epic cinematic shot of master clockmaker smiling as giant luminous clock gears spin behind him, golden sunrise beaming through the giant glass clock dial, particles of light, movie still',
          videoPrompt: 'Camera orbiting the smiling artisan as gigantic gears rotate in the background and warm sunlight floods the dusty sanctuary, cinematic motion',
          imageStatus: 'idle',
          audioStatus: 'idle',
          videoStatus: 'idle',
          isApproved: true,
        },
      ],
    },
  ],
  stats: {
    generatedImagesCount: 0,
    generatedVideosCount: 0,
    generatedAudioCount: 0,
    estimatedCostUsd: 0.05,
    approxTokens: 4200,
  },
};

export function loadProjects(): FilmProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with sample project
      const initial = [SAMPLE_PROJECT];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [SAMPLE_PROJECT];
  } catch (e) {
    console.error('Failed to load projects from storage:', e);
    return [SAMPLE_PROJECT];
  }
}

export function saveProject(project: FilmProject): void {
  try {
    const projects = loadProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    project.updatedAt = new Date().toISOString();
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.unshift(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    localStorage.setItem(ACTIVE_PROJECT_KEY, project.id);
  } catch (e) {
    console.error('Failed to save project:', e);
  }
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
}

export function setActiveProjectId(id: string): void {
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

export function deleteProject(id: string): FilmProject[] {
  try {
    const projects = loadProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    if (getActiveProjectId() === id) {
      if (projects.length > 0) {
        setActiveProjectId(projects[0].id);
      } else {
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
      }
    }
    return projects;
  } catch (e) {
    console.error('Failed to delete project:', e);
    return [];
  }
}

export function createNewProject(topic: string = '', settings: Partial<ProjectSettings> = {}): FilmProject {
  const newProj: FilmProject = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: topic.trim().length > 0 ? topic.slice(0, 30) : 'پروژه جدید بدون عنوان',
    topic,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStep: 'topic',
    settings: {
      ...DEFAULT_SETTINGS,
      ...settings,
    },
    characters: [],
    scenes: [],
    stats: {
      generatedImagesCount: 0,
      generatedVideosCount: 0,
      generatedAudioCount: 0,
      estimatedCostUsd: 0,
      approxTokens: 0,
    },
  };
  saveProject(newProj);
  return newProj;
}
