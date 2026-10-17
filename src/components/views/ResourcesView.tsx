/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationPath } from '../../types/lms';

interface ResourcesViewProps {
  initialTab?: 'biblioteca' | 'videos' | 'enlaces' | 'descargas';
  onNavigate: (path: NavigationPath) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  initialTab = 'biblioteca',
}) => {
  const [activeTab, setActiveTab] = useState<'biblioteca' | 'videos' | 'enlaces' | 'descargas'>(
    initialTab
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-16">
      {/* Header */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-secondary tracking-wider mb-1">
            <span className="material-symbols-outlined text-base">local_library</span>
            <span>Centro de Recursos & Repositorio Digital</span>
          </div>
          <h1 className="text-2xl text-primary font-bold tracking-tight">Recursos de Aprendizaje</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Acceso institucional a bases de datos científicas, repositorios multimedia y software especializado.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('biblioteca')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'biblioteca'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Biblioteca Virtual
          </button>
          <button
            onClick={() => setActiveTab('descargas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'descargas'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Software & Licencias
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'videos'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Videos Tutoriales
          </button>
          <button
            onClick={() => setActiveTab('enlaces')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'enlaces'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Enlaces Útiles
          </button>
        </div>
      </div>

      {/* Tab: Biblioteca Virtual */}
      {activeTab === 'biblioteca' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                IEEE
              </div>
              <h3 className="text-base font-bold text-on-surface">IEEE Xplore Digital Library</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Acceso a más de 5 millones de publicaciones técnicas en ingeniería eléctrica, computación y telecomunicaciones.
              </p>
            </div>
            <button
              onClick={() => showToast('Sesión autenticada en IEEE Xplore via Shibboleth')}
              className="w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer"
            >
              Ingresar con Credenciales UCSS
            </button>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-lg">
                ACM
              </div>
              <h3 className="text-base font-bold text-on-surface">ACM Digital Library</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Colección completa de artículos de investigación sobre algoritmos, inteligencia artificial y arquitectura de software.
              </p>
            </div>
            <button
              onClick={() => showToast('Sesión autenticada en ACM Digital Library')}
              className="w-full py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary transition-colors cursor-pointer"
            >
              Acceso Institucional Activo
            </button>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 text-tertiary-container flex items-center justify-center font-bold text-lg">
                SPR
              </div>
              <h3 className="text-base font-bold text-on-surface">SpringerLink & Nature</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Monografías revisadas por pares, libros electrónicos y revistas académicas de impacto internacional.
              </p>
            </div>
            <button
              onClick={() => showToast('Sesión autenticada en SpringerLink')}
              className="w-full py-2 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Consultar Catálogo
            </button>
          </div>
        </div>
      )}

      {/* Tab: Descargas & Software */}
      {activeTab === 'descargas' && (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">terminal</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">
                  Paquete JetBrains Educational Pack (IntelliJ, PyCharm, WebStorm)
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Licencia completa anual para docentes y alumnos universitarios.
                </p>
              </div>
            </div>
            <button
              onClick={() => showToast('Clave de activación institucional generada')}
              className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary transition-colors cursor-pointer shrink-0"
            >
              Obtener Licencia
            </button>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">palette</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">
                  Figma for Education (Plan Profesional Gratuito)
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Espacios de trabajo colaborativos ilimitados y bibliotecas de componentes sincronizadas.
                </p>
              </div>
            </div>
            <button
              onClick={() => showToast('Acceso verificado para figma.com/education')}
              className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary transition-colors cursor-pointer shrink-0"
            >
              Vincular Correo Institucional
            </button>
          </div>
        </div>
      )}

      {/* Tab: Videos Tutoriales */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
            <div className="aspect-video bg-surface-container-high rounded-lg flex items-center justify-center text-primary relative overflow-hidden">
              <span className="material-symbols-outlined text-4xl">play_circle</span>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                18:24
              </span>
            </div>
            <h4 className="text-sm font-bold text-on-surface">
              Configuración de Entornos Virtuales en Python y PyTorch con CUDA
            </h4>
            <p className="text-xs text-on-surface-variant">
              Guía paso a paso para laboratorios de Machine Learning y Deep Learning.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3">
            <div className="aspect-video bg-surface-container-high rounded-lg flex items-center justify-center text-primary relative overflow-hidden">
              <span className="material-symbols-outlined text-4xl">play_circle</span>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                25:10
              </span>
            </div>
            <h4 className="text-sm font-bold text-on-surface">
              Exportación de Tokens con Figma Tokens Studio & GitHub Action
            </h4>
            <p className="text-xs text-on-surface-variant">
              Integración de diseño y desarrollo continuo sin fricciones.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Enlaces Útiles */}
      {activeTab === 'enlaces' && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-xs space-y-3 text-xs">
          <h3 className="text-base font-bold text-primary mb-2">Portales Académicos Institucionales</h3>
          <ul className="divide-y divide-outline-variant/20">
            <li className="py-2.5 flex justify-between items-center">
              <span>Portal de Trámites y Matrícula UCSS</span>
              <span className="text-secondary font-semibold">tramites.ucss.edu.pe</span>
            </li>
            <li className="py-2.5 flex justify-between items-center">
              <span>Mesa de Ayuda Tecnológica y Soporte TIC</span>
              <span className="text-secondary font-semibold">soporte.campus.edu.pe</span>
            </li>
            <li className="py-2.5 flex justify-between items-center">
              <span>Reglamento General de Estudios de Pregrado</span>
              <span className="text-secondary font-semibold">PDF Oficial (2024)</span>
            </li>
          </ul>
        </div>
      )}

      {/* Toast Notification */}
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
