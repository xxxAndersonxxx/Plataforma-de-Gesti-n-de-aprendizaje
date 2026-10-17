/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CONVERSATIONS, CURRENT_USER } from '../../data/mockData';
import { ChatMessage, ConversationThread, NavigationPath } from '../../types/lms';

interface CommunicationViewProps {
  onNavigate: (path: NavigationPath) => void;
  preselectedSender?: string;
}

export const CommunicationView: React.FC<CommunicationViewProps> = ({
  preselectedSender,
}) => {
  const [threads, setThreads] = useState<ConversationThread[]>(CONVERSATIONS);
  const [activeThreadId, setActiveThreadId] = useState<string>('conv-1');
  const [activeChannel, setActiveChannel] = useState<'inbox' | 'sent' | 'starred' | 'forums' | 'notices' | 'chat'>('inbox');
  const [courseFilter, setCourseFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);

  // Composer state
  const [replyText, setReplyText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [showStudentGradeModal, setShowStudentGradeModal] = useState(false);
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New thread form state
  const [newRecipient, setNewRecipient] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = () => {
    if (!replyText.trim() && !attachedFileName) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Dra. Elena Ramos (Tú)',
      senderAvatar: CURRENT_USER.avatar,
      timestamp: 'Ahora mismo',
      isMe: true,
      content: replyText,
      attachment: attachedFileName
        ? {
            filename: attachedFileName,
            size: '1.2 MB',
            type: 'Documento adjunto',
          }
        : undefined,
      readStatus: false,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              preview: replyText || 'Archivo adjunto enviado',
              timeAgo: 'Ahora mismo',
            }
          : t
      )
    );

    setReplyText('');
    setAttachedFileName(null);
    showToast('Mensaje enviado al alumno');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInsertSnippet = () => {
    setReplyText(
      (prev) =>
        prev +
        `\n\n\`\`\`python\n# Plantilla Oficial de Corrección - Solución Óptima\noptimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-2)\nscheduler = torch.optim.lr_scheduler.LinearLR(optimizer, start_factor=0.1, total_iters=3)\n\`\`\`\n`
    );
    showToast('Plantilla oficial de código insertada en el editor');
  };

  const handleCreateNewThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.trim() || !newSubject.trim()) return;

    const newThread: ConversationThread = {
      id: `conv-${Date.now()}`,
      type: 'direct',
      categoryLabel: '3.1 Mensajes Directos',
      senderName: newRecipient,
      senderRole: 'Estudiante',
      senderAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDggbFmXAryHVoOR_tSaFTWtwNBRkvas2h8ckTrDrusO6eOOptW0TFGKsQOWnhlcE9EsQ0F4dnx4x9TMHaGzutIn60uOKMFqP2WHPv2IF7hae3L9hevPrldFG1_11RYkiFYdQh2psAMDn05FBIZUDWyYdqn5PPpLpVeW_l4OYFraPBGOfePjzJCZZzxfKJpVucy8SH4g7Y2iEoov0XeXpQ-OEFx1J6XT1XvrDv6KC-2teE1EZ4V3D-OkQ',
      courseCode: 'CS410',
      courseName: 'Inteligencia Artificial',
      subject: newSubject,
      preview: newBody,
      timeAgo: 'Justo ahora',
      unread: false,
      isUrgent: false,
      contextPill: 'Nuevo hilo docente iniciado',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: 'Dra. Elena Ramos (Tú)',
          senderAvatar: CURRENT_USER.avatar,
          timestamp: 'Justo ahora',
          isMe: true,
          content: newBody,
        },
      ],
    };

    setThreads([newThread, ...threads]);
    setActiveThreadId(newThread.id);
    setNewRecipient('');
    setNewSubject('');
    setNewBody('');
    setShowNewThreadModal(false);
    showToast('Nuevo hilo iniciado con éxito');
  };

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    if (onlyUnread && !t.unread) return false;
    if (courseFilter !== 'todos') {
      if (courseFilter === 'CS410' && !t.courseCode?.includes('CS410')) return false;
      if (courseFilter === 'CS302' && !t.courseCode?.includes('CS302')) return false;
      if (courseFilter === 'Tesis' && !t.subject.toLowerCase().includes('tesis')) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchSender = t.senderName.toLowerCase().includes(q);
      const matchSubject = t.subject.toLowerCase().includes(q);
      const matchPreview = t.preview.toLowerCase().includes(q);
      if (!matchSender && !matchSubject && !matchPreview) return false;
    }
    return true;
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 sm:p-8 overflow-hidden bg-background">
      {/* Top Context & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-2 gap-3 shrink-0">
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="text-xl sm:text-2xl text-primary font-bold tracking-tight">
            Centro de Comunicación
          </span>
          <span className="text-[11px] uppercase tracking-wider text-secondary px-2.5 py-0.5 rounded-full bg-secondary-fixed font-semibold">
            Semestre Activo 2024-II
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-xs border border-outline-variant/20">
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold">
                IA
              </span>
              <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-[10px] font-bold">
                DS
              </span>
              <span className="w-6 h-6 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary text-[10px] font-bold">
                BD
              </span>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">
              42 Estudiantes Conectados
            </span>
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
          </div>

          <button
            onClick={() => setShowNewThreadModal(true)}
            className="flex items-center gap-1.5 bg-secondary text-on-secondary hover:bg-primary text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_comment</span>
            <span>Nuevo Hilo</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 lg:gap-6 min-h-0">
        {/* COLUMN 1: Category & Scope Navigation (Col 1-3) */}
        <aside className="col-span-12 md:col-span-3 hidden md:flex flex-col bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 p-4 overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-outline-variant/20">
            <span className="text-sm text-primary font-bold">Canales & Módulos</span>
            <span className="material-symbols-outlined text-outline text-lg">tune</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* 3.1 Mensajes Directos */}
            <div>
              <div className="flex items-center justify-between text-on-surface-variant text-[11px] uppercase tracking-wider mb-1 px-2 font-semibold">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-sm text-secondary">mail</span>
                  3.1 Mensajes Directos
                </span>
                <span className="text-[10px] bg-surface-container px-1.5 py-0.2 rounded-full text-secondary font-bold">
                  5
                </span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveChannel('inbox')}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeChannel === 'inbox'
                      ? 'bg-surface-container text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-base text-secondary">inbox</span>
                    <span className="truncate">Bandeja de Entrada</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                </button>

                <button
                  onClick={() => setActiveChannel('sent')}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeChannel === 'sent'
                      ? 'bg-surface-container text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-base text-outline">send</span>
                    <span className="truncate">Enviados & Borradores</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveChannel('starred')}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeChannel === 'starred'
                      ? 'bg-surface-container text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-base text-outline">star</span>
                    <span className="truncate">Destacados por Docentes</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3.2 Foros Generales y Debates */}
            <div>
              <div className="flex items-center justify-between text-on-surface-variant text-[11px] uppercase tracking-wider mb-1 px-2 font-semibold">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-sm text-secondary">forum</span>
                  3.2 Foros Académicos
                </span>
                <span className="text-[10px] bg-surface-container px-1.5 py-0.2 rounded-full text-on-surface-variant">
                  12
                </span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveChannel('forums');
                    setActiveThreadId('conv-4');
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs text-secondary font-bold">#</span>
                    <span className="truncate">Debates Generales Campus</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveChannel('forums');
                    setActiveThreadId('conv-1');
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs text-secondary font-bold">#</span>
                    <span className="truncate">Consultas Metodología & Tesis</span>
                  </div>
                  <span className="text-[10px] bg-error-container text-on-error-container px-1.5 py-0.2 rounded-full font-bold">
                    3
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveChannel('forums');
                    setActiveThreadId('conv-4');
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs text-secondary font-bold">#</span>
                    <span className="truncate">Proyectos Interdisciplinarios</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3.3 Anuncios Institucionales y de Cátedra */}
            <div>
              <div className="flex items-center justify-between text-on-surface-variant text-[11px] uppercase tracking-wider mb-1 px-2 font-semibold">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-sm text-secondary">campaign</span>
                  3.3 Anuncios & Cátedra
                </span>
                <span className="text-[10px] bg-error text-on-error px-1.5 py-0.2 rounded-full font-bold">
                  Nuevo
                </span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveChannel('notices');
                    setActiveThreadId('conv-3');
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-base text-error">
                      priority_high
                    </span>
                    <span className="truncate">Rectoría & Secretaría General</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveChannel('notices');
                    setActiveThreadId('conv-3');
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-base text-outline">
                      notifications_active
                    </span>
                    <span className="truncate">Avisos Docentes - CS401</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3.4 Canales de Chat de Cursos */}
            <div>
              <div className="flex items-center justify-between text-on-surface-variant text-[11px] uppercase tracking-wider mb-1 px-2 font-semibold">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-sm text-secondary">chat</span>
                  3.4 Salas de Chat de Cursos
                </span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveChannel('chat')}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                    <span className="truncate">Algoritmos Avanzados (CS302)</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-semibold">18</span>
                </button>

                <button
                  onClick={() => setActiveChannel('chat')}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                    <span className="truncate">Inteligencia Artificial (CS410)</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-semibold">24</span>
                </button>

                <button
                  onClick={() => setActiveChannel('chat')}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                    <span className="truncate">Arquitectura Cloud (CS505)</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Instructor Support Badge */}
          <div className="mt-3 p-2.5 bg-surface-container-low rounded-xl flex items-center gap-2.5 border border-outline-variant/10">
            <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">support_agent</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-primary font-bold truncate">Mesa Académica</div>
              <div className="text-[10px] text-on-surface-variant truncate">
                Horario tutorías: 14:00 - 18:00
              </div>
            </div>
          </div>
        </aside>

        {/* COLUMN 2: Thread List & Filters (Col 4-7) */}
        <section className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 overflow-hidden">
          {/* Search & Filter Header */}
          <div className="p-3.5 pb-2 space-y-2.5 border-b border-outline-variant/15">
            <div className="flex items-center justify-between">
              <div className="text-base text-primary font-bold">Conversaciones</div>
              <div className="flex items-center gap-1 text-on-surface-variant">
                <button
                  onClick={() => setOnlyUnread(!onlyUnread)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    onlyUnread ? 'bg-secondary text-on-secondary' : 'hover:bg-surface-container-low text-secondary'
                  }`}
                  title="Filtrar no leídos"
                >
                  <span className="material-symbols-outlined text-base">mark_email_unread</span>
                </button>
                <button
                  onClick={() => setThreads([...threads].reverse())}
                  className="p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant cursor-pointer"
                  title="Invertir orden"
                >
                  <span className="material-symbols-outlined text-base">sort</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-base">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por estudiante, código o tema..."
                className="w-full bg-surface-container-low text-on-surface text-xs pl-8 pr-3 py-1.5 rounded-lg focus:outline-none placeholder:text-on-surface-variant/60"
              />
            </div>

            {/* Course Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-nowrap scrollbar-none">
              <button
                onClick={() => setCourseFilter('todos')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  courseFilter === 'todos'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setCourseFilter('CS410')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  courseFilter === 'CS410'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                CS410 - IA
              </button>
              <button
                onClick={() => setCourseFilter('CS302')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  courseFilter === 'CS302'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                CS302 - Algo
              </button>
              <button
                onClick={() => setCourseFilter('Tesis')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  courseFilter === 'Tesis'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Tesis I
              </button>
            </div>
          </div>

          {/* Thread Items List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y-0">
            {filteredThreads.map((thread) => {
              const isActive = thread.id === activeThread.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-3 rounded-xl transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-surface-container-high'
                      : 'hover:bg-surface-container-low'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-1 top-3.5 bottom-3.5 w-1 bg-secondary rounded-full"></div>
                  )}

                  <div className="flex items-start justify-between gap-2 pl-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {thread.senderAvatar ? (
                        <img
                          src={thread.senderAvatar}
                          alt={thread.senderName}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-bold text-sm shrink-0">
                          <span className="material-symbols-outlined text-base">campaign</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-primary truncate">
                          {thread.senderName}
                        </div>
                        <div className="text-[10px] text-secondary font-semibold truncate">
                          {thread.courseCode ? `${thread.courseCode} · ${thread.courseName}` : thread.senderRole}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-medium shrink-0">
                      {thread.timeAgo}
                    </span>
                  </div>

                  <div className="pl-2 mt-1.5">
                    <div className="text-xs font-semibold text-on-surface truncate">
                      {thread.subject}
                    </div>
                    <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                      {thread.preview}
                    </p>
                  </div>

                  <div className="pl-2 mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {thread.filesCount && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-secondary bg-surface-container px-2 py-0.2 rounded-full font-medium">
                          <span className="material-symbols-outlined text-xs">attach_file</span>{' '}
                          {thread.filesCount} Archivos
                        </span>
                      )}
                      {thread.isUrgent && (
                        <span className="inline-flex items-center text-[10px] text-on-tertiary-fixed-variant bg-tertiary-fixed px-2 py-0.2 rounded-full font-bold">
                          Urgente
                        </span>
                      )}
                      {thread.isAnswered && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-on-surface-variant bg-surface-container-low px-2 py-0.2 rounded-full font-medium">
                          <span className="material-symbols-outlined text-xs">done_all</span>{' '}
                          Respondido
                        </span>
                      )}
                      {thread.repliesCount && (
                        <span className="text-[10px] text-on-surface-variant">
                          {thread.repliesCount} respuestas
                        </span>
                      )}
                    </div>
                    {isActive && <span className="w-2 h-2 rounded-full bg-secondary"></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* COLUMN 3: Conversation Thread & Action Canvas (Col 8-12) */}
        <section className="col-span-12 md:col-span-7 lg:col-span-5 flex flex-col bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 overflow-hidden">
          {/* Thread Header */}
          <div className="px-4 sm:px-6 py-3 bg-surface-container-lowest flex items-center justify-between border-b border-outline-variant/15 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                {activeThread.senderAvatar ? (
                  <img
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-container-high"
                    src={activeThread.senderAvatar}
                    alt={activeThread.senderName}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-surface-container text-primary flex items-center justify-center font-bold">
                    #
                  </div>
                )}
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim absolute bottom-0 right-0 ring-2 ring-surface-container-lowest"></span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary truncate">
                    {activeThread.senderName}
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                    {activeThread.senderRole || 'Estudiante'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-on-surface-variant truncate">
                  <span>{activeThread.courseName || 'Semestre 2024-II'}</span>
                  <span>•</span>
                  <span className="text-tertiary font-bold">En línea</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowStudentProfileModal(true)}
                className="p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                title="Ver ficha académica"
              >
                <span className="material-symbols-outlined text-lg">badge</span>
              </button>
              <button
                onClick={() => setShowStudentGradeModal(true)}
                className="p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                title="Abrir calificaciones de estudiante"
              >
                <span className="material-symbols-outlined text-lg">grade</span>
              </button>
              <button
                onClick={() => showToast('Opciones de hilo archivadas')}
                className="p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                title="Opciones avanzadas"
              >
                <span className="material-symbols-outlined text-lg">more_vert</span>
              </button>
            </div>
          </div>

          {/* Context Pill Header */}
          <div className="px-4 sm:px-6 py-2 bg-surface-container-low flex items-center justify-between text-on-surface-variant text-xs border-b border-outline-variant/15 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-secondary text-base">
                assignment
              </span>
              <span className="font-semibold text-primary truncate">
                {activeThread.contextPill || activeThread.subject}
              </span>
            </div>
            <span className="text-[10px] bg-surface-container-lowest px-2 py-0.5 rounded-md text-outline font-mono">
              ID: {activeThread.contextId || 'CS410-TP3-2024'}
            </span>
          </div>

          {/* Active Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-surface">
            {/* Time Divider */}
            <div className="flex items-center justify-center my-1">
              <span className="px-3 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                Hoy, 22 de Octubre
              </span>
            </div>

            {/* Messages rendering */}
            {activeThread.messages.map((msg) => {
              if (!msg.isMe) {
                // Student Message
                return (
                  <div key={msg.id} className="flex gap-3 items-start max-w-[88%]">
                    <img
                      src={msg.senderAvatar || activeThread.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                    />
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-primary font-bold">{msg.senderName}</span>
                        <span className="text-[10px] text-on-surface-variant">{msg.timestamp}</span>
                      </div>

                      <div className="bg-surface-container-lowest p-3.5 rounded-2xl rounded-tl-xs shadow-xs border border-outline-variant/20 space-y-2 text-on-surface text-xs leading-relaxed">
                        <p className="whitespace-pre-line">{msg.content}</p>

                        {/* Code Snippet Attachment Block */}
                        {msg.codeSnippet && (
                          <div className="bg-surface-container-highest p-3 rounded-lg font-mono text-[11px] text-on-surface space-y-1 border border-outline-variant/30">
                            <div className="flex items-center justify-between text-on-surface-variant pb-1 text-[10px] font-semibold border-b border-outline-variant/20">
                              <span>{msg.codeSnippet.filename}</span>
                              <span>{msg.codeSnippet.language}</span>
                            </div>
                            <pre className="overflow-x-auto text-primary py-1 font-mono">
                              <code>{msg.codeSnippet.code}</code>
                            </pre>
                          </div>
                        )}

                        {/* Graphic Attachment Card */}
                        {msg.attachment && (
                          <div className="flex items-center gap-3 p-2.5 bg-surface-container rounded-lg border border-outline-variant/20">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-secondary text-xl">
                                analytics
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs text-primary font-bold truncate">
                                {msg.attachment.filename}
                              </div>
                              <div className="text-[10px] text-on-surface-variant">
                                {msg.attachment.size} • {msg.attachment.type}
                              </div>
                            </div>
                            <button
                              onClick={() => showToast('Descargando archivo adjunto...')}
                              className="p-1.5 rounded-lg hover:bg-surface-container-lowest text-secondary transition-colors cursor-pointer"
                              title="Descargar archivo"
                            >
                              <span className="material-symbols-outlined text-base">download</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Teacher Message (Elena Ramos)
                return (
                  <div key={msg.id} className="flex gap-3 items-start justify-end ml-auto max-w-[88%]">
                    <div className="space-y-1 flex flex-col items-end">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] text-on-surface-variant">{msg.timestamp}</span>
                        <span className="text-xs text-primary font-bold">{msg.senderName}</span>
                      </div>

                      <div className="bg-primary text-on-primary p-3.5 rounded-2xl rounded-tr-xs shadow-md space-y-2 text-xs leading-relaxed text-left">
                        <p className="whitespace-pre-line">{msg.content}</p>

                        {msg.quote && (
                          <div className="bg-primary-container text-on-primary-container p-2 rounded-lg flex items-center gap-2 text-[11px]">
                            <span className="material-symbols-outlined text-on-primary-container text-base">
                              menu_book
                            </span>
                            <span>{msg.quote}</span>
                          </div>
                        )}

                        {msg.attachment && (
                          <div className="flex items-center gap-2 p-2 bg-primary-container/80 rounded-lg text-[11px]">
                            <span className="material-symbols-outlined text-base">attach_file</span>
                            <span>{msg.attachment.filename}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-on-surface-variant text-[10px] pr-1">
                        <span className="material-symbols-outlined text-secondary text-xs">
                          done_all
                        </span>
                        <span>Leído por el alumno</span>
                      </div>
                    </div>

                    <img
                      src={CURRENT_USER.avatar}
                      alt="Docente"
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 ring-1 ring-primary"
                    />
                  </div>
                );
              }
            })}

            {/* Academic Quick Action Inline Prompt */}
            <div className="flex items-center justify-center my-2">
              <div className="bg-surface-container-high px-4 py-1.5 rounded-full flex items-center gap-3 shadow-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-base">psychology</span>
                <span className="text-xs text-primary font-medium">
                  Sugerencia de Cátedra: ¿Deseas compartir la plantilla oficial de solución con Mateo?
                </span>
                <button
                  onClick={handleInsertSnippet}
                  className="bg-secondary text-on-secondary px-2.5 py-0.5 rounded-full text-xs font-semibold hover:bg-primary transition-colors cursor-pointer"
                >
                  Compartir Snippet
                </button>
              </div>
            </div>
          </div>

          {/* Rich Input Box (Bottom) */}
          <div className="p-3.5 bg-surface-container-lowest border-t border-outline-variant/20 shrink-0">
            <div className="bg-surface-container-low rounded-xl p-2.5 space-y-2 border border-outline-variant/20">
              {/* Formatting Action Bar */}
              <div className="flex items-center justify-between pb-1 text-on-surface-variant text-xs">
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setReplyText((p) => p + ' **texto en negrita** ')}
                    className="p-1 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-colors cursor-pointer"
                    title="Negrita"
                  >
                    <span className="material-symbols-outlined text-base">format_bold</span>
                  </button>
                  <button
                    onClick={() => setReplyText((p) => p + ' *cursiva* ')}
                    className="p-1 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-colors cursor-pointer"
                    title="Cursiva"
                  >
                    <span className="material-symbols-outlined text-base">format_italic</span>
                  </button>
                  <button
                    onClick={() => setReplyText((p) => p + '\n```python\n# Código\n```\n')}
                    className="p-1 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-colors cursor-pointer"
                    title="Código"
                  >
                    <span className="material-symbols-outlined text-base">code</span>
                  </button>
                  <button
                    onClick={() => setReplyText((p) => p + '\n- Item 1\n- Item 2\n')}
                    className="p-1 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-colors cursor-pointer"
                    title="Lista con viñetas"
                  >
                    <span className="material-symbols-outlined text-base">
                      format_list_bulleted
                    </span>
                  </button>
                  <button
                    onClick={() => setReplyText((p) => p + ' $lr = 3e-4$ ')}
                    className="p-1 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-colors cursor-pointer"
                    title="Fórmula Matemática LaTeX"
                  >
                    <span className="material-symbols-outlined text-base">functions</span>
                  </button>
                  <span className="w-[1px] h-3.5 bg-outline-variant/40 mx-1"></span>
                  <button
                    onClick={() =>
                      setReplyText(
                        (p) =>
                          p +
                          '\n> Criterio 2 de la rúbrica: Justificación del scheduler de tasa de aprendizaje.\n'
                      )
                    }
                    className="p-1 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-colors cursor-pointer"
                    title="Citar fragmento de rúbrica"
                  >
                    <span className="material-symbols-outlined text-base">format_quote</span>
                  </button>
                  <button
                    onClick={() => setReplyText((p) => p + ' [Enlace al Repositorio](https://...) ')}
                    className="p-1 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-colors cursor-pointer"
                    title="Insertar enlace de recurso"
                  >
                    <span className="material-symbols-outlined text-base">link</span>
                  </button>
                </div>

                {/* Scope Indicator */}
                <div className="flex items-center gap-1 text-[10px] text-secondary bg-surface-container px-2 py-0.5 rounded font-semibold">
                  <span className="material-symbols-outlined text-xs">lock</span>
                  <span>Hilo Privado Docente-Alumno</span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu respuesta pedagógica o retroalimentación técnica... (Presiona Ctrl+Enter para enviar)"
                rows={3}
                className="w-full bg-transparent text-on-surface text-xs placeholder:text-on-surface-variant/50 focus:outline-none resize-none px-1"
              />

              {/* Show attached file badge if any */}
              {attachedFileName && (
                <div className="flex items-center justify-between bg-surface-container px-3 py-1 rounded-md text-xs text-primary">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-sm text-secondary">
                      attachment
                    </span>
                    {attachedFileName}
                  </span>
                  <button
                    onClick={() => setAttachedFileName(null)}
                    className="text-on-surface-variant hover:text-error"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}

              {/* Bottom Tools & Send Button */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-xs transition-colors cursor-pointer font-medium">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAttachedFileName(e.target.files[0].name);
                          showToast(`Archivo adjunto: ${e.target.files[0].name}`);
                        }
                      }}
                    />
                    <span className="material-symbols-outlined text-sm text-secondary">
                      attach_file
                    </span>
                    <span className="hidden sm:inline">Adjuntar PDF / Archivo</span>
                  </label>

                  <button
                    onClick={() => {
                      setReplyText(
                        (prev) =>
                          prev +
                          '\n[Rúbrica TP3]: 1. Formulación de hiperparámetros (5 pts) | 2. Curvas de pérdida y validación (8 pts) | 3. Análisis de convergencia (7 pts).'
                      );
                      showToast('Rúbrica oficial insertada');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-xs transition-colors cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-sm text-tertiary">
                      check_circle
                    </span>
                    <span className="hidden sm:inline">Insertar Rúbrica</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Plantilla guardada en tus respuestas frecuentes')}
                    className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
                    title="Guardar como respuesta predeterminada"
                  >
                    <span className="material-symbols-outlined text-base">bookmark_add</span>
                  </button>

                  <button
                    onClick={handleSendMessage}
                    className="flex items-center gap-1.5 bg-primary hover:bg-secondary text-on-primary text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all duration-200 cursor-pointer"
                  >
                    <span>Enviar Mensaje</span>
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal: Nuevo Hilo */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <form
            onSubmit={handleCreateNewThread}
            className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span className="font-bold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">add_comment</span>
                Iniciar Nuevo Hilo de Comunicación
              </span>
              <button
                type="button"
                onClick={() => setShowNewThreadModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Destinatario:</label>
                <input
                  type="text"
                  required
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="Nombre de estudiante, delegado o código de grupo (ej: Mateo Valencia)"
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Asunto / Tema:</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Ej: Aclaración sobre entrega TP N°4"
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Mensaje Inicial:</label>
                <textarea
                  required
                  rows={4}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Escribe el mensaje de apertura..."
                  className="w-full p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowNewThreadModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-semibold hover:bg-primary shadow-xs"
              >
                Iniciar Conversación
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Student Academic Record */}
      {showStudentGradeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">grade</span>
                <span className="font-bold text-sm text-primary">Récord Académico del Alumno</span>
              </div>
              <button
                onClick={() => setShowStudentGradeModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-surface-container-low p-3 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-on-surface">{activeThread.senderName}</p>
                  <p className="text-[11px] text-on-surface-variant">Código: 2021-04982</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-secondary">18.4</span>
                  <span className="text-[10px] text-on-surface-variant block">Promedio Cátedra</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-outline-variant/20 pt-2">
                <div className="flex justify-between">
                  <span>TP N°1: Regresión Logística</span>
                  <span className="font-bold text-tertiary">19.0 / 20</span>
                </div>
                <div className="flex justify-between">
                  <span>TP N°2: Redes Convolucionales</span>
                  <span className="font-bold text-tertiary">18.5 / 20</span>
                </div>
                <div className="flex justify-between">
                  <span>TP N°3: Optimizadores & Descenso</span>
                  <span className="font-bold text-secondary">En revisión</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowStudentGradeModal(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Student Profile Modal */}
      {showStudentProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span className="font-bold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">badge</span>
                Ficha del Estudiante
              </span>
              <button
                onClick={() => setShowStudentProfileModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={activeThread.senderAvatar}
                  alt={activeThread.senderName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-on-surface">{activeThread.senderName}</h4>
                  <p className="text-[11px] text-secondary font-semibold">
                    Ingeniería de Software • 8vo Ciclo
                  </p>
                  <p className="text-[10px] text-on-surface-variant">mvalencia@campus.edu.pe</p>
                </div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg space-y-1">
                <p>
                  <strong>Créditos aprobados:</strong> 162 / 210
                </p>
                <p>
                  <strong>Condición:</strong> Regular • Sin amonestaciones
                </p>
                <p>
                  <strong>Grupo de Investigación:</strong> Laboratorio de Redes Neuronales Profundas
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowStudentProfileModal(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
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
