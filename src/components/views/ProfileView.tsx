/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CURRENT_USER } from '../../data/mockData';
import { NavigationPath } from '../../types/lms';

interface ProfileViewProps {
  initialSection?: 'perfil' | 'calificaciones' | 'historial' | 'configuracion';
  onNavigate: (path: NavigationPath) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  initialSection = 'perfil',
}) => {
  const [section, setSection] = useState<'perfil' | 'calificaciones' | 'historial' | 'configuracion'>(
    initialSection
  );
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSMS, setNotificationsSMS] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1400px] mx-auto w-full space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/10 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-primary">{CURRENT_USER.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
                {CURRENT_USER.title}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {CURRENT_USER.email} • {CURRENT_USER.department}
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl gap-1">
          <button
            onClick={() => setSection('perfil')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              section === 'perfil'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Datos Personales
          </button>
          <button
            onClick={() => setSection('calificaciones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              section === 'calificaciones'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Calificaciones
          </button>
          <button
            onClick={() => setSection('historial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              section === 'historial'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Historial
          </button>
          <button
            onClick={() => setSection('configuracion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              section === 'configuracion'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Configuración
          </button>
        </div>
      </div>

      {/* Profile Details */}
      {section === 'perfil' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-primary">Información General</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-on-surface-variant block">Nombre Completo:</span>
                <span className="font-semibold text-on-surface">Dra. Elena Ramos Morales</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Grado Académico:</span>
                <span className="font-semibold text-on-surface">
                  Doctora en Informática y Ciencias de la Computación (PhD)
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Categoría Docente:</span>
                <span className="font-semibold text-on-surface">Docente Principal a Dedicación Exclusiva</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Código Institucional:</span>
                <span className="font-mono font-semibold text-secondary">DOC-89412</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-primary">Carga Lectiva Asignada (2024-II)</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-surface-container-low">
                <span className="font-semibold">UXD-402 Diseño de Sistemas e Interfaces</span>
                <span className="text-secondary font-bold">4 Créditos • Grupo 01</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-surface-container-low">
                <span className="font-semibold">CS-410 Inteligencia Artificial</span>
                <span className="text-secondary font-bold">4 Créditos • Grupo 02</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-surface-container-low">
                <span className="font-semibold">Tesis II - Seminario de Graduación</span>
                <span className="text-secondary font-bold">3 Asesorados</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calificaciones */}
      {section === 'calificaciones' && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-primary">Consolidado de Actas y Calificaciones</h3>
            <span className="text-xs text-on-surface-variant">Periodo Vigente: Semestre 2024-II</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant uppercase font-semibold">
                  <th className="p-3">Código</th>
                  <th className="p-3">Asignatura</th>
                  <th className="p-3">Matriculados</th>
                  <th className="p-3">Promedio de Cátedra</th>
                  <th className="p-3">Estado de Acta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                <tr>
                  <td className="p-3 font-mono font-bold text-primary">UXD-402</td>
                  <td className="p-3 font-semibold">Diseño de Sistemas e Interfaces UX/UI</td>
                  <td className="p-3">38 alumnos</td>
                  <td className="p-3 font-bold text-tertiary">17.8 / 20</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
                      En Curso
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-primary">CS-410</td>
                  <td className="p-3 font-semibold">Inteligencia Artificial</td>
                  <td className="p-3">42 alumnos</td>
                  <td className="p-3 font-bold text-tertiary">16.9 / 20</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
                      En Curso
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Historial */}
      {section === 'historial' && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-primary">Historial Docente en la Institución</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-on-surface">Semestre 2024-I</p>
                <p className="text-[11px] text-on-surface-variant">
                  4 cursos dictados • Satisfacción estudiantil: 98.4%
                </p>
              </div>
              <span className="text-tertiary font-bold">Acta Cerrada</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-on-surface">Semestre 2023-II</p>
                <p className="text-[11px] text-on-surface-variant">
                  3 cursos dictados • Satisfacción estudiantil: 97.2%
                </p>
              </div>
              <span className="text-tertiary font-bold">Acta Cerrada</span>
            </div>
          </div>
        </div>
      )}

      {/* Configuración */}
      {section === 'configuracion' && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-xs space-y-4 max-w-xl">
          <h3 className="text-sm font-bold text-primary">Preferencias de Notificaciones</h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low cursor-pointer">
              <span>Recibir alertas de tareas pendientes por correo</span>
              <input
                type="checkbox"
                checked={notificationsEmail}
                onChange={(e) => setNotificationsEmail(e.target.checked)}
                className="w-4 h-4 accent-secondary"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low cursor-pointer">
              <span>Avisos de foros y consultas de alumnos en tiempo real</span>
              <input
                type="checkbox"
                checked={notificationsSMS}
                onChange={(e) => setNotificationsSMS(e.target.checked)}
                className="w-4 h-4 accent-secondary"
              />
            </label>
            <button
              onClick={handleSave}
              className="mt-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary transition-colors cursor-pointer"
            >
              Guardar Cambios
            </button>
            {savedMessage && (
              <span className="text-xs text-tertiary font-semibold ml-3">
                ¡Preferencias guardadas!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
