/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationPath } from '../types/lms';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavSection {
  title: string;
  icon: string;
  items: Array<{
    path: NavigationPath;
    label: string;
    badge?: string;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const sections: NavSection[] = [
    {
      title: 'Mis Cursos',
      icon: 'menu_book',
      items: [
        { path: 'cursos-actuales', label: 'Cursos Actuales' },
        { path: 'cursos-anteriores', label: 'Cursos Anteriores' },
        { path: 'buscar-cursos', label: 'Buscar Cursos' },
      ],
    },
    {
      title: 'Calendario',
      icon: 'calendar_month',
      items: [
        { path: 'horario-semanal', label: 'Horario Semanal' },
        { path: 'fechas-de-examenes', label: 'Fechas de Exámenes' },
        { path: 'entregas-de-tareas', label: 'Entregas de Tareas' },
        { path: 'eventos-academicos', label: 'Eventos Académicos' },
      ],
    },
    {
      title: 'Comunicación',
      icon: 'forum',
      items: [
        { path: 'mensajes', label: 'Mensajes' },
        { path: 'foros', label: 'Foros' },
        { path: 'anuncios', label: 'Anuncios' },
        { path: 'chat', label: 'Chat' },
      ],
    },
    {
      title: 'Recursos',
      icon: 'local_library',
      items: [
        { path: 'biblioteca-virtual', label: 'Biblioteca Virtual' },
        { path: 'videos-tutoriales', label: 'Videos Tutoriales' },
        { path: 'enlaces-utiles', label: 'Enlaces Útiles' },
        { path: 'descargas', label: 'Descargas' },
      ],
    },
    {
      title: 'Mi Perfil',
      icon: 'account_circle',
      items: [
        { path: 'datos-personales', label: 'Datos Personales' },
        { path: 'calificaciones', label: 'Calificaciones' },
        { path: 'historial-academico', label: 'Historial Académico' },
        { path: 'configuracion', label: 'Configuración' },
      ],
    },
    {
      title: 'Ayuda',
      icon: 'help_outline',
      items: [
        { path: 'preguntas-frecuentes', label: 'Preguntas Frecuentes' },
        { path: 'contacto', label: 'Contacto' },
      ],
    },
  ];

  const isItemActive = (itemPath: NavigationPath) => {
    if (currentPath === itemPath) return true;
    if (currentPath === 'curso-detalle' && itemPath === 'cursos-actuales') return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs animate-in fade-in"
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant/30 z-40 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="py-4">
          <div className="px-4 pb-2 text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
            Navegación Académica
          </div>

          <nav className="space-y-1 px-2">
            {sections.map((section) => (
              <div key={section.title} className="space-y-0.5 pt-1">
                <div className="flex items-center px-2 py-1.5 text-on-surface text-xs font-semibold">
                  <span className="material-symbols-outlined mr-2 text-primary text-base">
                    {section.icon}
                  </span>
                  {section.title}
                </div>

                <div className="pl-7 space-y-0.5">
                  {section.items.map((item) => {
                    const active = isItemActive(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          onNavigate(item.path);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full text-left block px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          active
                            ? 'bg-surface-container text-primary font-semibold shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-normal'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer info badge */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
            <span>Campus Digital v3.4</span>
            <span
              className="material-symbols-outlined text-base text-tertiary-container"
              title="Sistema Verificado"
            >
              verified
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
