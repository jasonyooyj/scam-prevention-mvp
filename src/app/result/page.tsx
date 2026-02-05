'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Shield, AlertTriangle, RotateCcw, Grid3X3, Share2, Check, BarChart3 } from 'lucide-react';
import { getSessionId } from '@/lib/session';
import NicknameDialog from '@/components/NicknameDialog';
import Confetti from '@/components/Confetti';
import { useSound } from '@/hooks/useSound';
import { toast } from 'sonner';

// 카테고리 정보
const categoryNames: Record<string, string> = {
  alba: '알바 사기',
  secondhand: '중고거래 사기',
  smishing: '스미싱',
  sns: 'SNS 사기',
  random: '전체 카테고리',
};

// 등급 정보
interface Grade {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  message: string;
  detectiveComment: string;
}

function getGrade(percentage: number): Grade {
  if (percentage === 100) {
    return {
      title: '사기 탐지 마스터',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      message: '완벽합니다!',
      detectiveComment: '오호! 자네, 내 조수로 들어오지 않겠나? 이 정도 실력이면 어떤 사기꾼도 자네를 속이지 못할 걸세!',
    };
  } else if (percentage >= 80) {
    return {
      title: '안전 시민',
      icon: Medal,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      message: '훌륭합니다!',
      detectiveComment: '음, 꽤 날카로운 눈을 가졌군! 대부분의 사기를 간파했어. 조금만 더 연습하면 완벽해질 걸세!',
    };
  } else if (percentage >= 60) {
    return {
      title: '주의 시민',
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      message: '나쁘지 않아요!',
      detectiveComment: '자네 잠재력은 있어! 하지만 사기꾼들은 점점 교묘해지고 있다네. 더 연습해서 완벽한 방어력을 갖추게!',
    };
  } else if (percentage >= 40) {
    return {
      title: '위험 노출자',
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      message: '조심하세요!',
      detectiveComment: '이런... 사기꾼들이 자네를 노리고 있을지도 몰라! 오늘 배운 것들을 꼭 기억하게. 다시 한번 도전해보는 건 어떤가?',
    };
  } else {
    return {
      title: '사기 취약자',
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      message: '위험해요!',
      detectiveComment: '큰일이야! 자네 이대로는 사기꾼들의 좋은 먹잇감이 될 수 있어! 하지만 걱정 마, 내가 도와줄게. 다시 한번 차근차근 배워보세!',
    };
  }
}

function ResultContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [showNicknameDialog, setShowNicknameDialog] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const dialogShownRef = useRef(false);
  const nicknameRef = useRef<string | null>(null);
  const { play: playCelebration } = useSound('/sounds/celebration.mp3', { volume: 0.5 });

  // URL 쿼리에서 파라미터 추출
  const score = parseInt(searchParams.get('score') || '0', 10);
  const total = parseInt(searchParams.get('total') || '5', 10);
  const category = searchParams.get('category') || 'random';

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const grade = getGrade(percentage);
  const GradeIcon = grade.icon;
  const categoryName = categoryNames[category] || category;

  // Save score function with toast feedback
  const saveScore = useCallback(async (nickname: string | null) => {
    if (scoreSaved) return;
    setScoreSaved(true);

    const sessionId = getSessionId();
    if (!sessionId) return;

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          nickname,
          category,
          score: percentage,
          correctCount: score,
          totalCount: total,
        }),
      });

      if (response.ok) {
        toast.success('점수가 저장되었습니다!', {
          description: '랭킹에서 순위를 확인해보세요.',
        });
      } else {
        throw new Error('점수 저장 실패');
      }
    } catch (error) {
      console.error('점수 저장 실패:', error);
      toast.error('점수 저장에 실패했습니다', {
        description: '잠시 후 다시 시도해주세요.',
      });
    }
  }, [category, percentage, score, total, scoreSaved]);

  // Handle nickname submission
  const handleNicknameSubmit = useCallback((nickname: string | null) => {
    nicknameRef.current = nickname;
    setShowNicknameDialog(false);
    saveScore(nickname);
  }, [saveScore]);

  // Show nickname dialog and confetti immediately (no delay)
  useEffect(() => {
    if (dialogShownRef.current) return;
    dialogShownRef.current = true;

    // Show confetti for high scores (80%+)
    if (percentage >= 80) {
      setShowConfetti(true);
      playCelebration();
    }

    // Show nickname dialog immediately
    setShowNicknameDialog(true);
  }, [percentage, playCelebration]);

  // 공유하기 기능
  const handleShare = async () => {
    const shareUrl = 'https://scam-prevention-mvp.vercel.app';
    const shareText = `[탐정 안속아] ${categoryName} 퀴즈 결과\n\n등급: ${grade.title}\n점수: ${score}/${total} (${percentage}%)\n\n나도 사기 탐지 능력 테스트하기!\n${shareUrl}`;

    // Try Web Share API first (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: '탐정 안속아 - 퀴즈 결과',
          text: `${grade.title} 등급! ${score}/${total} (${percentage}%) 정답`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or not supported, fall through to clipboard
        if ((err as Error).name !== 'AbortError') {
          console.log('Web Share failed, using clipboard');
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('클립보드에 복사되었습니다!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      toast.error('복사에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Confetti isActive={showConfetti} duration={4000} />
      <NicknameDialog
        isOpen={showNicknameDialog}
        onSubmit={handleNicknameSubmit}
      />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            퀴즈 결과
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {categoryName}
          </p>
        </header>

        {/* 결과 카드 */}
        <Card className="mb-8">
          <CardHeader className="text-center pb-4">
            <div className={`mx-auto p-6 rounded-full ${grade.bgColor} mb-4`}>
              <GradeIcon className={`h-16 w-16 ${grade.color}`} />
            </div>
            <CardTitle className={`text-2xl ${grade.color}`}>
              {grade.title}
            </CardTitle>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
              {grade.message}
            </p>
          </CardHeader>
          <CardContent>
            {/* 점수 표시 */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                {score} <span className="text-2xl text-slate-400">/ {total}</span>
              </div>
              <div className="text-xl text-slate-600 dark:text-slate-400">
                정답률 {percentage}%
              </div>
            </div>

            {/* 진행 바 */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-6">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  percentage === 100
                    ? 'bg-yellow-500'
                    : percentage >= 80
                    ? 'bg-blue-500'
                    : percentage >= 60
                    ? 'bg-green-500'
                    : percentage >= 40
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* 탐정 안속아 코멘트 */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border-l-4 border-slate-400 dark:border-slate-500">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                탐정 안속아의 한마디
              </p>
              <p className="text-slate-600 dark:text-slate-400 italic">
                &ldquo;{grade.detectiveComment}&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          {/* 다시 도전하기 */}
          <Link href={`/quiz/${category}`} className="block">
            <Button size="lg" className="w-full py-6 text-lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              다시 도전하기
            </Button>
          </Link>

          {/* 다른 카테고리 / 랭킹 보기 */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full py-6">
                <Grid3X3 className="h-5 w-5 mr-2" />
                다른 카테고리
              </Button>
            </Link>

            <Link href="/ranking">
              <Button variant="outline" size="lg" className="w-full py-6">
                <BarChart3 className="h-5 w-5 mr-2" />
                랭킹 보기
              </Button>
            </Link>
          </div>

          {/* 공유하기 */}
          <Button
            variant="outline"
            size="lg"
            className="w-full py-6"
            onClick={handleShare}
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 mr-2 text-green-500" />
                복사됨!
              </>
            ) : (
              <>
                <Share2 className="h-5 w-5 mr-2" />
                결과 공유하기
              </>
            )}
          </Button>
        </div>

        {/* 푸터 */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>피싱/스캠 예방을 위한 서비스 개발 경진대회 출품작</p>
        </footer>
      </main>
    </div>
  );
}

// Suspense로 감싸서 useSearchParams 사용
export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
          <div className="text-slate-600 dark:text-slate-400">로딩 중...</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
