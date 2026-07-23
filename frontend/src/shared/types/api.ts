export type QuizStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface AdminIdentity {
  id: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  admin: AdminIdentity;
}

export interface ApiErrorDetail {
  field?: string;
  constraints?: string[];
  [key: string]: unknown;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details: ApiErrorDetail[];
    requestId: string;
    timestamp: string;
    path: string;
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface QuizListItem {
  id: string;
  publicId: string;
  title: string;
  description: string | null;
  status: QuizStatus;
  questionCount: number;
  participationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizListResponse {
  data: QuizListItem[];
  meta: PaginationMeta;
}

export interface QuizOptionInput {
  text: string;
  position: number;
  isCorrect: boolean;
}

export interface QuizQuestionInput {
  text: string;
  position: number;
  options: QuizOptionInput[];
}

export interface QuizContentInput {
  title: string;
  description?: string;
  questions: QuizQuestionInput[];
}

export interface AdminQuizOption extends QuizOptionInput {
  id: string;
}

export interface AdminQuizQuestion extends Omit<QuizQuestionInput, 'options'> {
  id: string;
  options: AdminQuizOption[];
}

export interface AdminQuizDetail {
  id: string;
  publicId: string;
  title: string;
  description: string | null;
  status: QuizStatus;
  questions: AdminQuizQuestion[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  closedAt: string | null;
}

export interface PublicQuizOption {
  id: string;
  text: string;
  position: number;
}

export interface PublicQuizQuestion {
  id: string;
  text: string;
  position: number;
  options: PublicQuizOption[];
}

export interface PublicQuiz {
  publicId: string;
  title: string;
  description: string | null;
  questionCount: number;
  questions: PublicQuizQuestion[];
}

export interface StartParticipationRequest {
  alias: string;
}

export interface StartParticipationResponse {
  participationId: string;
  participationToken: string;
  quizPublicId: string;
  alias: string;
  startedAt: string;
}

export interface SubmissionAnswer {
  questionId: string;
  optionId: string;
}

export interface SubmitParticipationRequest {
  answers: SubmissionAnswer[];
}

export interface ParticipationResult {
  participationId: string;
  alias: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  durationMs: number;
  completedAt: string;
}

export interface RankingEntry {
  position: number;
  alias: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  durationMs: number;
}

export interface RankingResponse {
  quizPublicId: string;
  generatedAt: string;
  entries: RankingEntry[];
}
