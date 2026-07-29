const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1')
  .replace(/\/$/, '')

export type InterviewSession = {
  id: string
  job_role: string
  company: string | null
  interview_type: string
  difficulty: string
  duration_minutes: number
  status: string
  created_at: string
  updated_at: string
}

export type LiveQuestion = {
  id: string
  parent_question_id: string | null
  sequence: number
  kind: string
  status: string
  question: string
  competency: string
  question_metadata: Record<string, unknown>
  follow_up_count: number
  asked_at: string | null
  answered_at: string | null
}

export type LiveAnswer = {
  id: string
  question_id: string
  answer: string
  created_at: string
}

export type LiveInterviewState = {
  interview_session_id: string
  status: string
  current_question: LiveQuestion | null
  questions: LiveQuestion[]
  answers: LiveAnswer[]
  answered_count: number
  skipped_count: number
  total_questions: number
  progress_percent: number
}

export type AnswerEvaluation = {
  id: string
  question_id: string
  answer_id: string
  rubric_type: string
  correctness: number
  relevance: number
  depth: number
  clarity: number
  grounding: number
  overall_score: number
  strengths: string[]
  gaps: string[]
  unsupported_claims: string[]
  improved_answer: string
}

export type InterviewFeedback = {
  id: string
  interview_session_id: string
  status: string
  overall_score: number
  competency_scores: Record<string, number>
  strengths: string[]
  improvement_areas: string[]
  summary: string
  next_steps: string[]
  answered_questions: number
  skipped_questions: number
  generated_at: string
  answer_evaluations: AnswerEvaluation[]
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'
    try {
      const body = (await response.json()) as { detail?: string }
      if (body.detail) message = body.detail
    } catch {
      // Keep the safe fallback for non-JSON provider and proxy errors.
    }
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

export const interviewApi = {
  createSession: (payload: {
    job_role: string
    company: string | null
    interview_type: string
    difficulty: string
    duration_minutes: number
  }) =>
    request<InterviewSession>('/interview-sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listSessions: () => request<InterviewSession[]>('/interview-sessions'),

  uploadDocument: (sessionId: string, documentType: 'resume' | 'job_description', file: File) => {
    const body = new FormData()
    body.append('interview_session_id', sessionId)
    body.append('document_type', documentType)
    body.append('file', file)
    return request(`/documents`, { method: 'POST', body })
  },

  start: (sessionId: string, questionCount: number, focusAreas: string[]) =>
    request<LiveInterviewState>(`/interview-sessions/${sessionId}/live/start`, {
      method: 'POST',
      body: JSON.stringify({ question_count: questionCount, focus_areas: focusAreas }),
    }),

  getLiveState: (sessionId: string) =>
    request<LiveInterviewState>(`/interview-sessions/${sessionId}/live`),

  answer: (sessionId: string, questionId: string, answer: string) =>
    request<LiveInterviewState>(
      `/interview-sessions/${sessionId}/live/questions/${questionId}/answer`,
      { method: 'POST', body: JSON.stringify({ answer }) },
    ),

  skip: (sessionId: string, questionId: string) =>
    request<LiveInterviewState>(
      `/interview-sessions/${sessionId}/live/questions/${questionId}/skip`,
      { method: 'POST' },
    ),

  action: (sessionId: string, action: 'pause' | 'resume' | 'complete') =>
    request<LiveInterviewState>(`/interview-sessions/${sessionId}/live/${action}`, {
      method: 'POST',
    }),

  generateFeedback: (sessionId: string) =>
    request<InterviewFeedback>(`/interview-sessions/${sessionId}/feedback/generate`, {
      method: 'POST',
      body: JSON.stringify({ force: false }),
    }),

  getFeedback: (sessionId: string) =>
    request<InterviewFeedback>(`/interview-sessions/${sessionId}/feedback`),
}

export function apiErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}
