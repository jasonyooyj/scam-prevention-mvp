'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header skeleton */}
        <header className="mb-8">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-6 w-16" />
          </div>
        </header>

        {/* Progress bar skeleton */}
        <Skeleton className="w-full h-2 rounded-full mb-8" />

        {/* Quiz card skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            {/* Message content skeleton */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Answer buttons skeleton */}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Score skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-5 w-24" />
        </div>
      </main>
    </div>
  );
}
