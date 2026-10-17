/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CALENDAR_EVENTS } from '../../data/mockData';
import { CalendarEvent, NavigationPath } from '../../types/lms';

interface CalendarViewProps {
  onNavigate: (path: NavigationPath) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'semana' | 'mes' | 'agenda'>('semana');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCubicleModal, setShowCubicleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter checkboxes
  const [filters, setFilters] = useState({
    classes: true,
    tasks: true,
    exams: true,
    events: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const resetFilters = () => {
    setFilters({
      classes: true,
      tasks: true,
      exams: true,
      events: true,
    });
  };

  const isEventVisible = (evt: CalendarEvent) => {
    if (evt.category === 'class' && !filters.classes) return false;
    if (evt.category === 'tutoring' && !filters.classes) return false;
    if (evt.category === 'task' && !filters.tasks) return false;
    if (evt.category === 'exam' && !filters.exams) return false;
    if (evt.category === 'event' && !filters.events) return false;
    return true;
  };

  const filteredEvents = CALENDAR_EVENTS.filter(isEventVisible);

  const getEventsForDay = (day: string) => {
    return filteredEvents.filter((e) => e.day === day);
  };

  const handleDownloadICal = () => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EduPulse//Campus LMS//ES\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:EduPulse Horario 2024-II\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EduPulse_Horario_Semana08.ics';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archivo .iCal descargado con éxito');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="p-4 sm:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Header Ribbon */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/20 p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  calendar_month
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
                  <span>Semestre 2024-II</span>
                  <span>•</span>
                  <span className="text-secondary">Semana Lectiva 08</span>
                </div>
                <h1 className="text-xl sm:text-2xl text-primary font-bold tracking-tight">
                  Calendario Académico
                </h1>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl shadow-inner gap-1">
              <button
                onClick={() => setViewMode('semana')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'semana'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">view_week</span>
                Semana
              </button>
              <button
                onClick={() => setViewMode('mes')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'mes'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">calendar_view_month</span>
                Mes
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'agenda'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">view_agenda</span>
                Agenda / Lista
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-xl">
              <button
                onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                title="Semana anterior"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <span className="px-2 text-xs font-semibold text-primary whitespace-nowrap">
                {currentWeekOffset === 0
                  ? '21 - 26 Octubre, 2024'
                  : currentWeekOffset > 0
                  ? '28 Oct - 02 Nov, 2024'
                  : '14 - 19 Octubre, 2024'}
              </span>
              <button
                onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                title="Semana siguiente"
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
              <button
                onClick={() => setCurrentWeekOffset(0)}
                className="ml-1 px-2.5 py-1 text-on-primary-fixed-variant bg-surface-container text-xs rounded-md hover:bg-primary-fixed transition-colors font-semibold cursor-pointer"
              >
                Hoy
              </button>
            </div>

            <button
              onClick={() => showToast('Calendario sincronizado con Google Calendar & Outlook')}
              className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-xs font-semibold flex items-center gap-2 hover:bg-primary-container shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">sync</span>
              <span>Sincronizar con Google / Outlook</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest px-6 py-3 rounded-xl shadow-xs border border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-base text-secondary">tune</span>
            <span>Categorías del Periodo:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilters((f) => ({ ...f, classes: !f.classes }))}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                filters.classes
                  ? 'bg-surface-container-low text-on-surface'
                  : 'bg-surface-container-low/40 text-on-surface-variant/50 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-xs"></span>
              <span>Clases y Horario Semanal</span>
              <span className="text-[10px] text-on-surface-variant bg-surface-container-lowest px-1.5 py-0.2 rounded-full ml-1">
                16h
              </span>
            </button>

            <button
              onClick={() => setFilters((f) => ({ ...f, tasks: !f.tasks }))}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                filters.tasks
                  ? 'bg-amber-50 text-amber-900'
                  : 'bg-amber-50/40 text-amber-900/40 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs"></span>
              <span>Entregas de Tareas</span>
              <span className="text-[10px] text-amber-800 bg-white px-1.5 py-0.2 rounded-full ml-1 font-bold">
                3 pend.
              </span>
            </button>

            <button
              onClick={() => setFilters((f) => ({ ...f, exams: !f.exams }))}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                filters.exams
                  ? 'bg-error-container/60 text-on-error-container'
                  : 'bg-error-container/20 text-on-error-container/40 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-error shadow-xs"></span>
              <span>Fechas de Exámenes</span>
              <span className="text-[10px] text-on-error bg-error px-1.5 py-0.2 rounded-full ml-1 font-bold">
                2 crit.
              </span>
            </button>

            <button
              onClick={() => setFilters((f) => ({ ...f, events: !f.events }))}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                filters.events
                  ? 'bg-surface-container-high text-on-tertiary-container'
                  : 'bg-surface-container-high/40 text-on-tertiary-container/40 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container shadow-xs"></span>
              <span>Eventos y Conferencias</span>
              <span className="text-[10px] text-on-surface-variant bg-surface-container-lowest px-1.5 py-0.2 rounded-full ml-1">
                1 mag.
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1 text-on-surface-variant text-[11px]">
            <span className="material-symbols-outlined text-sm text-secondary">info</span>
            <span>Zona horaria: GMT-5 (Lima/Bogotá)</span>
          </div>
        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Calendar View Area (9 Cols) */}
          <div className="xl:col-span-9 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 overflow-hidden flex flex-col">
            {viewMode === 'semana' && (
              <>
                {/* Day Columns Header */}
                <div className="grid grid-cols-7 bg-surface-container-low text-center text-xs font-semibold text-on-surface-variant py-2 border-b border-outline-variant/20">
                  <div className="col-span-1 flex items-center justify-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>Hora</span>
                  </div>
                  <div className="col-span-1 flex flex-col py-1">
                    <span className="text-on-surface-variant">LUN</span>
                    <span className="text-lg font-bold text-on-surface">21</span>
                  </div>
                  <div className="col-span-1 flex flex-col py-1">
                    <span className="text-on-surface-variant">MAR</span>
                    <span className="text-lg font-bold text-on-surface">22</span>
                  </div>
                  <div className="col-span-1 flex flex-col py-1 bg-surface-container rounded-lg">
                    <span className="text-secondary font-bold">MIÉ</span>
                    <span className="text-lg font-bold text-secondary">23</span>
                    <span className="text-[10px] text-secondary uppercase font-bold">Hoy</span>
                  </div>
                  <div className="col-span-1 flex flex-col py-1">
                    <span className="text-on-surface-variant">JUE</span>
                    <span className="text-lg font-bold text-on-surface">24</span>
                  </div>
                  <div className="col-span-1 flex flex-col py-1">
                    <span className="text-on-surface-variant">VIE</span>
                    <span className="text-lg font-bold text-on-surface">25</span>
                  </div>
                  <div className="col-span-1 flex flex-col py-1 bg-surface-container-low/50">
                    <span className="text-on-surface-variant font-medium">SÁB</span>
                    <span className="text-lg font-bold text-on-surface-variant">26</span>
                  </div>
                </div>

                {/* Calendar Schedule Grid with Time Axis */}
                <div className="relative grid grid-cols-7 min-h-[720px] bg-surface-container-lowest divide-x divide-outline-variant/10">
                  {/* Time Axis Column */}
                  <div className="col-span-1 flex flex-col text-right pr-3 py-2 text-[11px] text-on-surface-variant select-none space-y-16">
                    <div className="h-8">07:00 AM</div>
                    <div className="h-8">09:00 AM</div>
                    <div className="h-8">11:00 AM</div>
                    <div className="h-8:00">01:00 PM</div>
                    <div className="h-8">03:00 PM</div>
                    <div className="h-8">05:00 PM</div>
                    <div className="h-8">07:00 PM</div>
                    <div className="h-8">09:00 PM</div>
                  </div>

                  {/* LUN 21 */}
                  <div className="col-span-1 relative p-2 space-y-3 bg-surface/30">
                    {getEventsForDay('LUN').map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                          evt.category === 'class'
                            ? evt.badgeLabel === 'Clase Teórica'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container text-on-surface mt-10'
                            : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                              evt.badgeLabel === 'Clase Teórica'
                                ? 'bg-white/20 text-white'
                                : 'bg-secondary/10 text-secondary'
                            }`}
                          >
                            {evt.badgeLabel}
                          </span>
                          <span className="material-symbols-outlined text-sm opacity-80">
                            {evt.badgeLabel === 'Clase Teórica' ? 'videocam' : 'devices'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold mt-1 leading-snug truncate">{evt.title}</h4>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            evt.badgeLabel === 'Clase Teórica'
                              ? 'text-primary-fixed'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {evt.timeStart} - {evt.timeEnd} • {evt.location}
                        </p>
                        {evt.instructor && (
                          <div className="mt-2 flex items-center gap-1.5 pt-1.5 bg-black/10 -mx-3 -mb-3 px-3 py-1 rounded-b-xl text-[10px]">
                            {evt.instructorAvatar && (
                              <img
                                className="w-4 h-4 rounded-full object-cover"
                                src={evt.instructorAvatar}
                                alt={evt.instructor}
                              />
                            )}
                            <span className="truncate">{evt.instructor}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* MAR 22 */}
                  <div className="col-span-1 relative p-2 space-y-3">
                    {getEventsForDay('MAR').map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                          evt.category === 'task'
                            ? 'bg-amber-500 text-white mt-8'
                            : 'bg-secondary text-on-secondary mt-16'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold tracking-wider bg-black/20 px-1.5 py-0.2 rounded text-white">
                            {evt.badgeLabel}
                          </span>
                          <span className="material-symbols-outlined text-sm">
                            {evt.category === 'task' ? 'assignment_turned_in' : 'groups'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold mt-1 leading-snug">{evt.title}</h4>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            evt.category === 'task' ? 'text-amber-100' : 'text-secondary-fixed'
                          }`}
                        >
                          {evt.details || `${evt.timeStart} - ${evt.timeEnd} • ${evt.location}`}
                        </p>
                        {evt.weight && (
                          <div className="mt-2 bg-amber-600/60 rounded px-1.5 py-0.5 text-[10px] flex items-center justify-between">
                            <span>Ponderación: {evt.weight}</span>
                            <span className="font-bold">PDF Obligatorio</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* MIÉ 23 (Hoy) with active red line indicator! */}
                  <div className="col-span-1 relative p-2 space-y-3 bg-surface-container-low/40">
                    {/* Real-time Indicator Line at 11:15 */}
                    <div className="absolute top-44 left-0 right-0 z-20 flex items-center pointer-events-none">
                      <span className="w-2.5 h-2.5 rounded-full bg-error -ml-1.5 shadow-sm"></span>
                      <div className="h-[2px] w-full bg-error"></div>
                      <span className="text-[9px] font-bold bg-error text-on-error px-1 rounded-xs -mr-1 shadow-sm">
                        11:15
                      </span>
                    </div>

                    {getEventsForDay('MIÉ').map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                          evt.category === 'class'
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-error text-on-error shadow-sm mt-24'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold tracking-wider bg-white/20 px-1.5 py-0.2 rounded text-white">
                            {evt.badgeLabel}
                          </span>
                          <span className="material-symbols-outlined text-sm">
                            {evt.category === 'class' ? 'record_voice_over' : 'emergency'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold mt-1 leading-snug">{evt.title}</h4>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            evt.category === 'class' ? 'text-secondary-fixed' : 'text-error-container'
                          }`}
                        >
                          {evt.timeStart} - {evt.timeEnd} • {evt.location}
                        </p>
                        {evt.tolerance && (
                          <div className="mt-2 bg-error-container text-on-error-container rounded px-1.5 py-1 text-[10px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">lock_clock</span>
                            <span>{evt.details}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* JUE 24 */}
                  <div className="col-span-1 relative p-2 space-y-3">
                    {getEventsForDay('JUE').map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                          evt.category === 'tutoring'
                            ? 'bg-surface-container text-on-surface mt-4'
                            : 'bg-tertiary-container text-on-tertiary mt-20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                              evt.category === 'tutoring'
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-white/20 text-white'
                            }`}
                          >
                            {evt.badgeLabel}
                          </span>
                          <span className="material-symbols-outlined text-sm">
                            {evt.category === 'tutoring' ? 'support_agent' : 'workspace_premium'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold mt-1 leading-snug">{evt.title}</h4>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            evt.category === 'tutoring'
                              ? 'text-on-surface-variant'
                              : 'text-tertiary-fixed'
                          }`}
                        >
                          {evt.timeStart} - {evt.timeEnd} • {evt.location}
                        </p>
                        {evt.credits && (
                          <div className="mt-2 text-[10px] text-tertiary-fixed-dim flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-xs">military_tech</span>
                            <span>{evt.credits}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* VIE 25 */}
                  <div className="col-span-1 relative p-2 space-y-3 bg-surface/30">
                    {getEventsForDay('VIE').map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                          evt.category === 'task'
                            ? 'bg-amber-500 text-white mt-6'
                            : 'bg-error text-on-error mt-12'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold tracking-wider bg-black/20 px-1.5 py-0.2 rounded text-white">
                            {evt.badgeLabel}
                          </span>
                          <span className="material-symbols-outlined text-sm">
                            {evt.category === 'task' ? 'upload_file' : 'quiz'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold mt-1 leading-snug">{evt.title}</h4>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            evt.category === 'task' ? 'text-amber-100' : 'text-error-container'
                          }`}
                        >
                          {evt.timeStart} - {evt.timeEnd} • {evt.location}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* SÁB 26 */}
                  <div className="col-span-1 relative p-2 space-y-3 bg-surface-container-low/20">
                    {getEventsForDay('SÁB').map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className="rounded-xl p-3 bg-surface-container-high text-on-surface shadow-xs hover:shadow-md transition-all cursor-pointer mt-8"
                      >
                        <div className="flex items-center justify-between text-on-surface-variant">
                          <span className="text-[9px] uppercase font-bold bg-surface-container-lowest px-1.5 py-0.2 rounded">
                            {evt.badgeLabel}
                          </span>
                          <span className="material-symbols-outlined text-sm">handyman</span>
                        </div>
                        <h4 className="text-xs font-semibold mt-1 leading-snug">{evt.title}</h4>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">
                          {evt.timeStart} - {evt.timeEnd} • {evt.location}
                        </p>
                        <div className="mt-2 text-[10px] text-secondary font-medium">
                          {evt.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Summary Bar */}
                <div className="bg-surface-container-low/70 px-6 py-3 flex flex-wrap items-center justify-between text-on-surface-variant text-xs border-t border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <span className="material-symbols-outlined text-base text-secondary">
                        info
                      </span>
                      Resumen semanal:
                    </span>
                    <span>4 Asignaturas activas</span>
                    <span>•</span>
                    <span>2 Evaluaciones parciales</span>
                    <span>•</span>
                    <span>2 Entregas obligatorias</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="hover:text-primary transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">print</span>
                      Imprimir Horario
                    </button>
                    <span>•</span>
                    <button
                      onClick={handleDownloadICal}
                      className="hover:text-primary transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Descargar .iCal
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Mes View */}
            {viewMode === 'mes' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-primary">Octubre 2024</h3>
                  <span className="text-xs text-on-surface-variant">
                    31 Días • Evaluaciones Parciales
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-on-surface-variant">
                  <div>LUN</div>
                  <div>MAR</div>
                  <div>MIÉ</div>
                  <div>JUE</div>
                  <div>VIE</div>
                  <div>SÁB</div>
                  <div>DOM</div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const hasExam = day === 10 || day === 23 || day === 25;
                    const hasTask = day === 22 || day === 25;
                    const isToday = day === 23;
                    return (
                      <div
                        key={day}
                        className={`min-h-[70px] p-2 rounded-xl border text-left transition-all ${
                          isToday
                            ? 'bg-secondary-fixed/30 border-secondary font-bold'
                            : 'bg-surface-container-lowest border-outline-variant/20 hover:border-secondary/40'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className={isToday ? 'text-secondary font-bold' : 'text-on-surface'}>
                            {day}
                          </span>
                          {isToday && (
                            <span className="text-[9px] bg-secondary text-white px-1 rounded">
                              Hoy
                            </span>
                          )}
                        </div>
                        {hasExam && (
                          <div className="text-[10px] bg-error-container text-on-error-container px-1 py-0.5 rounded truncate mb-1">
                            Examen
                          </div>
                        )}
                        {hasTask && (
                          <div className="text-[10px] bg-amber-100 text-amber-900 px-1 py-0.5 rounded truncate">
                            Entrega
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Agenda View */}
            {viewMode === 'agenda' && (
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-base text-primary">
                  Lista Cronológica de Actividades
                </h3>
                <div className="space-y-3">
                  {filteredEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center font-bold text-xs shadow-xs">
                          <span className="text-secondary">{evt.day}</span>
                          <span className="text-base text-primary">{evt.dayNumber}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded uppercase bg-surface-container text-primary">
                              {evt.badgeLabel}
                            </span>
                            <span className="text-xs text-on-surface-variant font-medium">
                              {evt.timeStart} - {evt.timeEnd}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-on-surface mt-1">{evt.title}</h4>
                          <p className="text-xs text-on-surface-variant">{evt.location}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-base">
                        chevron_right
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Column: Sidebar Filters & Upcoming (3 Cols) */}
          <div className="xl:col-span-3 space-y-6 flex flex-col">
            {/* Filter Checklist */}
            <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary text-sm font-bold">
                  <span className="material-symbols-outlined text-secondary">filter_alt</span>
                  <h3>Filtros de Vista</h3>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs text-secondary hover:underline font-semibold cursor-pointer"
                >
                  Restablecer
                </button>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={filters.classes}
                      onChange={(e) => setFilters({ ...filters, classes: e.target.checked })}
                      className="w-4 h-4 rounded text-secondary focus:ring-secondary accent-secondary cursor-pointer"
                    />
                    <span className="text-xs text-on-surface font-medium">Horarios de clase</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={filters.tasks}
                      onChange={(e) => setFilters({ ...filters, tasks: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs text-on-surface font-medium">Entregas de Tareas</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={filters.exams}
                      onChange={(e) => setFilters({ ...filters, exams: e.target.checked })}
                      className="w-4 h-4 rounded text-error focus:ring-error accent-error cursor-pointer"
                    />
                    <span className="text-xs text-on-surface font-medium">Fechas de Exámenes</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={filters.events}
                      onChange={(e) => setFilters({ ...filters, events: e.target.checked })}
                      className="w-4 h-4 rounded text-tertiary-container focus:ring-tertiary-container accent-tertiary-container cursor-pointer"
                    />
                    <span className="text-xs text-on-surface font-medium">
                      Eventos y Conferencias
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                </label>
              </div>
            </div>

            {/* Upcoming 7 Days Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] text-secondary font-bold uppercase tracking-wider">
                    Cronograma Inmediato
                  </span>
                  <h3 className="text-sm text-primary font-bold">Próximos 7 días</h3>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-base">
                  hourglass_top
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-amber-50/70 p-3 rounded-xl transition-all hover:bg-amber-50 flex flex-col gap-1 border border-amber-200/50">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                      Tarea LMS
                    </span>
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">timer</span>
                      En 18 horas
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-amber-950 mt-1">
                    Ensayo de Bioética Médica
                  </h4>
                  <p className="text-[11px] text-amber-900/80">Martes 22 de Octubre • 11:59 AM</p>
                  <div className="mt-1 w-full bg-amber-200/70 rounded-full h-1 overflow-hidden">
                    <div className="bg-amber-500 h-1 rounded-full w-3/4"></div>
                  </div>
                </div>

                <div className="bg-error-container/40 p-3 rounded-xl transition-all hover:bg-error-container/60 flex flex-col gap-1 border border-error/20">
                  <div className="flex items-center justify-between">
                    <span className="bg-error text-on-error text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                      Examen Parcial
                    </span>
                    <span className="text-xs font-bold text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">alarm</span>
                      En 2 días
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-error-container mt-1">
                    Evaluación Oral: Anatomía II
                  </h4>
                  <p className="text-[11px] text-on-error-container/80">
                    Miércoles 23 de Octubre • 03:00 PM
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-on-error-container text-[11px]">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    <span>Laboratorio Central de Morfología</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl transition-all hover:bg-surface-container flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="bg-tertiary-container text-on-tertiary text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                      Académico
                    </span>
                    <span className="text-xs font-semibold text-tertiary-container flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">event</span>
                      En 3 días
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mt-1">
                    Simposio Internacional de Genómica
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Jueves 24 de Octubre • 02:00 PM
                  </p>
                </div>

                <div className="bg-error-container/40 p-3 rounded-xl transition-all hover:bg-error-container/60 flex flex-col gap-1 border border-error/20">
                  <div className="flex items-center justify-between">
                    <span className="bg-error text-on-error text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                      Examen Escrito
                    </span>
                    <span className="text-xs font-bold text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">alarm</span>
                      En 4 días
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-error-container mt-1">
                    Parcial Teórico: Neuroanatomía
                  </h4>
                  <p className="text-[11px] text-on-error-container/80">
                    Viernes 25 de Octubre • 04:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Key Semestral Milestones Card */}
            <div className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl shadow-md p-5 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-secondary-fixed bg-white/10 px-2 py-0.5 rounded">
                  Hitos 2024-II
                </span>
                <span className="material-symbols-outlined text-secondary-fixed text-lg">flag</span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1 leading-tight">
                Fechas Clave del Semestre
              </h3>
              <p className="text-[11px] text-primary-fixed mb-4">
                Períodos de secretaría académica, cierres de actas y rectificaciones.
              </p>

              <div className="space-y-2 text-xs">
                <div className="bg-white/10 p-2 px-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary-fixed text-sm">
                      edit_calendar
                    </span>
                    <span className="text-white font-medium">Retiro Extraordinario</span>
                  </div>
                  <span className="text-tertiary-fixed font-bold">04 Nov</span>
                </div>

                <div className="bg-white/10 p-2 px-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-fixed text-sm">
                      fact_check
                    </span>
                    <span className="text-white font-medium">Semana de Finales</span>
                  </div>
                  <span className="text-secondary-fixed font-bold">02 - 07 Dic</span>
                </div>

                <div className="bg-white/10 p-2 px-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error-container text-sm">
                      lock
                    </span>
                    <span className="text-white font-medium">Cierre Definitivo de Actas</span>
                  </div>
                  <span className="text-error-container font-bold">14 Dic</span>
                </div>
              </div>

              <button
                onClick={() => showToast('Calendario institucional 2024-II descargado (PDF)')}
                className="mt-4 w-full py-2 bg-surface-container-lowest text-primary rounded-lg text-xs font-bold text-center hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer"
              >
                Descargar Calendario Institucional (PDF)
              </button>
            </div>

            {/* Cubicle Reservation Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 p-4 flex items-center gap-4">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtRDXhoBWS62EqJPGplL-UNcbX3BQ6N-Nshv8VKV_-QQtnVdVCY1LXcIO9sA-xE9ki3OBR-ConTTxPb_27-3VS_wgHQZDXvBJw0YZeKBn-eQCZis7ZF5sRJYw8BZeTy8aGxGqnj8jegtz8lrFC_tBmjLvqE3MkxgiI-rmqYF3_jBNGtRDct8dkoy6eF1Rm292M_uQdLr5IbakStmcOwUVC7t87S3ljYwk2qapYGbZzateLGH4oHcMmxw"
                alt="Library"
                className="w-16 h-16 rounded-lg object-cover shadow-xs shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-secondary">Aulas y Espacios</span>
                <h4 className="text-xs font-bold text-primary">Reserva de Cubículos</h4>
                <p className="text-[11px] text-on-surface-variant">
                  ¿Necesitas preparar tus exámenes en grupo?
                </p>
                <button
                  onClick={() => setShowCubicleModal(true)}
                  className="text-xs text-secondary font-semibold hover:underline mt-1 text-left cursor-pointer"
                >
                  Reservar sala en biblioteca →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-surface-container text-primary">
                {selectedEvent.badgeLabel}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">{selectedEvent.title}</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {selectedEvent.day} {selectedEvent.dayNumber} • {selectedEvent.timeStart} -{' '}
                {selectedEvent.timeEnd}
              </p>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg space-y-1.5 text-xs">
              <p>
                <strong>Ubicación:</strong> {selectedEvent.location}
              </p>
              {selectedEvent.instructor && (
                <p>
                  <strong>Docente a cargo:</strong> {selectedEvent.instructor}
                </p>
              )}
              {selectedEvent.details && (
                <p className="text-error font-medium">{selectedEvent.details}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  showToast('Añadido a tus recordatorios prioritarios');
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary transition-colors cursor-pointer"
              >
                Fijar Recordatorio
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cubicle Reservation Modal */}
      {showCubicleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">meeting_room</span>
                <span className="font-bold text-sm text-primary">Reserva de Cubículo Grupal</span>
              </div>
              <button
                onClick={() => setShowCubicleModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Selecciona el espacio:</label>
                <select className="w-full p-2 bg-surface-container-low rounded-lg border border-outline-variant/30">
                  <option>Cubículo 4A - Piso 2 (Capacidad: 6 personas • Pantalla TV)</option>
                  <option>Cubículo 4B - Piso 2 (Capacidad: 4 personas)</option>
                  <option>Sala Silenciosa 1 - Piso 3 (Capacidad: 8 personas)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Horario disponible:</label>
                <select className="w-full p-2 bg-surface-container-low rounded-lg border border-outline-variant/30">
                  <option>Hoy, 15:00 - 17:00</option>
                  <option>Hoy, 17:00 - 19:00</option>
                  <option>Mañana, 10:00 - 12:00</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCubicleModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  showToast('Cubículo reservado. Código de acceso: CUB-842');
                  setShowCubicleModal(false);
                }}
                className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
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
