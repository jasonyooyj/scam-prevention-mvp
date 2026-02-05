/**
 * 브라우저 localStorage 기반 익명 세션 관리 유틸리티
 * SSR 환경을 고려하여 클라이언트 사이드에서만 동작
 */

const SESSION_KEY = 'scam_prevention_session_id';
const QUIZ_PROGRESS_KEY = 'scam_prevention_quiz_progress';

/**
 * UUID v4 형식의 세션 ID 생성
 * crypto.randomUUID()를 우선 사용하고, 미지원 환경에서는 폴백
 */
function generateUUID(): string {
  // 브라우저 crypto API 사용 (더 안전한 방식)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // 폴백: Math.random 기반 UUID v4 생성
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 클라이언트 사이드 환경인지 확인
 */
function isClient(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * 세션 ID 반환 (없으면 자동 생성)
 * SSR 환경에서는 빈 문자열 반환
 * @returns 세션 ID (UUID v4 형식) 또는 빈 문자열 (SSR)
 */
export function getSessionId(): string {
  if (!isClient()) {
    return '';
  }

  try {
    let sessionId = localStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      sessionId = generateUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
  } catch (error) {
    // localStorage 접근 실패 시 (private browsing 등)
    console.warn('Failed to access localStorage for session:', error);
    return generateUUID(); // 임시 세션 ID 반환
  }
}

/**
 * 세션 초기화 (localStorage에서 세션 ID 삭제)
 * SSR 환경에서는 아무 동작 없음
 */
export function clearSession(): void {
  if (!isClient()) {
    return;
  }

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.warn('Failed to clear session from localStorage:', error);
  }
}

/**
 * 현재 세션이 존재하는지 확인
 * @returns 세션 존재 여부
 */
export function hasSession(): boolean {
  if (!isClient()) {
    return false;
  }

  try {
    return localStorage.getItem(SESSION_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * 퀴즈 진행 상태 타입
 */
export interface QuizProgress {
  category: string;
  currentIndex: number;
  score: number;
  quizIds: number[];
  timestamp: number;
}

/**
 * 퀴즈 진행 상태 저장
 */
export function saveQuizProgress(progress: QuizProgress): void {
  if (!isClient()) return;

  try {
    localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('Failed to save quiz progress:', error);
  }
}

/**
 * 퀴즈 진행 상태 불러오기
 * 24시간이 지난 진행 상태는 무효화
 */
export function loadQuizProgress(category: string): QuizProgress | null {
  if (!isClient()) return null;

  try {
    const data = localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!data) return null;

    const progress: QuizProgress = JSON.parse(data);

    // 카테고리가 다르면 무시
    if (progress.category !== category) return null;

    // 24시간이 지난 진행 상태는 무효화
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (Date.now() - progress.timestamp > ONE_DAY) {
      clearQuizProgress();
      return null;
    }

    return progress;
  } catch (error) {
    console.warn('Failed to load quiz progress:', error);
    return null;
  }
}

/**
 * 퀴즈 진행 상태 삭제
 */
export function clearQuizProgress(): void {
  if (!isClient()) return;

  try {
    localStorage.removeItem(QUIZ_PROGRESS_KEY);
  } catch (error) {
    console.warn('Failed to clear quiz progress:', error);
  }
}
