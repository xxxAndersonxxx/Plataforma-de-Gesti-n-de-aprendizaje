/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  COURSES,
  CURRENT_USER,
  FACULTY_NOTICES,
  PAST_COURSES,
  QUICK_LIVE_SESSIONS,
  UPCOMING_DELIVERABLES,
} from '../../data/mockData';
import { Course, NavigationPath } from '../../types/lms';

interface DashboardViewProps {
  onNavigate: (path: NavigationPath) => void;
  onSelectCourse: (course: Course) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectCourse,
}) => {
  const [courseTab, setCourseTab] = useState<'active' | 'previous' | 'fav'>('active');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'code' | 'progress'>('recent');
  const [coursesList, setCoursesList] = useState<Course[]>(COURSES);
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  const toggleFavorite = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCoursesList((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const getFilteredCourses = () => {
    let list: Course[] = [];
    if (courseTab === 'active') {
      list = [...coursesList];
    } else if (courseTab === 'previous') {
      list = [...PAST_COURSES];
    } else {
      list = coursesList.filter((c) => c.isFavorite);
    }

    if (sortBy === 'code') {
      list.sort((a, b) => a.code.localeCompare(b.code));
    } else if (sortBy === 'progress') {
      list.sort((a, b) => b.progress - a.progress);
    }
    return list;
  };

  const displayedCourses = getFilteredCourses();

  return (
    <div className="flex flex-col w-full pb-12">
      <div className="px-4 sm:px-8 py-6 max-w-[1720px] mx-auto w-full space-y-6">
        {/* Top Welcome Executive Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-container via-primary to-primary-container p-6 sm:p-8 text-on-primary shadow-md">
          {/* Decorative background blur blobs */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-tertiary-container/30 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-inverse-primary text-xs tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
                  Semestre Académico 2024-II en Curso
                </span>
                <span className="text-inverse-primary/60 text-xs">Semana 11 de 16</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl text-on-primary tracking-tight font-bold">
                ¡Bienvenida de nuevo, Elena!
              </h1>
              <p className="text-sm text-inverse-primary/80">
                Mantienes un ritmo académico sobresaliente. Revisa tus entregas críticas para asegurar tus ponderaciones de fin de ciclo.
              </p>

              {/* Semester Progress Bar */}
              <div className="pt-2 max-w-md">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-inverse-primary font-medium">
                    Avance del Periodo Académico
                  </span>
                  <span className="text-on-primary font-semibold">
                    {CURRENT_USER.completedCyclePercent}% completado
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container-lowest/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-tertiary-fixed rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${CURRENT_USER.completedCyclePercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Fast KPI Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 xl:min-w-[460px]">
              <div className="rounded-lg bg-surface-container-lowest/10 backdrop-blur-md p-3 sm:p-4 flex flex-col justify-between hover:bg-surface-container-lowest/15 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-inverse-primary uppercase tracking-wider font-semibold">
                    Inscritos
                  </span>
                  <span className="material-symbols-outlined text-base text-inverse-primary">
                    auto_stories
                  </span>
                </div>
                <span className="font-display text-2xl sm:text-3xl font-bold text-on-primary leading-none">
                  {CURRENT_USER.activeCoursesCount}
                </span>
                <span className="text-[11px] text-inverse-primary/80 mt-1">Cursos Activos</span>
              </div>

              <div className="rounded-lg bg-surface-container-lowest/10 backdrop-blur-md p-3 sm:p-4 flex flex-col justify-between hover:bg-surface-container-lowest/15 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-amber-200 uppercase tracking-wider font-semibold">
                    Pendientes
                  </span>
                  <span className="material-symbols-outlined text-base text-amber-300">
                    notification_important
                  </span>
                </div>
                <span className="font-display text-2xl sm:text-3xl font-bold text-on-primary leading-none">
                  {CURRENT_USER.pendingTasksCount}
                </span>
                <span className="text-[11px] text-inverse-primary/80 mt-1">Esta Semana</span>
              </div>

              <div className="rounded-lg bg-surface-container-lowest/10 backdrop-blur-md p-3 sm:p-4 flex flex-col justify-between hover:bg-surface-container-lowest/15 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-tertiary-fixed uppercase tracking-wider font-semibold">
                    Promedio
                  </span>
                  <span className="material-symbols-outlined text-base text-tertiary-fixed">
                    verified
                  </span>
                </div>
                <span className="font-display text-2xl sm:text-3xl font-bold text-tertiary-fixed leading-none">
                  {CURRENT_USER.gpa}
                </span>
                <span className="text-[11px] text-inverse-primary/80 mt-1">Escala 10.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace Grid: Left Course Grid (8 cols), Right Academic Hub (4 cols) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Primary Column: Courses Navigation & Cards (8 Cols) */}
          <div className="xl:col-span-8 space-y-6">
            {/* Controls & Filter Tab Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
              <div className="flex items-center p-1 rounded-xl bg-surface-container-low shadow-xs">
                <button
                  onClick={() => setCourseTab('active')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    courseTab === 'active'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">menu_book</span>
                  Cursos Activos (4)
                </button>
                <button
                  onClick={() => setCourseTab('previous')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    courseTab === 'previous'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">history_edu</span>
                  Cursos Anteriores
                </button>
                <button
                  onClick={() => setCourseTab('fav')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    courseTab === 'fav'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">star</span>
                  Favoritos
                </button>
              </div>

              {/* Secondary Toolbar: View toggle & Sorting */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-surface-container-low rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="Vista Cuadrícula"
                  >
                    <span className="material-symbols-outlined text-base">grid_view</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="Vista Lista"
                  >
                    <span className="material-symbols-outlined text-base">view_list</span>
                  </button>
                </div>

                <div className="h-6 w-px bg-outline-variant/40 mx-1"></div>

                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-base text-secondary absolute left-2 pointer-events-none">
                    swap_vert
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="pl-7 pr-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs font-semibold rounded-lg transition-colors border-none focus:outline-none cursor-pointer"
                  >
                    <option value="recent">Ordenar: Recientes</option>
                    <option value="code">Ordenar: Código</option>
                    <option value="progress">Ordenar: Progreso</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Course Cards Container */}
            {displayedCourses.length === 0 ? (
              <div className="p-12 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">
                  folder_off
                </span>
                <p className="text-sm font-semibold text-on-surface">No se encontraron cursos</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Prueba cambiando de pestaña o restableciendo tus filtros.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => onSelectCourse(course)}
                    className="group flex flex-col justify-between rounded-xl bg-surface-container-lowest shadow-xs hover:shadow-md border border-outline-variant/20 hover:border-secondary/40 transition-all duration-200 overflow-hidden cursor-pointer"
                  >
                    <div>
                      {/* Course Visual Banner */}
                      <div className="relative h-32 w-full overflow-hidden bg-primary-container">
                        <img
                          src={course.image}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary text-[11px] font-bold">
                            {course.code}
                          </span>
                          <button
                            onClick={(e) => toggleFavorite(course.id, e)}
                            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
                              course.isFavorite
                                ? 'bg-surface-container-lowest text-amber-500'
                                : 'bg-surface-container-lowest/80 text-on-surface-variant hover:text-amber-500 hover:bg-surface-container-lowest'
                            }`}
                            title={course.isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
                          >
                            <span
                              className="material-symbols-outlined text-base"
                              style={{
                                fontVariationSettings: course.isFavorite ? "'FILL' 1" : "'FILL' 0",
                              }}
                            >
                              star
                            </span>
                          </button>
                        </div>
                        <div className="absolute bottom-1.5 left-4 right-4">
                          <span className="text-tertiary-fixed text-[11px] uppercase tracking-wider font-semibold">
                            {course.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors line-clamp-1">
                            {course.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="material-symbols-outlined text-base text-on-surface-variant">
                              person
                            </span>
                            <span className="text-xs text-on-surface-variant">
                              {course.professor.name}
                            </span>
                          </div>
                        </div>

                        {/* Deliverable/Exam Pill */}
                        {course.deliverable && (
                          <div
                            className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                              course.deliverable.type === 'urgent'
                                ? 'bg-error-container/40 text-on-error-container'
                                : course.deliverable.type === 'completed'
                                ? 'bg-surface-container-low text-tertiary-container'
                                : 'bg-surface-container text-on-surface'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base shrink-0">
                              {course.deliverable.type === 'urgent'
                                ? 'alarm'
                                : course.deliverable.type === 'completed'
                                ? 'check_circle'
                                : 'event_note'}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold truncate">
                                {course.deliverable.title}
                              </div>
                              <div className="text-[11px] opacity-80 truncate">
                                {course.deliverable.dueIn}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Progress Metric */}
                        <div className="pt-1">
                          <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                            <span>Avance curricular</span>
                            <span className="font-semibold text-on-surface">{course.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                            <div
                              className="h-full bg-secondary rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Course Card Footer: Quick Actions Bar */}
                    <div className="px-4 py-2.5 bg-surface-container-low/60 rounded-b-xl flex items-center justify-between border-t border-outline-variant/10">
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCourse(course);
                          }}
                          className="p-1.5 rounded-lg hover:bg-surface-container hover:text-secondary transition-colors"
                          title="Materiales de clase"
                        >
                          <span className="material-symbols-outlined text-base">folder_open</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCourse(course);
                          }}
                          className="p-1.5 rounded-lg hover:bg-surface-container hover:text-secondary transition-colors"
                          title="Tareas y entregables"
                        >
                          <span className="material-symbols-outlined text-base">assignment</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCourse(course);
                          }}
                          className="p-1.5 rounded-lg hover:bg-surface-container hover:text-secondary transition-colors"
                          title="Exámenes y evaluaciones"
                        >
                          <span className="material-symbols-outlined text-base">quiz</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCourse(course);
                          }}
                          className="p-1.5 rounded-lg hover:bg-surface-container hover:text-secondary transition-colors"
                          title="Foro de discusión"
                        >
                          <span className="material-symbols-outlined text-base">forum</span>
                        </button>
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs text-secondary group-hover:text-primary font-semibold transition-colors">
                        Ingresar
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {displayedCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => onSelectCourse(course)}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-secondary/40 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-surface-container text-primary text-[10px] font-bold">
                            {course.code}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            {course.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors truncate mt-0.5">
                          {course.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant truncate">
                          {course.professor.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="w-28 hidden sm:block">
                        <div className="flex justify-between text-[11px] text-on-surface-variant mb-1">
                          <span>Progreso</span>
                          <span className="font-semibold">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs text-secondary font-semibold">
                        Ingresar
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Weekly Academic Flow Timeline Mini-Widget */}
            <div className="rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                <div>
                  <h2 className="text-base font-bold text-on-surface">
                    Régimen Semanal de Sesiones en Vivo
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Sincronización de clases y laboratorios con Google Meet y Teams
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('horario-semanal')}
                  className="text-xs text-secondary hover:text-primary font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Ver Horario Completo
                  <span className="material-symbols-outlined text-sm">north_east</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {QUICK_LIVE_SESSIONS.map((sess) => (
                  <div
                    key={sess.id}
                    className={`p-3 rounded-lg flex flex-col justify-between ${
                      sess.isToday ? 'bg-surface-container-low' : 'bg-surface-container-low/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-on-surface-variant text-[11px] mb-1.5">
                        <span className="font-medium">{sess.dayTime}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            sess.isToday ? 'bg-secondary animate-pulse' : 'bg-outline-variant'
                          }`}
                        ></span>
                      </div>
                      <div className="text-sm font-semibold text-on-surface truncate">
                        {sess.title}
                      </div>
                      <div className="text-[11px] text-on-surface-variant mt-0.5">{sess.room}</div>
                    </div>

                    {sess.meetUrl ? (
                      <a
                        href={sess.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 w-full py-1.5 rounded bg-secondary text-on-secondary text-xs font-semibold hover:bg-primary transition-colors text-center shadow-xs"
                      >
                        Conectar
                      </a>
                    ) : (
                      <button
                        onClick={() => onNavigate('horario-semanal')}
                        className="mt-3 w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors cursor-pointer"
                      >
                        Ver Detalles
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Column: Academic Support & Contextual Widgets (4 Cols) */}
          <div className="xl:col-span-4 space-y-6">
            {/* Widget 1: Entregas Próximas (Urgent Deadlines) */}
            <div className="rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">
                    event_upcoming
                  </span>
                  <h2 className="text-sm font-bold text-on-surface">Entregas Próximas</h2>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                  3 Pendientes
                </span>
              </div>

              <div className="space-y-2.5 mt-2">
                {UPCOMING_DELIVERABLES.map((deliv) => (
                  <div
                    key={deliv.id}
                    onClick={() => onNavigate('entregas-de-tareas')}
                    className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                              deliv.isUrgent
                                ? 'bg-error/10 text-error'
                                : 'bg-secondary-container/20 text-secondary'
                            }`}
                          >
                            {deliv.badge}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            {deliv.code}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-on-surface group-hover:text-secondary mt-1 truncate">
                          {deliv.title}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant truncate">
                          {deliv.detail}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-bold block ${
                            deliv.isUrgent ? 'text-error' : 'text-secondary'
                          }`}
                        >
                          {deliv.dueTime}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          {deliv.dueExact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-2 border-t border-outline-variant/10">
                <button
                  onClick={() => onNavigate('horario-semanal')}
                  className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  Abrir Calendario de Entregas
                </button>
              </div>
            </div>

            {/* Widget 2: Últimos Avisos Docentes */}
            <div className="rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">campaign</span>
                  <h2 className="text-sm font-bold text-on-surface">Avisos Docentes</h2>
                </div>
                <span className="text-[11px] text-on-surface-variant">Directo del Claustro</span>
              </div>

              <div className="space-y-3 mt-2">
                {FACULTY_NOTICES.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-3 rounded-lg bg-surface-container-low space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] flex items-center justify-center font-bold">
                          {notice.instructorInitials}
                        </div>
                        <span className="text-xs font-semibold text-on-surface">
                          {notice.instructorName}
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant">{notice.timeAgo}</span>
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-2">{notice.content}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-secondary font-medium truncate">
                        {notice.courseName}
                      </span>
                      <button
                        onClick={() => setSelectedNotice(notice.content)}
                        className="text-[11px] text-primary hover:underline font-semibold cursor-pointer shrink-0 ml-2"
                      >
                        Leer más
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Acceso Rápido a Recursos Institucionales */}
            <div className="rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/20 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-on-surface">Recursos de Aprendizaje</h2>
                <span className="material-symbols-outlined text-on-surface-variant text-base">
                  public
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigate('biblioteca-virtual')}
                  className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mb-2">
                    <span className="material-symbols-outlined text-base">local_library</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block truncate">
                      Biblioteca Virtual
                    </span>
                    <span className="text-[11px] text-on-surface-variant block truncate">
                      IEEE, ACM & Springer
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('descargas')}
                  className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors mb-2">
                    <span className="material-symbols-outlined text-base">
                      download_for_offline
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block truncate">
                      Descargas & Soft
                    </span>
                    <span className="text-[11px] text-on-surface-variant block truncate">
                      Licencias JetBrains
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('videos-tutoriales')}
                  className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-tertiary-container group-hover:bg-tertiary-container group-hover:text-on-tertiary transition-colors mb-2">
                    <span className="material-symbols-outlined text-base">video_library</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block truncate">
                      Repositorio Clases
                    </span>
                    <span className="text-[11px] text-on-surface-variant block truncate">
                      Grabaciones 1080p
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('preguntas-frecuentes')}
                  className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-error group-hover:bg-error group-hover:text-on-error transition-colors mb-2">
                    <span className="material-symbols-outlined text-base">contact_support</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block truncate">
                      Mesa de Ayuda
                    </span>
                    <span className="text-[11px] text-on-surface-variant block truncate">
                      Soporte TIC 24/7
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Detail Dialog */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span className="font-bold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-secondary">campaign</span>
                Aviso Oficial del Claustro Docente
              </span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface leading-relaxed">{selectedNotice}</p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
