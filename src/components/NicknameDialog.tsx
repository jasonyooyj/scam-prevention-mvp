'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, User, AlertCircle } from 'lucide-react';

// Basic profanity filter (Korean and English)
const BLOCKED_WORDS = [
  '시발', '씨발', '개새끼', '병신', 'ㅅㅂ', 'ㅂㅅ', '미친놈', '지랄',
  'fuck', 'shit', 'ass', 'bitch', 'damn',
  '관리자', 'admin', 'root', 'system', '운영자',
];

function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BLOCKED_WORDS.some((word) => lowerText.includes(word.toLowerCase()));
}

interface NicknameDialogProps {
  onSubmit: (nickname: string | null) => void;
  isOpen: boolean;
}

export default function NicknameDialog({ onSubmit, isOpen }: NicknameDialogProps) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = nickname.trim();

    // Validation
    if (trimmed.length > 0) {
      if (trimmed.length < 2) {
        setError('닉네임은 2자 이상이어야 합니다.');
        return;
      }
      if (trimmed.length > 20) {
        setError('닉네임은 20자 이하여야 합니다.');
        return;
      }
      if (containsProfanity(trimmed)) {
        setError('사용할 수 없는 닉네임입니다.');
        return;
      }
    }

    setError(null);
    onSubmit(trimmed.length > 0 ? trimmed : null);
  };

  const handleSkip = () => {
    onSubmit(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
        <CardHeader className="relative pb-2">
          <button
            onClick={handleSkip}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">닉네임 등록</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            랭킹에 표시될 닉네임을 입력해주세요.
          </p>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="닉네임 (2-20자)"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              maxLength={20}
              className="w-full"
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              건너뛰기
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
            >
              등록하기
            </Button>
          </div>

          <p className="text-xs text-center text-slate-400">
            건너뛰면 &apos;익명 유저&apos;로 표시됩니다
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
