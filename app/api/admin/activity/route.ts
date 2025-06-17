
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get recent activity data
    const [recentUsers, recentStories, recentQuestions] = await Promise.all([
      prisma.users.findMany({
        where: {
          created_at: {
            gte: startDate,
          }
        },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          username: true,
          created_at: true,
          is_admin: true,
        }
      }),
      prisma.stories.findMany({
        where: {
          created_at: {
            gte: startDate,
          }
        },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          created_at: true,
          user_id: true,
        }
      }),
      prisma.questions.count({
        where: {
          created_at: {
            gte: startDate,
          }
        }
      })
    ]);

    // Get daily user registrations for the chart
    const dailyRegistrations = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users 
      WHERE created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return NextResponse.json({
      recentUsers,
      recentStories,
      recentQuestions,
      dailyRegistrations,
      period: {
        days,
        startDate,
        endDate: new Date(),
      }
    });
  } catch (error) {
    console.error('Admin activity error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message.includes('required') ? 401 : 500 }
    );
  }
}
