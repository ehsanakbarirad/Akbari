export type ContentType = 
  | 'narrative' 
  | 'educational' 
  | 'motivational' 
  | 'commercial' 
  | 'documentary' 
  | 'film_intro' 
  | 'fantasy' 
  | 'horror' 
  | 'emotional';

export type VisualStyle = 
  | 'cinematic_realistic' 
  | 'hyper_realism' 
  | '3d_animation' 
  | 'cartoon_anime' 
  | 'neo_noir' 
  | 'fantasy_epic' 
  | 'vintage_film';

export type VideoDuration = '30s' | '60s' | '90s' | '3m' | '5m' | 'custom';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type NarrationType = 'male' | 'female' | 'none';
export type NarrationTone = 'emotional' | 'epic' | 'documentary' | 'calm' | 'thrilling' | 'dark';
export type DetailLevel = 'short' | 'medium' | 'detailed';

export interface FilmIdea {
  id: string;
  title: string;
  genre: string;
  shortDesc: string;
  synopsis: string;
  visualAppeal: string;
  suggestedDuration: string;
  tone: string;
}

export interface ProjectSettings {
  contentType: ContentType;
  visualStyle: VisualStyle;
  duration: VideoDuration;
  aspectRatio: AspectRatio;
  language: 'fa' | 'en';
  narrationType: NarrationType;
  narrationTone: NarrationTone;
  detailLevel: DetailLevel;
  characterCount: number;
  autoMode: boolean;
}

export interface StoryArc {
  title: string;
  logline: string;
  coreMessage: string;
  synopsis: string;
  hook: string;
  intro: string;
  development: string;
  climax: string;
  resolution: string;
  targetEmotion: string;
  isApproved: boolean;
}

export interface CharacterReferenceView {
  id: string;
  viewType: 'front_full' | 'three_quarter' | 'profile' | 'close_up' | 'full_body' | 'back' | 'expression';
  label: string;
  imageUrl?: string;
  prompt: string;
  status: 'idle' | 'generating' | 'completed' | 'failed';
  error?: string;
}

export interface CharacterBible {
  id: string;
  name: string;
  role: string;
  approxAge: string;
  gender: string;
  facialFeatures: string;
  faceShape: string;
  eyeColor: string;
  hairStyle: string;
  hairColor: string;
  bodyType: string;
  skinTone: string;
  clothing: string;
  shoes: string;
  accessories: string;
  personality: string;
  emotionalVibe: string;
  persistentVisualRules: string;
  referenceImages: CharacterReferenceView[];
}

export interface VisualStyleBible {
  artStyle: string;
  renderingEngine: string;
  colorPalette: string[];
  lighting: string;
  lensType: string;
  depthOfField: string;
  contrast: string;
  cinematicAtmosphere: string;
  textureAndGrain: string;
  cameraMovementRules: string;
  compositionRules: string;
}

export interface Beat {
  id: string;
  sceneId: string;
  beatNumber: number;
  description: string;
  characterAction: string;
  facialExpression: string;
  bodyLanguage: string;
  environmentDetail: string;
  cameraAngle: string;
  framing: string;
  cameraMovement: string;
  lighting: string;
  durationSec: number;
  needsNarration: boolean;
  narrationText: string;
  dialogue?: string;
  soundFx: string;
  imagePrompt: string;
  imageUrl?: string;
  imageStatus: 'idle' | 'generating' | 'completed' | 'failed';
  imageError?: string;
  audioUrl?: string;
  audioStatus: 'idle' | 'generating' | 'completed' | 'failed';
  audioError?: string;
  videoPrompt: string;
  videoUrl?: string;
  videoStatus: 'idle' | 'generating' | 'completed' | 'failed';
  videoError?: string;
  isApproved: boolean;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  location: string;
  timeOfDay: string;
  charactersPresent: string[];
  dramaticObjective: string;
  summary: string;
  mood: string;
  durationSec: number;
  isApproved: boolean;
  beats: Beat[];
}

export interface ProjectStats {
  generatedImagesCount: number;
  generatedVideosCount: number;
  generatedAudioCount: number;
  estimatedCostUsd: number;
  approxTokens: number;
}

export interface FilmProject {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
  currentStep: 
    | 'topic' 
    | 'settings' 
    | 'story' 
    | 'scenes' 
    | 'characters' 
    | 'style' 
    | 'images' 
    | 'audio' 
    | 'video' 
    | 'final_studio';
  settings: ProjectSettings;
  story?: StoryArc;
  visualStyleBible?: VisualStyleBible;
  characters: CharacterBible[];
  scenes: Scene[];
  stats: ProjectStats;
}
