/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NavigationPath =
  | 'cursos-actuales'
  | 'cursos-anteriores'
  | 'buscar-cursos'
  | 'curso-detalle'
  | 'horario-semanal'
  | 'fechas-de-examenes'
  | 'entregas-de-tareas'
  | 'eventos-academicos'
  | 'mensajes'
  | 'foros'
  | 'anuncios'
  | 'chat'
  | 'biblioteca-virtual'
  | 'videos-tutoriales'
  | 'enlaces-utiles'
  | 'descargas'
  | 'datos-personales'
  | 'calificaciones'
  | 'historial-academico'
  | 'configuracion'
  | 'preguntas-frecuentes'
  | 'contacto';

export interface Course {
  id: string;
  code: string;
  name: string;
  group?: string;
  professor: {
    name: string;
    title: string;
    email: string;
    avatar: string;
    officeHours?: string;
  };
  assistants?: Array<{
    name: string;
    role: string;
    email: string;
    avatar: string;
  }>;
  category: string;
  image: string;
  progress: number;
  term: string;
  isFavorite: boolean;
  isPast?: boolean;
  studentsCount: number;
  syllabusUrl?: string;
  deliverable?: {
    type: 'urgent' | 'exam' | 'task' | 'completed';
    badge: string;
    title: string;
    dueIn: string;
    dueDate: string;
    grade?: string;
  };
  modules?: CourseModule[];
  assignments?: CourseAssignment[];
  exams?: CourseExam[];
  forumThreads?: ForumThread[];
}

export interface CourseModule {
  id: string;
  weekNumber: number;
  title: string;
  dateRange: string;
  status: 'current' | 'completed' | 'locked';
  description?: string;
  resources: ModuleResource[];
}

export interface ModuleResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'reading' | 'link';
  meta: string;
  url?: string;
  size?: string;
  duration?: string;
}

export interface CourseAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueCountdown: string;
  status: 'pending' | 'graded';
  rubricName?: string;
  rubricUrl?: string;
  score?: number;
  maxScore?: number;
  submittedAt?: string;
  feedback?: string;
}

export interface CourseExam {
  id: string;
  title: string;
  date: string;
  weight: string;
  status: 'completed' | 'scheduled' | 'locked';
  score?: string;
}

export interface ForumThread {
  id: string;
  author: string;
  authorAvatar: string;
  tag: string;
  timeAgo: string;
  title: string;
  preview: string;
  repliesCount: number;
  viewsCount: number;
  teacherReplied?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  category: 'class' | 'task' | 'exam' | 'event' | 'tutoring';
  badgeLabel: string;
  day: 'LUN' | 'MAR' | 'MIÉ' | 'JUE' | 'VIE' | 'SÁB';
  dayNumber: number;
  timeStart: string;
  timeEnd: string;
  location: string;
  instructor?: string;
  instructorAvatar?: string;
  details?: string;
  tolerance?: string;
  weight?: string;
  credits?: string;
  mandatory?: boolean;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  isMe: boolean;
  content: string;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
  attachment?: {
    filename: string;
    size: string;
    type: string;
  };
  quote?: string;
  readStatus?: boolean;
}

export interface ConversationThread {
  id: string;
  type: 'direct' | 'forum' | 'announcement' | 'chat';
  categoryLabel: string;
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  courseCode?: string;
  courseName?: string;
  subject: string;
  preview: string;
  timeAgo: string;
  unread: boolean;
  isUrgent?: boolean;
  isAnswered?: boolean;
  isSticky?: boolean;
  filesCount?: number;
  repliesCount?: number;
  attachment?: {
    filename: string;
    size: string;
    type: string;
  };
  contextPill?: string;
  contextId?: string;
  messages: ChatMessage[];
}

export interface QuickLiveSession {
  id: string;
  dayTime: string;
  title: string;
  room: string;
  isToday?: boolean;
  meetUrl?: string;
}

export interface FacultyNotice {
  id: string;
  instructorInitials: string;
  instructorName: string;
  timeAgo: string;
  content: string;
  courseName: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'message' | 'assignment' | 'grade' | 'announcement';
}
