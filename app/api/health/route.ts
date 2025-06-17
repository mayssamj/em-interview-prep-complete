
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    const dbResponseTime = Date.now() - startTime;
    
    // Get basic system stats
    const [userCount, questionCount, storyCount, companyCount] = await Promise.all([
      prisma.users.count(),
      prisma.questions.count(),
      prisma.stories.count(),
      prisma.companies.count(),
    ]);
    
    const totalResponseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'connected',
        responseTime: `${dbResponseTime}ms`,
      },
      stats: {
        users: userCount,
        questions: questionCount,
        stories: storyCount,
        companies: companyCount,
      },
      performance: {
        totalResponseTime: `${totalResponseTime}ms`,
      },
      features: {
        authentication: true,
        rateLimit: true,
        securityHeaders: true,
        inputValidation: true,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      database: {
        status: 'disconnected',
      },
    }, { status: 503 });
  }
}
