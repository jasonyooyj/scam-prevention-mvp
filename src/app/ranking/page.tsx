'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Medal, Award, User, Loader2, BarChart3 } from 'lucide-react';
import { getSessionId } from '@/lib/session';

// 카테고리 정보
const categoryNames: Record<string, string> = {
  alba: '알바 사기',
  secondhand: '중고거래 사기',
  smishing: '스미싱',
  sns: 'SNS 사기',
  random: '전체',
  all: '전체',
};

const categoryColors: Record<string, string> = {
  alba: 'bg-blue-500',
  secondhand: 'bg-green-500',
  smishing: 'bg-orange-500',
  sns: 'bg-purple-500',
  random: 'bg-slate-500',
  all: 'bg-slate-500',
};

interface ScoreEntry {
  id: number;
  sessionId: string;
  category: string;
  score: number;
  correctCount: number;
  totalCount: number;
  createdAt: string;
}

interface MyBestScore {
  category: string;
  bestScore: number;
  totalAttempts: number;
}

interface CategoryStat {
  category: string;
  totalPlayers: number;
  avgScore: number;
  totalAttempts: number;
}

interface RankingData {
  topScores: ScoreEntry[];
  myBestScores: MyBestScore[] | null;
  categoryStats: CategoryStat[];
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
  return <span className="text-slate-500 font-mono w-5 text-center">{rank}</span>;
}

export default function RankingPage() {
  const [data, setData] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sessionId, setSessionId] = useState<string>('');

  // 세션 ID 가져오기
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // 랭킹 데이터 가져오기
  useEffect(() => {
    async function fetchRanking() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        if (sessionId) {
          params.append('sessionId', sessionId);
        }

        const response = await fetch(`/api/ranking?${params.toString()}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || '랭킹을 불러오는데 실패했습니다.');
        }

        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchRanking();
  }, [selectedCategory, sessionId]);

  const categories = ['all', 'smishing', 'secondhand', 'alba', 'sns'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 헤더 */}
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              랭킹
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            사기 탐지 실력을 겨뤄보세요!
          </p>
        </header>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-sm"
            >
              {categoryNames[cat]}
            </Button>
          ))}
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-600 dark:text-slate-400" />
            <p className="text-slate-600 dark:text-slate-400">랭킹을 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <Card className="mb-6">
            <CardContent className="py-8 text-center">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* 랭킹 데이터 */}
        {!loading && !error && data && (
          <div className="space-y-6">
            {/* 내 최고 점수 */}
            {data.myBestScores && data.myBestScores.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    내 최고 점수
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {data.myBestScores.map((score) => (
                      <div
                        key={score.category}
                        className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${categoryColors[score.category] || 'bg-slate-500'}`} />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {categoryNames[score.category]}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                          {score.bestScore}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {score.totalAttempts}회 도전
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 카테고리 통계 */}
            {data.categoryStats && data.categoryStats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">카테고리별 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.categoryStats.map((stat) => (
                      <div
                        key={stat.category}
                        className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${categoryColors[stat.category] || 'bg-slate-500'}`} />
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {categoryNames[stat.category]}
                          </span>
                        </div>
                        <div className="text-right text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            평균 {stat.avgScore}%
                          </span>
                          <span className="text-slate-400 mx-2">|</span>
                          <span className="text-slate-500">
                            {stat.totalPlayers}명 참여
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TOP 10 랭킹 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  TOP 10
                  {selectedCategory !== 'all' && (
                    <span className={`text-sm px-2 py-0.5 rounded-full text-white ${categoryColors[selectedCategory]}`}>
                      {categoryNames[selectedCategory]}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.topScores.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    아직 기록이 없습니다. 첫 번째 도전자가 되어보세요!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.topScores.map((score, index) => {
                      const isMe = score.sessionId === sessionId;
                      return (
                        <div
                          key={score.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isMe
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-slate-50 dark:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(index + 1)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                익명 유저
                              </span>
                              {isMe && (
                                <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded">
                                  나
                                </span>
                              )}
                              {selectedCategory === 'all' && (
                                <span className={`text-xs px-1.5 py-0.5 rounded text-white ${categoryColors[score.category]}`}>
                                  {categoryNames[score.category]}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">
                              {score.correctCount}/{score.totalCount} 정답
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-slate-900 dark:text-slate-50">
                              {score.score}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 퀴즈 시작 버튼 */}
        <div className="mt-8">
          <Link href="/">
            <Button size="lg" className="w-full py-6 text-lg">
              퀴즈 도전하기
            </Button>
          </Link>
        </div>

        {/* 푸터 */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>피싱/스캠 예방을 위한 서비스 개발 경진대회 출품작</p>
        </footer>
      </main>
    </div>
  );
}
