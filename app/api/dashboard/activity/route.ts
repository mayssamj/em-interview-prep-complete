
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const user = await requireAuth();

    // Get recent stories
    const recentStories = await prisma.story.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        tags: true,
        createdAt: true,
      },
    });

    // Get recent answers
    const recentAnswers = await prisma.answer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        question: {
          select: {
            questionText: true,
            category: true,
          },
        },
      },
    });

    // Get recent interview notes
    const recentNotes = await prisma.interviewNote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 2,
      select: {
        id: true,
        company: true,
        interviewerName: true,
        createdAt: true,
      },
    });

    // Combine and format activities
    const activities = [
      ...recentStories.map(story => ({
        id: story.id,
        type: 'story' as const,
        title: story.title,
        description: `STAR format story`,
        createdAt: story.createdAt.toISOString(),
        tags: story.tags,
      })),
      ...recentAnswers.map(answer => ({
        id: answer.id,
        type: 'answer' as const,
        title: answer.question.questionText.length > 60 
          ? answer.question.questionText.substring(0, 60) + '...'
          : answer.question.questionText,
        description: `Answered ${answer.question.category} question`,
        createdAt: answer.createdAt.toISOString(),
        tags: [answer.question.category],
      })),
      ...recentNotes.map(note => ({
        id: note.id,
        type: 'note' as const,
        title: `${note.company} Interview`,
        description: note.interviewerName 
          ? `Interview with ${note.interviewerName}`
          : `Interview experience logged`,
        createdAt: note.createdAt.toISOString(),
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
