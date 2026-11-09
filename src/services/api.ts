import { FilmIdea, ProjectSettings, StoryArc, Scene, CharacterBible, VisualStyleBible } from '../types/filmStudio';

export async function fetchFilmIdeas(topic?: string, genre?: string): Promise<FilmIdea[]> {
  const response = await fetch('/api/film/generate-ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, genre }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'خطا در تولید ایده‌های سینمایی');
  }
  return data.ideas || [];
}

export async function generateStoryArc(
  topic: string,
  settings: ProjectSettings,
  modificationAction?: 'rewrite' | 'change_ending' | 'punchier' | 'shorten',
  existingStory?: StoryArc
): Promise<StoryArc> {
  const response = await fetch('/api/film/generate-story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, settings, modificationAction, existingStory }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'خطا در نگارش فیلمنامه و داستان');
  }
  return data.story;
}

export async function generateScenesAndBeats(
  story: StoryArc,
  settings: ProjectSettings
): Promise<Scene[]> {
  const response = await fetch('/api/film/generate-scenes-and-beats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ story, settings }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'خطا در سکانس‌بندی و بیت‌ها');
  }
  return data.scenes || [];
}

export async function generateCharactersAndBible(
  story: StoryArc,
  settings: ProjectSettings,
  scenes: Scene[]
): Promise<{ characters: CharacterBible[]; visualStyleBible: VisualStyleBible }> {
  const response = await fetch('/api/film/generate-characters-and-bible', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ story, settings, scenes }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'خطا در ساخت پرونده شخصیت‌ها و سبک بصری');
  }
  return {
    characters: data.data.characters || [],
    visualStyleBible: data.data.visualStyleBible,
  };
}

export async function generateImageFromPrompt(
  prompt: string,
  aspectRatio: string = '16:9',
  referenceImageBase64?: string
): Promise<string> {
  const response = await fetch('/api/film/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspectRatio, referenceImageBase64 }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'خطا در تولید تصویر با هوش مصنوعی');
  }
  return data.imageUrl;
}

export async function generateVoiceoverAudio(
  text: string,
  tone: string = 'emotional',
  gender: string = 'male',
  language: string = 'fa'
): Promise<string> {
  const response = await fetch('/api/film/generate-voiceover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, tone, gender, language }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'خطا در ساخت صدای نریشن');
  }
  return data.audioUrl;
}

export async function generateVideoClip(
  imageBase64: string,
  videoPrompt: string,
  aspectRatio: string = '16:9'
): Promise<string> {
  const response = await fetch('/api/film/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, videoPrompt, aspectRatio }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'خطا در تولید ویدیو با Google Veo');
  }
  return data.videoUrl;
}
