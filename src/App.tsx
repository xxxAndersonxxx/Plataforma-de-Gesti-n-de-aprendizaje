/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { CalendarView } from './components/views/CalendarView';
import { CommunicationView } from './components/views/CommunicationView';
import { CourseDetailView } from './components/views/CourseDetailView';
import { CourseSearchView } from './components/views/CourseSearchView';
import { DashboardView } from './components/views/DashboardView';
import { HelpView } from './components/views/HelpView';
import { ProfileView } from './components/views/ProfileView';
import { ResourcesView } from './components/views/ResourcesView';
import { COURSES } from './data/mockData';
import { Course, NavigationPath } from './types/lms';

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('cursos-actuales');
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES[0]);
  const [selectedSemester, setSelectedSemester] = useState<string>('Semestre 2024-II');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [preselectedChatSender, setPreselectedChatSender] = useState<string | undefined>();

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentPath('curso-detalle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (path: NavigationPath) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDirectMessage = (personName: string) => {
    setPreselectedChatSender(personName);
    setCurrentPath('mensajes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased font-sans">
      {/* Top Application Bar */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
      />

      {/* Mobile Menu Toggle Button */}
      <div className="fixed bottom-5 left-5 z-40 lg:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="w-12 h-12 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
          title="Menú de Navegación"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>

      {/* Main Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Content Viewport with Framer Motion transitions */}
      <div className="lg:pl-64">
        <main className="relative pt-16 w-full min-h-screen bg-background overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath === 'curso-detalle' ? `${currentPath}-${selectedCourse.id}` : currentPath}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* Cursos Actuales / Dashboard View */}
              {currentPath === 'cursos-actuales' && (
                <DashboardView
                  onNavigate={handleNavigate}
                  onSelectCourse={handleSelectCourse}
                />
              )}

              {/* Course Detail View */}
              {currentPath === 'curso-detalle' && (
                <CourseDetailView
                  course={selectedCourse}
                  onNavigate={handleNavigate}
                  onStartDirectMessage={handleStartDirectMessage}
                />
              )}

              {/* Cursos Anteriores */}
              {currentPath === 'cursos-anteriores' && (
                <CourseSearchView
                  initialType="past"
                  onNavigate={handleNavigate}
                  onSelectCourse={handleSelectCourse}
                />
              )}

              {/* Buscar Cursos */}
              {currentPath === 'buscar-cursos' && (
                <CourseSearchView
                  initialType="search"
                  onNavigate={handleNavigate}
                  onSelectCourse={handleSelectCourse}
                />
              )}

              {/* Calendario Views (Horario, Exámenes, Entregas, Eventos) */}
              {(currentPath === 'horario-semanal' ||
                currentPath === 'fechas-de-examenes' ||
                currentPath === 'entregas-de-tareas' ||
                currentPath === 'eventos-academicos') && (
                <CalendarView onNavigate={handleNavigate} />
              )}

              {/* Comunicación Views (Mensajes, Foros, Anuncios, Chat) */}
              {(currentPath === 'mensajes' ||
                currentPath === 'foros' ||
                currentPath === 'anuncios' ||
                currentPath === 'chat') && (
                <CommunicationView
                  onNavigate={handleNavigate}
                  preselectedSender={preselectedChatSender}
                />
              )}

              {/* Recursos Views */}
              {(currentPath === 'biblioteca-virtual' ||
                currentPath === 'videos-tutoriales' ||
                currentPath === 'enlaces-utiles' ||
                currentPath === 'descargas') && (
                <ResourcesView
                  initialTab={
                    currentPath === 'biblioteca-virtual'
                      ? 'biblioteca'
                      : currentPath === 'descargas'
                      ? 'descargas'
                      : currentPath === 'videos-tutoriales'
                      ? 'videos'
                      : 'enlaces'
                  }
                  onNavigate={handleNavigate}
                />
              )}

              {/* Perfil & Configuración Views */}
              {(currentPath === 'datos-personales' ||
                currentPath === 'calificaciones' ||
                currentPath === 'historial-academico' ||
                currentPath === 'configuracion') && (
                <ProfileView
                  initialSection={
                    currentPath === 'datos-personales'
                      ? 'perfil'
                      : currentPath === 'calificaciones'
                      ? 'calificaciones'
                      : currentPath === 'historial-academico'
                      ? 'historial'
                      : 'configuracion'
                  }
                  onNavigate={handleNavigate}
                />
              )}

              {/* Ayuda Views */}
              {(currentPath === 'preguntas-frecuentes' || currentPath === 'contacto') && (
                <HelpView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Interactive Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        onSelectCourse={handleSelectCourse}
      />
    </div>
  );
}
