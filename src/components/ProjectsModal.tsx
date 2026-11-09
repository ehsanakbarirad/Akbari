import React from 'react';
import { FolderKanban, Plus, Trash2, Film, Clock, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';
import { FilmProject } from '../types/filmStudio';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: FilmProject[];
  currentProjectId: string | null;
  onSelectProject: (p: FilmProject) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
  onStartNewProject: () => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onDeleteProject,
  onStartNewProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">پروژه‌های سینمایی من</h2>
              <span className="text-xs text-zinc-400">
                مدیریت و بارگذاری آثار تولید شده در استودیو
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: New Project */}
        <button
          onClick={() => {
            onStartNewProject();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>شروع پروژه سینمایی جدید</span>
        </button>

        {/* Projects List */}
        <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
          {projects.length === 0 ? (
            <div className="text-center p-8 text-zinc-500 text-xs">
              پروژه‌ای یافت نشد.
            </div>
          ) : (
            projects.map((proj) => {
              const isActive = proj.id === currentProjectId;
              let imgCount = 0;
              proj.scenes?.forEach((s) => s.beats?.forEach((b) => {
                if (b.imageUrl) imgCount++;
              }));

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-sm shadow-amber-500/10'
                      : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                        {proj.settings?.contentType || 'سینمایی'}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">
                        {proj.title || 'بدون عنوان'}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-zinc-950">
                          فعال
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {proj.story?.logline || proj.topic || 'بدون لاگ‌لاین'}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-1">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-zinc-400" />
                        <span>{imgCount} تصویر</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Film className="w-3 h-3 text-zinc-400" />
                        <span>{proj.scenes?.length || 0} سکانس</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{proj.settings?.duration || '۶۰ ثانیه'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id, e);
                      }}
                      className="p-2 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-zinc-800 transition-all"
                      title="حذف پروژه"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-7 h-7 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
