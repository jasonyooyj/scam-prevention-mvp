'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ShoppingBag, MessageSquare, Users, BarChart3 } from 'lucide-react';

const categories = [
  {
    id: 'alba',
    title: '알바 사기',
    description: '고수익 알바, 선입금 요구 등',
    icon: Briefcase,
    color: 'bg-blue-500',
  },
  {
    id: 'secondhand',
    title: '중고거래 사기',
    description: '안전결제 위장, 가품 판매 등',
    icon: ShoppingBag,
    color: 'bg-green-500',
  },
  {
    id: 'smishing',
    title: '스미싱',
    description: '택배 사칭, 기관 사칭 문자 등',
    icon: MessageSquare,
    color: 'bg-orange-500',
  },
  {
    id: 'sns',
    title: 'SNS 사기',
    description: '투자 유혹, 로맨스 스캠 등',
    icon: Users,
    color: 'bg-purple-500',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        본문으로 바로가기
      </a>

      <main id="main-content" className="container mx-auto px-4 py-12 max-w-4xl" role="main">
        {/* 헤더 섹션 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            탐정 안속아
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-2">
            피싱/스캠 예방 퀴즈
          </p>
          <p className="text-slate-500 dark:text-slate-500 max-w-lg mx-auto">
            실제 사례를 바탕으로 사기 메시지를 판별하는 능력을 키워보세요.
            <br />
            당신의 사기 탐지 능력은 몇 점일까요?
          </p>
        </header>

        {/* 카테고리 선택 섹션 */}
        <section className="mb-12" aria-labelledby="category-heading">
          <h2 id="category-heading" className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6 text-center">
            카테고리를 선택하세요
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/quiz/${category.id}`}
                  role="listitem"
                  aria-label={`${category.title} 퀴즈 시작하기: ${category.description}`}
                >
                  <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 h-full focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category.color}`} aria-hidden="true">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{category.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 전체 시작 버튼 */}
        <section className="text-center space-y-4" aria-label="퀴즈 시작">
          <Link href="/quiz/random">
            <Button size="lg" className="px-8 py-6 text-lg focus:ring-2 focus:ring-primary focus:ring-offset-2">
              전체 카테고리로 시작하기
            </Button>
          </Link>
          <p className="text-sm text-slate-500" aria-live="polite">
            모든 카테고리에서 랜덤하게 문제가 출제됩니다
          </p>
          <div className="pt-4">
            <Link href="/ranking" aria-label="전체 랭킹 보기">
              <Button variant="outline" size="lg" className="px-6 focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <BarChart3 className="h-5 w-5 mr-2" aria-hidden="true" />
                랭킹 보기
              </Button>
            </Link>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="mt-16 text-center text-sm text-slate-400" role="contentinfo">
          <p>피싱/스캠 예방을 위한 서비스 개발 경진대회 출품작</p>
        </footer>
      </main>
    </div>
  );
}
