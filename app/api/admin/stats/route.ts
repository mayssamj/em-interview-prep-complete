
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession(request);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get admin statistics
    const [userCount, storyCount, questionCount, companyCount] = await Promise.all([
      prisma.user.count(),
      prisma.story.count(),
      prisma.question.count(),
      prisma.company.count(),
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        username: true,
        is_admin: true,
        created_at: true,
      }
    });

    return NextResponse.json({
      userCount,
      storyCount,
      questionCount,
      companyCount,
      recentUsers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
