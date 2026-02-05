'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Target, Briefcase, ShoppingBag, MessageSquare, Users, ArrowRight, X } from 'lucide-react';

const ONBOARDING_KEY = 'hasSeenOnboarding';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  content?: React.ReactNode;
}

const steps: OnboardingStep[] = [
  {
    title: '탐정 안속아에 오신 걸 환영합니다!',
    description: '사기 예방 훈련을 통해 당신의 탐지 능력을 키워보세요.',
    icon: <Search className="h-12 w-12 text-primary" />,
    content: (
      <div className="text-center space-y-2 text-slate-600 dark:text-slate-400">
        <p>실제 피싱/스캠 사례를 바탕으로</p>
        <p>사기 메시지를 판별하는 능력을 테스트합니다.</p>
      </div>
    ),
  },
  {
    title: '플레이 방법',
    description: '메시지를 보고 사기인지 판별하세요!',
    icon: <Target className="h-12 w-12 text-primary" />,
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="w-20 h-10 flex items-center justify-center border-2 border-red-400 text-red-600 rounded-lg text-sm font-medium">
            사기다
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            의심스러운 메시지라면 선택
          </p>
        </div>
        <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="w-20 h-10 flex items-center justify-center border-2 border-green-400 text-green-600 rounded-lg text-sm font-medium">
            아니다
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            정상적인 메시지라면 선택
          </p>
        </div>
        <p className="text-center text-sm text-slate-500">
          정답 후 AI 해설로 자세한 분석을 확인할 수 있어요!
        </p>
      </div>
    ),
  },
  {
    title: '4가지 사기 유형',
    description: '다양한 카테고리로 훈련하세요!',
    icon: null,
    content: (
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Briefcase className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">알바 사기</p>
            <p className="text-xs text-slate-500">고수익 알바 유혹</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
          <ShoppingBag className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">중고거래</p>
            <p className="text-xs text-slate-500">안전결제 위장</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
          <MessageSquare className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">스미싱</p>
            <p className="text-xs text-slate-500">택배/기관 사칭</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
          <Users className="h-5 w-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">SNS 사기</p>
            <p className="text-xs text-slate-500">투자/로맨스 스캠</p>
          </div>
        </div>
      </div>
    ),
  },
];

interface OnboardingModalProps {
  onComplete?: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
    onComplete?.();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-md animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header with skip button */}
        <div className="flex justify-end p-3 pb-0">
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            aria-label="건너뛰기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <CardContent className="px-6 pb-6 pt-2">
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-4 bg-primary/50'
                    : 'w-4 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div
            className={`transition-all duration-150 ${
              isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
            }`}
          >
            {/* Icon */}
            {step.icon && (
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  {step.icon}
                </div>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-center text-slate-900 dark:text-slate-50 mb-2">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
              {step.description}
            </p>

            {/* Custom content */}
            {step.content && <div className="mb-6">{step.content}</div>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              건너뛰기
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {isLastStep ? '시작하기' : '다음'}
              {!isLastStep && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>

          {/* Step counter */}
          <p className="text-center text-xs text-slate-400 mt-4">
            {currentStep + 1} / {steps.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
