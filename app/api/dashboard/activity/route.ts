
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Get recent stories
    const recentStories = await prisma.stories.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        tags: true,
        created_at: true,
      },
    });

    // Get recent answers
    const recentAnswers = await prisma.answers.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 3,
      include: {
        questions: {
          select: {
            question_text: true,
            category: true,
          },
        },
      },
    });

    // Get recent interview notes
    const recentNotes = await prisma.interview_notes.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 2,
      select: {
        id: true,
        company: true,
        interviewer_name: true,
        created_at: true,
      },
    });

    // Combine and format activities
    const activities = [
      ...recentStories.map(story => ({
        id: story.id,
        type: 'story' as const,
        title: story.title,
        description: `STAR format story`,
        createdAt: story.created_at.toISOString(),
        tags: story.tags,
      })),
      ...recentAnswers.map(answer => ({
        id: answer.id,
        type: 'answer' as const,
        title: answer.questions.question_text.length > 60 
          ? answer.questions.question_text.substring(0, 60) + '...'
          : answer.questions.question_text,
        description: `Answered ${answer.questions.category} question`,
        createdAt: answer.created_at.toISOString(),
        tags: [answer.questions.category],
      })),
      ...recentNotes.map(note => ({
        id: note.id,
        type: 'note' as const,
        title: `${note.company} Interview`,
        description: note.interviewer_name 
          ? `Interview with ${note.interviewer_name}`
          : `Interview experience logged`,
        createdAt: note.created_at.toISOString(),
        tags: [note.company],
      })),
    ];

    // Sort by creation date and take top 5
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(activities.slice(0, 5));
  } catch (error) {
    console.error('Activity fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}
