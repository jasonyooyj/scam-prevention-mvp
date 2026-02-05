'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ExitConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExitConfirmDialog({ isOpen, onConfirm, onCancel }: ExitConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <CardTitle className="text-lg">퀴즈를 종료하시겠습니까?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            지금 나가시면 현재까지의 진행 상황이 저장되지 않습니다.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              계속하기
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="flex-1"
            >
              나가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
