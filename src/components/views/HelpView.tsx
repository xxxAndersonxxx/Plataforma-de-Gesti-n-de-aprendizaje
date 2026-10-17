/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export const HelpView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSent, setTicketSent] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  const faqs = [
    {
      q: '¿Cómo subo y programo los materiales de clase en los módulos semanales?',
      a: 'Desde el panel del curso, navega a "Materiales de Clase" y selecciona la semana activa. Puedes arrastrar archivos PDF, enlazar grabaciones de Google Meet o compartir tableros de Figma.',
    },
    {
      q: '¿Cuál es la fecha límite para el cierre de actas del examen parcial?',
      a: 'El cronograma oficial fija el cierre de actas de mitad de ciclo para el 04 de Noviembre a las 23:59 hrs.',
    },
    {
      q: '¿Cómo se sincronizan las sesiones sincrónicas con Google Calendar?',
      a: 'En la sección Calendario, haz clic en el botón "Sincronizar con Google / Outlook". El sistema descargará o vinculará automáticamente el feed .iCal institucional.',
    },
    {
      q: '¿Dónde accedo a las licencias de software para estudiantes?',
      a: 'En la barra lateral, bajo "Recursos" > "Descargas", encontrarás los enlaces para solicitar licencias educativas de JetBrains, Figma y repositorios científicos.',
    },
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTicketSubject('');
    setTicketDesc('');
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1200px] mx-auto w-full space-y-6 pb-16">
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-outline-variant/20">
        <div className="flex items-center gap-2 text-xs uppercase font-bold text-secondary tracking-wider mb-1">
          <span className="material-symbols-outlined text-base">help_outline</span>
          <span>Centro de Ayuda y Mesa de Soporte TIC</span>
        </div>
        <h1 className="text-2xl text-primary font-bold tracking-tight">Preguntas Frecuentes & Soporte</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Asistencia técnica continua para el uso de la plataforma académica EduPulse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* FAQs */}
        <div className="md:col-span-7 space-y-3">
          <h3 className="text-sm font-bold text-primary mb-2">Preguntas Frecuentes</h3>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 flex items-center justify-between text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-base transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="md:col-span-5 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-primary">Generar Ticket de Soporte</h3>
          {ticketSent ? (
            <div className="p-4 bg-tertiary-fixed/30 text-on-tertiary-fixed-variant rounded-xl text-xs space-y-2">
              <p className="font-bold">¡Ticket #TIC-9142 enviado con éxito!</p>
              <p>Un especialista del equipo de soporte responderá a tu correo institucional.</p>
              <button
                onClick={() => setTicketSent(false)}
                className="mt-2 text-primary font-semibold underline"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendTicket} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Motivo o Asunto:</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Ej: Problemas con registro de notas en acta"
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Descripción del Incidente:</label>
                <textarea
                  required
                  rows={4}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Detalla lo que sucede..."
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
              >
                Enviar a Soporte TIC
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
