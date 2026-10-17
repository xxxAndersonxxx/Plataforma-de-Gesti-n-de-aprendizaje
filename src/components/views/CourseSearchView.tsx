/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { COURSES, PAST_COURSES } from '../../data/mockData';
import { Course, NavigationPath } from '../../types/lms';

interface CourseSearchViewProps {
  initialType?: 'search' | 'past';
  onNavigate: (path: NavigationPath) => void;
  onSelectCourse: (course: Course) => void;
}

export const CourseSearchView: React.FC<CourseSearchViewProps> = ({
  initialType = 'search',
  onSelectCourse,
}) => {
  const [query, setQuery] = useState('');
  const allAvailable = [...COURSES, ...PAST_COURSES];

  const filtered = allAvailable.filter((c) => {
    if (initialType === 'past' && !c.isPast) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-16">
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-outline-variant/20">
        <div className="flex items-center gap-2 text-xs uppercase font-bold text-secondary tracking-wider mb-1">
          <span className="material-symbols-outlined text-base">
            {initialType === 'past' ? 'history_edu' : 'search'}
          </span>
          <span>{initialType === 'past' ? 'Archivo Histórico' : 'Catálogo de Asignaturas'}</span>
        </div>
        <h1 className="text-2xl text-primary font-bold tracking-tight">
          {initialType === 'past' ? 'Cursos Anteriores' : 'Buscar Cursos'}
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {initialType === 'past'
            ? 'Historial de asignaturas cursadas o dictadas en periodos previos con acceso a actas y recursos.'
            : 'Explora la malla curricular y asignaturas disponibles para la carrera.'}
        </p>

        <div className="mt-4 max-w-lg relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código, nombre o especialidad..."
            className="w-full bg-surface-container-low pl-9 pr-4 py-2 rounded-lg text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-xs hover:shadow-md transition-all p-4 space-y-3 cursor-pointer group"
          >
            <div className="relative h-28 rounded-lg overflow-hidden bg-primary-container">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-bold text-[10px] text-primary">
                {course.code}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-secondary">
                {course.category}
              </span>
              <h3 className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors mt-0.5">
                {course.name}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">{course.professor.name}</p>
            </div>
            <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">{course.term}</span>
              <span className="text-secondary font-semibold flex items-center gap-1">
                Ver Contenido
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
