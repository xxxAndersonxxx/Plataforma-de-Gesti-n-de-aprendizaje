/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Course, NavigationPath } from '../../types/lms';

interface CourseDetailViewProps {
  course: Course;
  onNavigate: (path: NavigationPath) => void;
  onStartDirectMessage?: (personName: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  onNavigate,
  onStartDirectMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'materiales' | 'tareas' | 'examenes' | 'foro'>(
    'materiales'
  );
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    'module-10': true,
    'module-9': false,
    'module-8': false,
  });
  const [searchModule, setSearchModule] = useState('');

  // Modals inside course
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState<string | null>(null);
  const [showReaderModal, setShowReaderModal] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNewForumModal, setShowNewForumModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New forum topic form state
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [forumThreadsList, setForumThreadsList] = useState(course.forumThreads || []);

  // Homework submit state
  const [submittedFile, setSubmittedFile] = useState<File | null>(null);
  const [submissionComments, setSubmissionComments] = useState('');
  const [hasSubmittedTask3, setHasSubmittedTask3] = useState(false);

  // Live session countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllAccordions = (expand: boolean) => {
    setOpenAccordions({
      'module-10': expand,
      'module-9': expand,
      'module-8': expand,
    });
  };

  const handleCreateForumTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;

    const newThread = {
      id: `forum-${Date.now()}`,
      author: 'Dra. Elena Ramos',
      authorAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD8G8gab2P9yDgzygah0GgN2yIRQG3lWWeGmIi_N_H65ikVvSFckohgsPf_g4uk4a46ercyj0zvKY_oVaI3RMFcJlZrB1oYlOpZjFSFuyhi0TccrEt1OuxZ6Ccu_L67yEAfX2E3fjUmYuwszNXaX690VVYqW1aPyCV4XyP1KzzcGrwuUGfn8Cwr69zNJTyow9PR0J7G55Al8uLMh8a-dORKO7Cvzyk8W24qRS6j5DZRzzs8lAb8RS8vvA',
      tag: 'Consulta Cátedra',
      timeAgo: 'Justo ahora',
      title: newTopicTitle,
      preview: newTopicContent,
      repliesCount: 0,
      viewsCount: 1,
      teacherReplied: true,
    };

    setForumThreadsList([newThread, ...forumThreadsList]);
    setNewTopicTitle('');
    setNewTopicContent('');
    setShowNewForumModal(false);
    showToast('Nueva discusión publicada con éxito');
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedTask3(true);
    setShowSubmitModal(false);
    showToast('¡Entrega de tarea registrada con sello de tiempo institucional!');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Dynamic Atmospheric Glow */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-secondary-fixed-dim/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Course Header Hero Card */}
        <div className="px-4 sm:px-8 pt-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-xs border border-outline-variant/20 relative overflow-hidden">
            {/* Background Course Subtle Motif */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none overflow-hidden flex items-center justify-end pr-6 hidden md:flex">
              <svg
                className="text-primary transform translate-x-12"
                fill="none"
                height="420"
                viewBox="0 0 200 200"
                width="420"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="currentColor"
                  strokeDasharray="8 8"
                  strokeWidth="4"
                ></circle>
                <rect
                  height="100"
                  rx="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  width="100"
                  x="50"
                  y="50"
                ></rect>
                <circle cx="100" cy="100" fill="currentColor" fillOpacity="0.2" r="30"></circle>
              </svg>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-primary text-on-primary text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                    {course.code}
                  </span>
                  <span className="bg-surface-container-low text-secondary text-xs px-3 py-1 rounded-full font-semibold">
                    Pregrado • Periodo 2024-II
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-on-tertiary-fixed-variant bg-tertiary-fixed/30 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed-variant"></span>
                    En Curso
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight font-bold pt-1">
                  {course.name}{' '}
                  <span className="text-secondary font-light text-xl sm:text-2xl">
                    — {course.group || 'Grupo 01'}
                  </span>
                </h1>

                <div className="flex items-center gap-4 sm:gap-6 pt-2 flex-wrap text-on-surface-variant text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-8 h-8 rounded-full object-cover shadow-xs"
                      src={course.professor.avatar}
                      alt={course.professor.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80';
                      }}
                    />
                    <span>
                      Prof.{' '}
                      <strong className="text-on-surface font-semibold">
                        {course.professor.name}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary">schedule</span>
                    <span>
                      Asesorías:{' '}
                      <strong>{course.professor.officeHours || 'Martes & Jueves 15:00 - 17:00'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary">groups</span>
                    <span>{course.studentsCount || 38} Estudiantes matriculados</span>
                  </div>
                </div>
              </div>

              {/* Academic Progress Gauge & Syllabus CTA */}
              <div className="flex lg:flex-col sm:flex-row flex-col items-start lg:items-end justify-between gap-4 min-w-[240px]">
                <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-4 w-full sm:w-auto">
                  {/* Visual SVG Progress Ring */}
                  <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-surface-container-high"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      ></path>
                      <path
                        className="text-secondary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="85, 100"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      ></path>
                    </svg>
                    <span className="absolute text-xs font-bold text-on-surface">
                      {course.progress}%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Progreso del Ciclo</p>
                    <p className="text-[11px] text-on-surface-variant">10 de 12 semanas listas</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowSyllabusModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-all shadow-xs flex-1 sm:flex-initial cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                    Descargar Sílabo (PDF)
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('Enlace al curso copiado al portapapeles');
                    }}
                    className="p-2 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                    title="Compartir enlace al curso"
                  >
                    <span className="material-symbols-outlined text-base">share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* In-Page Tab Navigation Strip */}
            <div className="mt-6 pt-1 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-outline-variant/20 pt-4">
              <button
                onClick={() => setActiveTab('materiales')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'materiales'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-base">folder_open</span>
                Materiales de Clase
              </button>

              <button
                onClick={() => setActiveTab('tareas')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'tareas'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-base">assignment</span>
                Tareas y Proyectos
                <span className="px-1.5 py-0.2 rounded-full bg-error text-on-error text-[10px] font-bold">
                  {hasSubmittedTask3 ? '0' : '1'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('examenes')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'examenes'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-base">quiz</span>
                Exámenes y Evaluaciones
              </button>

              <button
                onClick={() => setActiveTab('foro')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'foro'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-base">forum</span>
                Foro de Discusión
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Column Content Grid */}
      <div className="px-4 sm:px-8 mt-6">
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Primary Tab Contents Container (8 cols) */}
          <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* TAB 1: MATERIALES DE CLASE */}
            {activeTab === 'materiales' && (
              <div className="flex flex-col gap-4">
                {/* Search & Filter Ribbon for Modules */}
                <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base pointer-events-none">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchModule}
                      onChange={(e) => setSearchModule(e.target.value)}
                      placeholder="Filtrar temas, lecturas o diapositivas..."
                      className="w-full bg-surface-container-low pl-9 pr-3 py-2 rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => toggleAllAccordions(true)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Expandir Todo
                    </button>
                    <button
                      onClick={() => toggleAllAccordions(false)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Colapsar Todo
                    </button>
                  </div>
                </div>

                {/* Module 10: Current Active Week */}
                <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('module-10')}
                    className="w-full text-left p-4 bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center text-lg font-bold shadow-xs">
                        10
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-secondary uppercase font-semibold">
                            Semana en Curso
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            • 21 al 26 de Octubre
                          </span>
                        </div>
                        <h3 className="text-sm text-on-surface font-bold">
                          Design Systems: Tokens, Arquitectura de Componentes y Gobernanza
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-surface-container text-on-surface-variant text-[11px] font-semibold px-2.5 py-1 rounded-full hidden sm:inline-block">
                        4 Recursos
                      </span>
                      <span
                        className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                          openAccordions['module-10'] ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </button>

                  {openAccordions['module-10'] && (
                    <div className="p-4 flex flex-col gap-3">
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        En esta sesión analizamos el desacoplamiento semántico en la gestión de tokens, taxonomías de nomenclatura (Primitive, Semantic, Component) y control de versiones con Figma Tokens Studio & Style Dictionary.
                      </p>

                      {/* Resource Item: Slides */}
                      <div className="p-3 bg-surface-container-low/70 rounded-lg flex items-center justify-between hover:bg-surface-container transition-colors group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                              Sesion_10_Design_Tokens_Arquitectura.pdf
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              Diapositivas de cátedra • 48 slides • 14.8 MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setShowReaderModal('Sesion_10_Design_Tokens_Arquitectura.pdf');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-secondary text-xs font-semibold hover:bg-secondary hover:text-on-secondary transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          Descargar
                        </button>
                      </div>

                      {/* Resource Item: Video Recording */}
                      <div className="p-3 bg-surface-container-low/70 rounded-lg flex items-center justify-between hover:bg-surface-container transition-colors group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-base">videocam</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                              Grabación de Sesión Sincrónica - 22 Octubre (2h 15m)
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              Video Cloud • Full HD 1080p • Incluye marcas de tiempo de código
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowVideoModal('Sesión Sincrónica - 22 Octubre')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-sm">play_arrow</span>
                          Reproducir
                        </button>
                      </div>

                      {/* Resource Item: Reading */}
                      <div className="p-3 bg-surface-container-low/70 rounded-lg flex items-center justify-between hover:bg-surface-container transition-colors group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-base">menu_book</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                              Lectura Obligatoria: Atomic Design Reimagined (Brad Frost, 2024)
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              Capítulo 4 & 5 • Formato ePub / PDF con anotaciones
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setShowReaderModal('Atomic Design Reimagined (Brad Frost, 2024)')
                          }
                          className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-secondary text-xs font-semibold hover:bg-secondary hover:text-on-secondary transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Abrir Reader
                        </button>
                      </div>

                      {/* Resource Item: Figma Workspace Link */}
                      <div className="p-3 bg-surface-container-low/70 rounded-lg flex items-center justify-between hover:bg-surface-container transition-colors group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-base">shapes</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                              Archivo Figma UI Starter Kit - Laboratorio 10
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              Plantilla oficial con auto-layout y variantes de estado
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            showToast('Plantilla oficial de Figma duplicada en tu espacio de trabajo');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-semibold hover:bg-primary transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Duplicar en Figma
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 9: Past Week */}
                <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('module-9')}
                    className="w-full text-left p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center text-lg font-bold">
                        09
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-on-surface-variant font-semibold">
                            Semana Finalizada
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            • 14 al 19 de Octubre
                          </span>
                        </div>
                        <h3 className="text-sm text-on-surface font-semibold">
                          Microinteracciones, Motion UI y Accesibilidad WCAG 2.2 AAA
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-surface-container text-on-surface-variant text-[11px] font-semibold px-2.5 py-1 rounded-full hidden sm:inline-block">
                        2 Recursos
                      </span>
                      <span
                        className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                          openAccordions['module-9'] ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </button>

                  {openAccordions['module-9'] && (
                    <div className="p-4 flex flex-col gap-3">
                      <div className="p-3 bg-surface-container-low/70 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-error">picture_as_pdf</span>
                          <div>
                            <p className="text-xs font-semibold text-on-surface">
                              Sesion_09_Motion_Accessibility.pdf
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              32 diapositivas • 8.2 MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowReaderModal('Sesion_09_Motion_Accessibility.pdf')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-secondary text-xs font-semibold hover:bg-secondary hover:text-on-secondary transition-all shadow-xs cursor-pointer"
                        >
                          Descargar
                        </button>
                      </div>

                      <div className="p-3 bg-surface-container-low/70 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">videocam</span>
                          <div>
                            <p className="text-xs font-semibold text-on-surface">
                              Grabación Sesión 09 - Demostración de Lottie & CSS Keyframes
                            </p>
                            <p className="text-[11px] text-on-surface-variant">1h 45m de duración</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowVideoModal('Sesión 09 - Lottie & Motion')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-xs cursor-pointer"
                        >
                          Ver Video
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 8: Past Week */}
                <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('module-8')}
                    className="w-full text-left p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center text-lg font-bold">
                        08
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-on-surface-variant font-semibold">
                            Examen Parcial
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            • 07 al 12 de Octubre
                          </span>
                        </div>
                        <h3 className="text-sm text-on-surface font-semibold">
                          Sustentación de Midterm y Entrega de Prototipo Funcional
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-surface-container text-on-surface-variant text-[11px] font-semibold px-2.5 py-1 rounded-full hidden sm:inline-block">
                        1 Recurso
                      </span>
                      <span
                        className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                          openAccordions['module-8'] ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </button>

                  {openAccordions['module-8'] && (
                    <div className="p-4 flex flex-col gap-3">
                      <div className="p-3 bg-surface-container-low/70 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-error">picture_as_pdf</span>
                          <div>
                            <p className="text-xs font-semibold text-on-surface">
                              Pauta_Evaluacion_Rubrica_Midterm.pdf
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              Criterios de ponderación y rúbrica analítica
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowReaderModal('Pauta_Evaluacion_Rubrica_Midterm.pdf')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-secondary text-xs font-semibold hover:bg-secondary hover:text-on-secondary transition-all shadow-xs cursor-pointer"
                        >
                          Descargar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module 11: Upcoming Preview */}
                <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 p-4 flex items-center justify-between opacity-85">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center text-lg font-bold">
                      11
                    </div>
                    <div>
                      <span className="text-[11px] text-on-surface-variant uppercase font-medium">
                        Próxima Semana • 28 Oct - 02 Nov
                      </span>
                      <h4 className="text-sm text-on-surface font-medium">
                        Pruebas de Usabilidad con Usuarios Remotos y Telemetría Heatmap
                      </h4>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant">lock</span>
                </div>

                {/* Module 12: Upcoming Preview */}
                <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 p-4 flex items-center justify-between opacity-85">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center text-lg font-bold">
                      12
                    </div>
                    <div>
                      <span className="text-[11px] text-on-surface-variant uppercase font-medium">
                        Cierre Académico • 04 Nov - 09 Nov
                      </span>
                      <h4 className="text-sm text-on-surface font-medium">
                        Presentación del Proyecto Integrador Final ante Jurado de Industria
                      </h4>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant">lock</span>
                </div>
              </div>
            )}

            {/* TAB 2: TAREAS Y PROYECTOS */}
            {activeTab === 'tareas' && (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-xs border border-outline-variant/20 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-on-surface">
                      Entregables y Asignaciones
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Supervise el calendario de entregas, rúbricas y estados de retroalimentación.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-surface-container-low text-primary text-xs rounded-full font-semibold">
                    Total: 4 Tareas
                  </span>
                </div>

                {/* Task Item 1: Pending Submission */}
                <div className="p-4 rounded-xl bg-error-container/15 border border-error/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          hasSubmittedTask3
                            ? 'bg-tertiary-container text-on-tertiary-container'
                            : 'bg-error text-on-error'
                        }`}
                      >
                        {hasSubmittedTask3 ? 'Entregado' : '1 Pendiente'}
                      </span>
                      <span className="text-xs text-error font-semibold">
                        Vence: Viernes 25 de Octubre, 23:59 hrs
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-on-surface">
                      Tarea 3: Implementación de Design Tokens & UI Kit en Figma
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Generación de variables de color, tipografía con auto-layout y 5 componentes interactivos documentados.
                    </p>
                    <div className="flex items-center gap-4 pt-1">
                      <button
                        onClick={() => setShowReaderModal('Rúbrica_T3_Evaluacion.pdf')}
                        className="inline-flex items-center gap-1 text-xs text-secondary hover:underline cursor-pointer font-medium"
                      >
                        <span className="material-symbols-outlined text-base">description</span>{' '}
                        Rúbrica_T3_Evaluacion.pdf
                      </button>
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-1">
                    {hasSubmittedTask3 ? (
                      <div className="flex items-center gap-1.5 text-xs text-tertiary font-bold bg-tertiary-fixed/40 px-3 py-1.5 rounded-lg">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        Enviado para calificación
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary transition-all shadow-xs w-full sm:w-auto cursor-pointer"
                      >
                        Entregar Tarea
                      </button>
                    )}
                    <span className="text-[11px] text-on-surface-variant">
                      {hasSubmittedTask3 ? 'Enviado hoy' : 'Faltan 2 días, 4 horas'}
                    </span>
                  </div>
                </div>

                {/* Task Item 2: Submitted & Graded */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-tertiary-container text-on-tertiary-container text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check</span> Calificado
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Entregado el 12 de Octubre
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-on-surface">
                      Proyecto Parcial: Prototipado de Alta Fidelidad para FinTech
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Flujo completo de onboarding, autenticación biométrica y dashboard transaccional.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between gap-1">
                    <div className="text-right">
                      <span className="text-xl font-bold text-on-tertiary-container">19.5</span>
                      <span className="text-on-surface-variant text-xs"> / 20</span>
                    </div>
                    <button
                      onClick={() =>
                        alert(
                          'Retroalimentación: Excelente aplicación de la jerarquía visual y tokens semánticos. El contraste cumple holgadamente con WCAG AAA.'
                        )
                      }
                      className="px-3 py-1 bg-surface-container-lowest text-on-surface text-xs font-medium rounded hover:bg-surface-container transition-colors shadow-xs cursor-pointer"
                    >
                      Ver Comentarios
                    </button>
                  </div>
                </div>

                {/* Task Item 3: Submitted & Graded */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-tertiary-container text-on-tertiary-container text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check</span> Calificado
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Entregado el 28 de Septiembre
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-on-surface">
                      Tarea 2: Arquitectura de Información y Card Sorting Remoto
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Análisis dendrograma con Optimal Workshop y matriz de navegación jerárquica.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between gap-1">
                    <div className="text-right">
                      <span className="text-xl font-bold text-on-tertiary-container">18.0</span>
                      <span className="text-on-surface-variant text-xs"> / 20</span>
                    </div>
                    <button
                      onClick={() =>
                        alert(
                          'Retroalimentación: Muy buena síntesis metodológica. Se recomienda profundizar en la nomenclatura de subcategorías.'
                        )
                      }
                      className="px-3 py-1 bg-surface-container-lowest text-on-surface text-xs font-medium rounded hover:bg-surface-container transition-colors shadow-xs cursor-pointer"
                    >
                      Ver Comentarios
                    </button>
                  </div>
                </div>

                {/* Task Item 4: Submitted & Graded */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-tertiary-container text-on-tertiary-container text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check</span> Calificado
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Entregado el 14 de Septiembre
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-on-surface">
                      Tarea 1: User Journey Map y Benchmarking Competitivo
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Identificación de puntos de dolor (pain-points) en el sector e-commerce regional.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between gap-1">
                    <div className="text-right">
                      <span className="text-xl font-bold text-on-tertiary-container">20.0</span>
                      <span className="text-on-surface-variant text-xs"> / 20</span>
                    </div>
                    <button
                      onClick={() =>
                        alert(
                          'Retroalimentación: Trabajo impecable con análisis cuantitativo y cualitativo riguroso.'
                        )
                      }
                      className="px-3 py-1 bg-surface-container-lowest text-on-surface text-xs font-medium rounded hover:bg-surface-container transition-colors shadow-xs cursor-pointer"
                    >
                      Ver Comentarios
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EXAMENES Y EVALUACIONES */}
            {activeTab === 'examenes' && (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-xs border border-outline-variant/20 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-on-surface">
                      Evaluaciones Formales y Récord de Notas
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Ponderaciones acumuladas para la calificación final del semestre.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-on-surface-variant">Promedio Ponderado Actual</p>
                    <p className="text-xl text-secondary font-bold">
                      19.1 <span className="text-xs text-on-surface-variant">/ 20</span>
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4 rounded-l-lg">Evaluación</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Ponderación</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 rounded-r-lg text-right">Nota Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low text-xs">
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-on-surface">
                          Quiz 1: Fundamentos Heurísticos de Nielsen
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">05 Sept 2024</td>
                        <td className="py-3.5 px-4 font-medium">10%</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-semibold">
                            Completado
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-on-surface">
                          19.0 / 20
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-on-surface">
                          Quiz 2: Accesibilidad WCAG & Tipografía Escalar
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">26 Sept 2024</td>
                        <td className="py-3.5 px-4 font-medium">10%</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-semibold">
                            Completado
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-on-surface">
                          18.5 / 20
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-on-surface">
                          Examen Parcial (Midterm Teórico-Práctico)
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">10 Oct 2024</td>
                        <td className="py-3.5 px-4 font-medium">25%</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-semibold">
                            Completado
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-on-surface">
                          19.5 / 20
                        </td>
                      </tr>
                      <tr className="bg-surface-container-lowest font-medium">
                        <td className="py-3.5 px-4 font-semibold text-on-surface">
                          Quiz 3: Component Architecture & Design Tokens
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">31 Oct 2024</td>
                        <td className="py-3.5 px-4 font-medium">15%</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold">
                            Programado
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-on-surface-variant italic">
                          — Pendiente
                        </td>
                      </tr>
                      <tr className="bg-surface-container-lowest font-medium">
                        <td className="py-3.5 px-4 font-semibold text-on-surface">
                          Examen Final: Sustentación Prototipo Global
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">08 Nov 2024</td>
                        <td className="py-3.5 px-4 font-medium">40%</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                            Bloqueado
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-on-surface-variant italic">
                          — Pendiente
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: FORO DE DISCUSION */}
            {activeTab === 'foro' && (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-xs border border-outline-variant/20 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Foro General del Curso</h2>
                    <p className="text-xs text-on-surface-variant">
                      Debates académicos, resolución de dudas y colaboración entre pares.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewForumModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add_comment</span>
                    Iniciar Nueva Discusión
                  </button>
                </div>

                <div className="space-y-3">
                  {forumThreadsList.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => onNavigate('foros')}
                      className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer flex items-start gap-4"
                    >
                      <img
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        src={thread.authorAvatar}
                        alt={thread.author}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="bg-surface-container-highest text-primary text-[10px] px-2 py-0.5 rounded font-semibold">
                            {thread.tag}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            {thread.timeAgo} • Por {thread.author}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-on-surface mt-1 truncate">
                          {thread.title}
                        </h4>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                          {thread.preview}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-on-surface-variant text-[11px]">
                          <span className="flex items-center gap-1 text-secondary font-semibold">
                            <span className="material-symbols-outlined text-sm">chat_bubble</span>{' '}
                            {thread.repliesCount} Respuestas
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">visibility</span>{' '}
                            {thread.viewsCount} Visualizaciones
                          </span>
                          {thread.teacherReplied && (
                            <span className="flex items-center gap-1 text-on-tertiary-fixed-variant font-medium">
                              <span className="material-symbols-outlined text-sm">check_circle</span>{' '}
                              Docente respondió
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Contextual Desktop Sidebar Widgets (4 cols) */}
          <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Widget 1: Next Live Session with Countdown */}
            <div className="bg-primary text-on-primary rounded-xl p-5 shadow-md relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-secondary/30 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error text-on-error text-[10px] font-bold tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest animate-ping"></span>
                  En Vivo Mañana
                </span>
                <span className="text-[11px] text-inverse-primary">Google Meet HD</span>
              </div>

              <h3 className="text-sm font-bold text-on-primary relative z-10 leading-snug">
                Sesión Práctica: Taller de Design Tokens
              </h3>
              <p className="text-xs text-inverse-primary/90 mt-1 relative z-10">
                Jueves 24 de Octubre • 16:00 a 18:00 hrs
              </p>

              {/* Real-Time Visual Countdown Blocks */}
              <div className="grid grid-cols-3 gap-2 my-4 relative z-10 text-center">
                <div className="bg-primary-container/80 p-2 rounded-lg">
                  <span className="text-lg font-bold text-on-primary font-mono tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-inverse-primary">Horas</span>
                </div>
                <div className="bg-primary-container/80 p-2 rounded-lg">
                  <span className="text-lg font-bold text-on-primary font-mono tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-inverse-primary">Minutos</span>
                </div>
                <div className="bg-primary-container/80 p-2 rounded-lg">
                  <span className="text-lg font-bold text-on-primary font-mono tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-inverse-primary">Segundos</span>
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <a
                  href="https://meet.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold hover:bg-secondary transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">video_call</span>
                  Unirse a Sala de Meet
                </a>
                <div className="flex items-center justify-between text-inverse-primary text-[11px] px-1">
                  <span>
                    ID: <code className="font-mono text-on-primary">ux-402-meet</code>
                  </span>
                  <button
                    onClick={() =>
                      showToast('Sesión programada sincronizada con Google Calendar')
                    }
                    className="hover:underline text-on-primary cursor-pointer"
                  >
                    Añadir a Google Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Widget 2: Teaching Staff & Assistants */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-outline-variant/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-on-surface">Equipo de Cátedra</h3>
                <span className="text-[11px] text-on-surface-variant font-medium">3 Docentes</span>
              </div>

              {/* Professor Card */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-low">
                <img
                  className="w-10 h-10 rounded-full object-cover shadow-xs"
                  src={course.professor.avatar}
                  alt={course.professor.name}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-on-surface truncate">
                    {course.professor.name}
                  </h4>
                  <p className="text-[10px] text-primary font-semibold truncate">
                    {course.professor.title}
                  </p>
                  <p className="text-[10px] text-on-surface-variant truncate">
                    {course.professor.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onStartDirectMessage) onStartDirectMessage(course.professor.name);
                    else onNavigate('mensajes');
                  }}
                  className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                  title="Enviar Mensaje Directo"
                >
                  <span className="material-symbols-outlined text-base">mail</span>
                </button>
              </div>

              {/* Assistants */}
              {course.assistants?.map((ast) => (
                <div
                  key={ast.name}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <img
                    className="w-9 h-9 rounded-full object-cover shadow-xs"
                    src={ast.avatar}
                    alt={ast.name}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-on-surface truncate">{ast.name}</h4>
                    <p className="text-[10px] text-on-surface-variant truncate">{ast.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (onStartDirectMessage) onStartDirectMessage(ast.name);
                      else onNavigate('mensajes');
                    }}
                    className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                    title="Enviar Mensaje Directo"
                  >
                    <span className="material-symbols-outlined text-base">mail</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Widget 3: Complementary Academic Resources */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-outline-variant/20 space-y-3">
              <h3 className="text-sm font-bold text-on-surface">Enlaces Complementarios</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-primary text-base">code</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-on-surface truncate group-hover:text-secondary">
                          Repositorio GitHub del Curso
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          github.com/edupulse/cs-402-ux
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                      north_east
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://figma.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-secondary text-base">
                        palette
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-on-surface truncate group-hover:text-secondary">
                          Librería Comunitaria Figma
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          figma.com/@edupulse_ds
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                      north_east
                    </span>
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('biblioteca-virtual')}
                    className="w-full text-left p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-tertiary-container text-base">
                        menu_book
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-on-surface truncate group-hover:text-secondary">
                          Biblioteca Digital O'Reilly
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          Acceso institucional activo
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                      north_east
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Widget 4: Quick Grade Projection Card */}
            <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Rendimiento Destacado</p>
                  <p className="text-[11px] text-on-surface-variant">Top 5% del salón de clases</p>
                </div>
              </div>
              <span className="text-xl font-bold text-on-tertiary-container">A+</span>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal 1: Syllabus PDF Viewer */}
      {showSyllabusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-xl">picture_as_pdf</span>
                <span className="font-bold text-sm text-primary">
                  Sílabo Oficial 2024-II: {course.name}
                </span>
              </div>
              <button
                onClick={() => setShowSyllabusModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-on-surface leading-relaxed max-h-96 overflow-y-auto pr-2">
              <div className="bg-surface-container-low p-3 rounded-lg space-y-1">
                <p>
                  <strong>Código:</strong> {course.code} | <strong>Créditos:</strong> 4.0
                </p>
                <p>
                  <strong>Docente Titular:</strong> {course.professor.name}
                </p>
                <p>
                  <strong>Competencias:</strong> Dominio de heurísticas de usabilidad, diseño atómico, tokens semánticos, gobernanza y prototipado reactivo.
                </p>
              </div>
              <h4 className="font-bold text-primary text-sm pt-2">Sistema de Evaluación:</h4>
              <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                <li>Evaluaciones Continuas (Quizzes & Talleres): 35%</li>
                <li>Examen Parcial (Midterm Teórico-Práctico): 25%</li>
                <li>Proyecto Integrador Final ante Jurado: 40%</li>
              </ul>
              <div className="p-3 bg-secondary-fixed/30 text-on-secondary-fixed rounded-lg text-[11px]">
                El sílabo cuenta con validación digital institucional de la secretaría académica.
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => {
                  showToast('Descarga del sílabo iniciada');
                  setShowSyllabusModal(false);
                }}
                className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Guardar Archivo PDF
              </button>
              <button
                onClick={() => setShowSyllabusModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Video Player Simulator */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span className="font-bold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">play_circle</span>
                {showVideoModal}
              </span>
              <button
                onClick={() => setShowVideoModal(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center text-white">
              <div className="text-center p-6 space-y-2">
                <span className="material-symbols-outlined text-5xl text-secondary animate-pulse">
                  smart_display
                </span>
                <p className="font-semibold text-sm">Reproductor Institucional Cloud HD</p>
                <p className="text-xs text-neutral-400">
                  Transmisión protegida por credenciales de usuario ({course.code})
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant pt-2">
              <span>Resolución: 1080p 60fps • Servidor: Campus CDN</span>
              <button
                onClick={() => setShowVideoModal(null)}
                className="px-4 py-1.5 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Reader Modal */}
      {showReaderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span className="font-bold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">menu_book</span>
                Lector de Documento
              </span>
              <button
                onClick={() => setShowReaderModal(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 bg-surface-container-low rounded-lg space-y-2 text-xs text-on-surface leading-relaxed">
              <p className="font-bold text-primary">{showReaderModal}</p>
              <p>
                Este recurso académico está provisto por la Facultad para uso exclusivo de los estudiantes inscritos en el periodo 2024-II.
              </p>
              <p className="text-on-surface-variant">
                Incluye diagramas vectoriales, taxonomía de design tokens y guía metodológica de implementación en frameworks modernos (React, Tailwind CSS y Style Dictionary).
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  showToast('Documento guardado localmente');
                  setShowReaderModal(null);
                }}
                className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Descargar Copia
              </button>
              <button
                onClick={() => setShowReaderModal(null)}
                className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Submit Homework Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmitTask}
            className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div>
                <span className="font-bold text-sm text-primary block">
                  Buzón de Entrega: Tarea 3
                </span>
                <span className="text-[11px] text-error font-medium">
                  Vence: Viernes 25 de Octubre, 23:59 hrs
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-on-surface block mb-1">
                  Archivo de Entrega (ZIP, PDF o Enlace Figma):
                </label>
                <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-4 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSubmittedFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-3xl text-secondary mb-1">
                    cloud_upload
                  </span>
                  <p className="font-semibold text-on-surface">
                    {submittedFile ? submittedFile.name : 'Haz clic o arrastra tu archivo aquí'}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Formatos permitidos: .zip, .fig, .pdf (máximo 50 MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">
                  Comentarios o Enlace a Prototipo Figma:
                </label>
                <textarea
                  value={submissionComments}
                  onChange={(e) => setSubmissionComments(e.target.value)}
                  placeholder="https://www.figma.com/design/... o notas para la corrección docente"
                  rows={3}
                  className="w-full p-2.5 bg-surface-container-low rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg text-[11px] text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-secondary">verified</span>
                <span>
                  Al entregar declaras que el trabajo respeta el código de integridad académica de la Universidad.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary transition-colors shadow-xs"
              >
                Confirmar Entrega
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 5: New Forum Topic Modal */}
      {showNewForumModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <form
            onSubmit={handleCreateForumTopic}
            className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span className="font-bold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">add_comment</span>
                Nueva Discusión en el Foro
              </span>
              <button
                type="button"
                onClick={() => setShowNewForumModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-on-surface block mb-1">Título del Tema:</label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="Ej: Duda sobre variantes booleanas en Figma..."
                  className="w-full p-2.5 bg-surface-container-low rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">
                  Mensaje o Planteamiento:
                </label>
                <textarea
                  required
                  rows={4}
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                  placeholder="Escribe tu consulta o comparte tus reflexiones técnicas con los compañeros y docentes..."
                  className="w-full p-2.5 bg-surface-container-low rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowNewForumModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors shadow-xs"
              >
                Publicar Tema
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-base text-tertiary-fixed">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
