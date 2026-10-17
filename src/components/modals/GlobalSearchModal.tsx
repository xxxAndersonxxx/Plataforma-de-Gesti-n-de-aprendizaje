/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { COURSES } from '../../data/mockData';
import { Course, NavigationPath } from '../../types/lms';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: NavigationPath) => void;
  onSelectCourse: (course: Course) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectCourse,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNavItems: Array<{ path: NavigationPath; label: string; icon: string }> = [
    { path: 'cursos-actuales', label: 'Cursos Actuales (Dashboard)', icon: 'menu_book' },
    { path: 'horario-semanal', label: 'Horario Semanal & Calendario', icon: 'calendar_month' },
    { path: 'mensajes', label: 'Centro de Comunicación & Mensajes', icon: 'forum' },
    { path: 'biblioteca-virtual', label: 'Biblioteca Virtual', icon: 'local_library' },
    { path: 'descargas', label: 'Software y Licencias Estudiantiles', icon: 'download' },
    { path: 'calificaciones', label: 'Calificaciones y Actas', icon: 'grade' },
  ];

  const filteredCourses = COURSES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNav = quickNavItems.filter((i) =>
    i.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 p-4 backdrop-blur-xs animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-xl max-w-xl w-full shadow-2xl border border-outline-variant/30 overflow-hidden"
      >
        <div className="p-3 border-b border-outline-variant/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-lg">search</span>
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Escribe para buscar cursos, secciones o tareas..."
            className="w-full bg-transparent text-sm text-on-surface focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-outline-variant bg-surface-container rounded border border-outline-variant/30">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Courses */}
          {filteredCourses.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant px-2 block mb-1">
                Cursos
              </span>
              <div className="space-y-0.5">
                {filteredCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCourse(c);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-surface-container text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-surface-container text-primary font-bold text-[10px]">
                        {c.code}
                      </span>
                      <span className="font-semibold text-on-surface">{c.name}</span>
                    </div>
                    <span className="text-secondary text-[11px] font-semibold">Ir al curso →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nav Items */}
          {filteredNav.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant px-2 block mb-1">
                Navegación Rápida
              </span>
              <div className="space-y-0.5">
                {filteredNav.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-surface-container text-xs flex items-center gap-2.5 transition-colors cursor-pointer text-on-surface"
                  >
                    <span className="material-symbols-outlined text-base text-primary">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
