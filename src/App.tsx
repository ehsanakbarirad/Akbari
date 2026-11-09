import React, { useState, useEffect } from 'react';
import { FilmProject, ProjectSettings, StoryArc, Scene, CharacterBible, VisualStyleBible, FilmIdea } from './types/filmStudio';
import { loadProjects, saveProject, deleteProject, createNewProject, getActiveProjectId, setActiveProjectId, DEFAULT_SETTINGS } from './services/storage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { Step1Topic } from './components/Step1Topic';
import { Step2Settings } from './components/Step2Settings';
import { Step3Story } from './components/Step3Story';
import { Step4ScenesAndBeats } from './components/Step4ScenesAndBeats';
import { Step5Characters } from './components/Step5Characters';
import { Step6VisualStyle } from './components/Step6VisualStyle';
import { Step7BeatImages } from './components/Step7BeatImages';
import { Step8Voiceover } from './components/Step8Voiceover';
import { Step9Video } from './components/Step9Video';
import { Step11FinalStudio } from './components/Step11FinalStudio';
import { AutoPilotModal } from './components/Step10AutoPilotModal';
import { ProjectsModal } from './components/ProjectsModal';

export default function App() {
  const [projects, setProjects] = useState<FilmProject[]>([]);
  const [activeProjectId, setActiveId] = useState<string | null>(null);
  const [isHomeDashboard, setIsHomeDashboard] = useState<boolean>(true);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isAutoPilotModalOpen, setIsAutoPilotModalOpen] = useState(false);

  // Initialize projects on mount
  useEffect(() => {
    const loaded = loadProjects();
    setProjects(loaded);
    const storedActiveId = getActiveProjectId();
    if (storedActiveId && loaded.some((p) => p.id === storedActiveId)) {
      setActiveId(storedActiveId);
    } else if (loaded.length > 0) {
      setActiveId(loaded[0].id);
      setActiveProjectId(loaded[0].id);
    }
  }, []);

  const currentProject = projects.find((p) => p.id === activeProjectId) || null;

  const handleUpdateCurrentProject = (updated: FilmProject) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    saveProject(updated);
  };

  const handleStartNewProject = () => {
    const newProj = createNewProject('', DEFAULT_SETTINGS);
    setProjects((prev) => [newProj, ...prev]);
    setActiveId(newProj.id);
    setIsHomeDashboard(false);
  };

  const handleOpenProject = (p: FilmProject) => {
    setActiveId(p.id);
    setActiveProjectId(p.id);
    setIsHomeDashboard(false);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('آیا از حذف این پروژه سینمایی اطمینان دارید؟')) {
      const remaining = deleteProject(id);
      setProjects(remaining);
      if (activeProjectId === id) {
        if (remaining.length > 0) {
          setActiveId(remaining[0].id);
        } else {
          setActiveId(null);
          setIsHomeDashboard(true);
        }
      }
    }
  };

  const handleSelectStep = (step: FilmProject['currentStep']) => {
    if (!currentProject) return;
    const updated = { ...currentProject, currentStep: step };
    handleUpdateCurrentProject(updated);
    setIsHomeDashboard(false);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Cinematic Studio Navbar */}
      <Navbar
        currentProject={isHomeDashboard ? null : currentProject}
        onOpenProjects={() => setIsProjectsModalOpen(true)}
        onOpenAutoPilot={() => setIsAutoPilotModalOpen(true)}
        onSelectStep={handleSelectStep}
        onGoHome={() => setIsHomeDashboard(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {isHomeDashboard || !currentProject ? (
          <DashboardView
            projects={projects}
            onStartNewProject={handleStartNewProject}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onOpenCharactersTab={() => {
              if (currentProject) handleSelectStep('characters');
              else handleStartNewProject();
            }}
            onOpenImagesTab={() => {
              if (currentProject) handleSelectStep('images');
              else handleStartNewProject();
            }}
            onOpenSettingsTab={() => {
              if (currentProject) handleSelectStep('settings');
              else handleStartNewProject();
            }}
          />
        ) : (
          <div className="animate-fadeIn">
            {/* Step 1: Topic */}
            {currentProject.currentStep === 'topic' && (
              <Step1Topic
                initialTopic={currentProject.topic}
                onTopicSelected={(topic, suggestedIdea) => {
                  const updated: FilmProject = {
                    ...currentProject,
                    topic,
                    title: suggestedIdea ? suggestedIdea.title : topic.slice(0, 30),
                    currentStep: 'settings',
                  };
                  handleUpdateCurrentProject(updated);
                }}
                onBackToDashboard={() => setIsHomeDashboard(true)}
              />
            )}

            {/* Step 2: Settings */}
            {currentProject.currentStep === 'settings' && (
              <Step2Settings
                topic={currentProject.topic}
                settings={currentProject.settings}
                onUpdateSettings={(settings: ProjectSettings) => {
                  handleUpdateCurrentProject({
                    ...currentProject,
                    settings,
                  });
                }}
                onProceedToStory={() => {
                  handleSelectStep('story');
                }}
              />
            )}

            {/* Step 3: Story */}
            {currentProject.currentStep === 'story' && (
              <Step3Story
                topic={currentProject.topic}
                settings={currentProject.settings}
                story={currentProject.story}
                onUpdateStory={(story: StoryArc) => {
                  handleUpdateCurrentProject({
                    ...currentProject,
                    title: story.title || currentProject.title,
                    story,
                  });
                }}
                onProceedToScenes={() => {
                  handleSelectStep('scenes');
                }}
              />
            )}

            {/* Step 4: Scenes & Beats */}
            {currentProject.currentStep === 'scenes' && currentProject.story && (
              <Step4ScenesAndBeats
                story={currentProject.story}
                settings={currentProject.settings}
                scenes={currentProject.scenes}
                onUpdateScenes={(scenes: Scene[]) => {
                  handleUpdateCurrentProject({
                    ...currentProject,
                    scenes,
                  });
                }}
                onProceedToCharacters={() => {
                  handleSelectStep('characters');
                }}
              />
            )}

            {/* Step 5: Characters */}
            {currentProject.currentStep === 'characters' && currentProject.story && (
              <Step5Characters
                story={currentProject.story}
                settings={currentProject.settings}
                scenes={currentProject.scenes}
                characters={currentProject.characters}
                visualStyleBible={currentProject.visualStyleBible}
                onUpdateCharacters={(characters: CharacterBible[]) => {
                  handleUpdateCurrentProject({
                    ...currentProject,
                    characters,
                  });
                }}
                onUpdateStyleBible={(visualStyleBible: VisualStyleBible) => {
                  handleUpdateCurrentProject({
                    ...currentProject,
                    visualStyleBible,
                  });
                }}
                onProceedToStyle={() => {
                  handleSelectStep('style');
                }}
              />
            )}

            {/* Step 6: Visual Style */}
            {currentProject.currentStep === 'style' && (
              <Step6VisualStyle
                styleBible={currentProject.visualStyleBible}
                onUpdateStyleBible={(visualStyleBible: VisualStyleBible) => {
                  handleUpdateCurrentProject({
                    ...currentProject,
                    visualStyleBible,
                  });
                }}
                onProceedToBeatImages={() => {
                  handleSelectStep('images');
                }}
              />
            )}

            {/* Step 7: Beat Images */}
            {currentProject.currentStep === 'images' && (
              <Step7BeatImages
                settings={currentProject.settings}
                scenes={currentProject.scenes}
                characters={currentProject.characters}
                visualStyleBible={currentProject.visualStyleBible}
                onUpdateScenes={(scenes: Scene[]) => {
                  handleUpdateCurrentProject({
                    ...currentProject,
                    scenes,
                  });
                }}
                onProceedToVoiceover={() => {
                  handleSelectStep('audio');
                }}
              />
            )}

            {/* Step 8: Voiceover */}
            {currentProject.currentStep === 'audio' && (
              <Step8Voiceover
                settings={currentProject.settings}
                scenes={currentProject.scenes}
                onUpdateScenes={(scenes: Scene[]) => {
                  handleUpdateCurrentProject({
                    ...currentProject,
                    scenes,
                  });
                }}
                onProceedToVideo={() => {
                  handleSelectStep('video');
                }}
              />
            )}

            {/* Step 9: Video Generation */}
            {currentProject.currentStep === 'video' && (
              <Step9Video
                settings={currentProject.settings}
                scenes={currentProject.scenes}
                onUpdateScenes={(scenes: Scene[]) => {
                  handleUpdateCurrentProject({
                    ...currentProject,
                    scenes,
                  });
                }}
                onProceedToFinalStudio={() => {
                  handleSelectStep('final_studio');
                }}
              />
            )}

            {/* Step 11: Final Studio */}
            {currentProject.currentStep === 'final_studio' && (
              <Step11FinalStudio
                project={currentProject}
                onUpdateProject={handleUpdateCurrentProject}
                onGoBackToStep={handleSelectStep}
              />
            )}
          </div>
        )}
      </main>

      {/* Projects Modal */}
      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        projects={projects}
        currentProjectId={activeProjectId}
        onSelectProject={(p) => {
          setActiveId(p.id);
          setActiveProjectId(p.id);
          setIsHomeDashboard(false);
        }}
        onDeleteProject={handleDeleteProject}
        onStartNewProject={handleStartNewProject}
      />

      {/* Auto-Pilot Modal */}
      {currentProject && (
        <AutoPilotModal
          project={currentProject}
          isOpen={isAutoPilotModalOpen}
          onClose={() => setIsAutoPilotModalOpen(false)}
          onUpdateProject={handleUpdateCurrentProject}
        />
      )}
    </div>
  );
}
