
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Get total questions count
    const totalQuestions = await prisma.question.count();

    // Get answered questions count for this user
    const answeredQuestions = await prisma.answer.count({
      where: { user_id: user.id }
    });

    // Get total stories count for this user
    const totalStories = await prisma.story.count({
      where: { user_id: user.id }
    });

    // Get interview notes count for this user
    const interviewNotes = await prisma.interviewNote.count({
      where: { user_id: user.id }
    });

    // Calculate completion rate
    const completionRate = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    // Get recent activity (answers and stories created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAnswers = await prisma.answer.count({
      where: {
        user_id: user.id,
        created_at: {
          gte: sevenDaysAgo
        }
      }
    });

    const recentStories = await prisma.story.count({
      where: {
        user_id: user.id,
        created_at: {
          gte: sevenDaysAgo
        }
      }
    });

    const recentActivity = recentAnswers + recentStories;

    return NextResponse.json({
      totalQuestions,
      answeredQuestions,
      totalStories,
      interviewNotes,
      completionRate,
      recentActivity,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
