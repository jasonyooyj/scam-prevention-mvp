'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, RotateCcw } from 'lucide-react';

interface ResumeQuizDialogProps {
  isOpen: boolean;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  onResume: () => void;
  onRestart: () => void;
}

export default function ResumeQuizDialog({
  isOpen,
  currentIndex,
  totalQuestions,
  score,
  onResume,
  onRestart,
}: ResumeQuizDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <PlayCircle className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-lg">이전 진행 기록 발견!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 space-y-1">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              진행: <span className="font-medium text-slate-900 dark:text-slate-100">{currentIndex} / {totalQuestions}</span> 문제
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              현재 점수: <span className="font-medium text-slate-900 dark:text-slate-100">{score}점</span>
            </p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            이어서 진행하시겠습니까?
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onRestart}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              처음부터
            </Button>
            <Button
              onClick={onResume}
              className="flex-1"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              이어하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
