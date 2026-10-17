/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CURRENT_USER, NOTIFICATIONS } from '../data/mockData';
import { NavigationPath, NotificationItem } from '../types/lms';

interface HeaderProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  onOpenSearch: () => void;
  selectedSemester: string;
  onSemesterChange: (sem: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenSearch,
  selectedSemester,
  onSemesterChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(NOTIFICATIONS);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setShowNotifications(false);
    if (item.type === 'message') {
      onNavigate('mensajes');
    } else if (item.type === 'assignment') {
      onNavigate('entregas-de-tareas');
    } else if (item.type === 'grade') {
      onNavigate('calificaciones');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest border-b border-outline-variant/30 z-50 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Brand & Semester */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={() => onNavigate('cursos-actuales')}
          className="flex items-center gap-2 cursor-pointer focus:outline-none group text-left"
          title="Ir al inicio"
        >
          <img
            alt="EduPulse Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIW5fsPzARgdKqAq_3CIrX9svct90jPpQjQXUZa0cE7rvmmuMRJZqhX-b2uGiWIVfo8Tnt_iVZCm2YpepHqH9kJCkaUgjfu2mMVdrdRGTd7twenX4o0x3_xc3FJS0io1G0HVlGAYg3vXIyZTlh1UPzNieMnM_G5UKvqd0GFOF4QOuOzYiOrOK2zDpVWPM3wgwy9IT7ASycT4DBCNp1Uf2a023LJMBdmr-Oi7_eSVsNFe2QeJRaAV3kPA"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="font-display text-lg text-primary tracking-tight font-bold">
            EduPulse <span className="text-secondary font-medium text-base">LMS</span>
          </span>
        </button>

        <div className="hidden md:flex items-center bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-base mr-1.5 text-secondary">
            school
          </span>
          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-on-surface border-none focus:outline-none cursor-pointer pr-1"
          >
            <option value="Semestre 2024-II">Semestre 2024-II</option>
            <option value="Semestre 2024-I">Semestre 2024-I</option>
            <option value="Semestre 2023-II">Semestre 2023-II</option>
          </select>
        </div>
      </div>

      {/* Global Interactive Search */}
      <div className="flex-1 max-w-xl mx-2 hidden lg:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-10 px-3 flex items-center justify-between bg-surface-container-low rounded-lg text-xs text-on-surface-variant/70 border border-outline-variant/20 hover:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-on-surface-variant group-hover:text-secondary transition-colors">
              search
            </span>
            <span className="truncate">Buscar cursos, tareas, materiales o compañeros...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-outline-variant bg-surface-container-lowest rounded border border-outline-variant/30">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Quick Actions & Profile */}
      <div className="flex items-center gap-3 relative">
        <button
          onClick={onOpenSearch}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          title="Buscar"
        >
          <span className="material-symbols-outlined text-xl">search</span>
        </button>

        <button
          onClick={() => onNavigate('mensajes')}
          className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          title="Centro de Comunicación"
        >
          <span className="material-symbols-outlined text-xl">chat_bubble_outline</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            title="Notificaciones"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-error text-on-error text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-outline-variant/20 flex items-center justify-between">
                <span className="font-semibold text-sm text-primary">Notificaciones</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-secondary hover:underline cursor-pointer font-medium"
                  >
                    Marcar todo leído
                  </button>
                )}
              </div>
              <div className="divide-y divide-outline-variant/10 max-h-80 overflow-y-auto">
                {notificationsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3 ${
                      !item.read ? 'bg-surface-container-low/50' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-base">
                        {item.type === 'message'
                          ? 'chat'
                          : item.type === 'assignment'
                          ? 'assignment'
                          : 'grade'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-on-surface truncate">{item.title}</p>
                      <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                      <span className="text-[10px] text-outline mt-1 block">{item.time}</span>
                    </div>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-2"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-7 w-[1px] bg-outline-variant/30 hidden sm:block"></div>

        {/* User Profile Trigger & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1 cursor-pointer focus:outline-none group rounded-lg hover:bg-surface-container-low p-1 transition-colors"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10 group-hover:ring-secondary transition-all"
              src={CURRENT_USER.avatar}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80';
              }}
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-on-surface leading-tight">
                {CURRENT_USER.name}
              </span>
              <span className="text-[11px] text-on-surface-variant leading-tight">
                {CURRENT_USER.title}
              </span>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
              expand_more
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-outline-variant/20">
                <p className="text-xs font-bold text-primary">{CURRENT_USER.name}</p>
                <p className="text-[11px] text-on-surface-variant">{CURRENT_USER.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-semibold">
                  {CURRENT_USER.role}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('datos-personales');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base text-primary">person</span>
                  Mi Perfil Docente
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('calificaciones');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base text-primary">grade</span>
                  Calificaciones & Actas
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('configuracion');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base text-primary">settings</span>
                  Configuración
                </button>
              </div>
              <div className="border-t border-outline-variant/20 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Sesión activa de campus digital v3.4.');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-error hover:bg-error-container/20 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
