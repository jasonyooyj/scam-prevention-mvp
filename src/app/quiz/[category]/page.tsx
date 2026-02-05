'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { categoryLabels } from '@/data/quizzes';
import { useSound, useVibration } from '@/hooks/useSound';

// DB에서 가져오는 퀴즈 타입
interface QuizFromDB {
  id: number;
  category: string;
  content: string;
  isScam: boolean;
  explanation: string | null;
  scamPoints: string[] | null;
  createdAt: string | null;
}

// 카테고리별 색상
const categoryColors: Record<string, string> = {
  alba: 'bg-blue-500',
  secondhand: 'bg-green-500',
  smishing: 'bg-orange-500',
  sns: 'bg-purple-500',
  random: 'bg-slate-500',
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function QuizPage({ params }: PageProps) {
  const { category } = use(params);
  const router = useRouter();

  // 퀴즈 데이터 상태
  const [quizzes, setQuizzes] = useState<QuizFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 퀴즈 진행 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // AI 해설 상태
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiExplanation, setShowAiExplanation] = useState(false);

  // Animation state
  const [answerAnimation, setAnswerAnimation] = useState<'correct' | 'incorrect' | null>(null);

  // Sound and haptic hooks
  const { play: playCorrect } = useSound('/sounds/correct.mp3', { volume: 0.5 });
  const { play: playIncorrect } = useSound('/sounds/incorrect.mp3', { volume: 0.5 });
  const { vibrate } = useVibration();

  // API에서 퀴즈 가져오기
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/quiz?category=${category}&limit=10`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || '퀴즈를 불러오는데 실패했습니다.');
        }

        if (data.data.length === 0) {
          throw new Error('해당 카테고리에 퀴즈가 없습니다. 먼저 npm run db:seed를 실행해주세요.');
        }

        setQuizzes(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, [category]);

  const currentQuiz = quizzes[currentIndex];
  const totalQuestions = quizzes.length;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // 정답 선택 핸들러
  const handleAnswer = (answer: boolean) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);
    setAiExplanation(null);
    setShowAiExplanation(false);

    const correct = answer === currentQuiz.isScam;
    if (correct) {
      setScore((prev) => prev + 1);
      playCorrect();
      vibrate(50);
      setAnswerAnimation('correct');
    } else {
      playIncorrect();
      vibrate([50, 30, 50]); // double vibration for wrong
      setAnswerAnimation('incorrect');
    }

    // Clear animation after it plays
    setTimeout(() => setAnswerAnimation(null), 600);
  };

  // AI 해설 요청
  const handleAiExplanation = async () => {
    if (aiLoading || aiExplanation) {
      setShowAiExplanation(true);
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentQuiz.content,
          isScam: currentQuiz.isScam,
          scamPoints: currentQuiz.scamPoints || [],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiExplanation(data.explanation);
        setShowAiExplanation(true);
      } else {
        throw new Error(data.error || 'AI 해설 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('AI 해설 오류:', err);
      setAiExplanation('AI 해설을 생성하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      setShowAiExplanation(true);
    } finally {
      setAiLoading(false);
    }
  };

  // 다음 문제로 이동
  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      // 퀴즈 완료 - 결과 페이지로 이동
      router.push(`/result?score=${score}&total=${totalQuestions}&category=${category}`);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAiExplanation(null);
      setShowAiExplanation(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-600 dark:text-slate-400" />
          <p className="text-slate-600 dark:text-slate-400">퀴즈를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link href="/">
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 퀴즈가 없는 경우
  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">퀴즈를 찾을 수 없습니다.</p>
          <Link href="/">
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuiz.isScam;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Skip to quiz content */}
      <a
        href="#quiz-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        퀴즈로 바로가기
      </a>

      <main className="container mx-auto px-4 py-8 max-w-2xl" role="main">
        {/* 헤더 */}
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            홈으로 돌아가기
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${categoryColors[category] || categoryColors.random}`}>
                {categoryLabels[category] || '퀴즈'}
              </div>
            </div>
            <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              {currentIndex + 1} / {totalQuestions}
            </div>
          </div>
        </header>

        {/* 진행률 바 */}
        <div
          className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-8"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
          aria-label={`퀴즈 진행률: ${totalQuestions}문제 중 ${currentIndex + 1}번째`}
        >
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 퀴즈 카드 */}
        <Card id="quiz-content" className="mb-6" tabIndex={-1}>
          <CardHeader>
            <CardTitle className="text-base text-slate-500 dark:text-slate-400">
              아래 메시지가 사기인지 판별하세요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {currentQuiz.content}
              </p>
            </div>

            {/* 답변 버튼 */}
            {!showResult && (
              <div className="grid grid-cols-2 gap-4" role="group" aria-label="답변 선택">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 text-lg border-2 hover:border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => handleAnswer(true)}
                  aria-label="이 메시지는 사기입니다"
                >
                  사기다
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 text-lg border-2 hover:border-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={() => handleAnswer(false)}
                  aria-label="이 메시지는 정상입니다"
                >
                  아니다
                </Button>
              </div>
            )}

            {/* 결과 표시 */}
            {showResult && (
              <div className="space-y-4" aria-live="polite">
                {/* 정답 여부 */}
                <div
                  role="alert"
                  aria-label={isCorrect ? '정답입니다' : '틀렸습니다'}
                  className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                    answerAnimation === 'correct' ? 'animate-correct' :
                    answerAnimation === 'incorrect' ? 'animate-incorrect' : ''
                  } ${
                    isCorrect
                      ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-6 w-6" aria-hidden="true" />
                      <span className="font-semibold text-lg">정답입니다!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6" aria-hidden="true" />
                      <span className="font-semibold text-lg">틀렸습니다</span>
                    </>
                  )}
                </div>

                {/* 정답 안내 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    정답: <span className="font-semibold">{currentQuiz.isScam ? '사기다' : '정상 메시지'}</span>
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {currentQuiz.explanation}
                  </p>

                  {/* 사기 판별 포인트 */}
                  {currentQuiz.isScam && currentQuiz.scamPoints && currentQuiz.scamPoints.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        사기 판별 포인트
                      </p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {currentQuiz.scamPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* AI 해설 버튼 */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAiExplanation}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      AI 해설 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {showAiExplanation ? 'AI 해설 숨기기' : 'AI 해설 보기'}
                    </>
                  )}
                </Button>

                {/* AI 해설 표시 */}
                {showAiExplanation && aiExplanation && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4" />
                      탐정 안속아의 AI 해설
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {aiExplanation}
                    </p>
                  </div>
                )}

                {/* 다음 버튼 */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleNext}
                >
                  {currentIndex + 1 >= totalQuestions ? '결과 보기' : '다음 문제'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 현재 점수 */}
        <div className="text-center text-slate-500 dark:text-slate-400">
          현재 점수: {score}점
        </div>
      </main>
    </div>
  );
}
