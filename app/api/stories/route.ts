
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const stories = await prisma.story.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        situation: true,
        task: true,
        action: true,
        result: true,
        reflection: true,
        tags: true,
        categories: true,
        created_at: true,
        updated_at: true
      }
    });

    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Stories fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { title, situation, task, action, result, reflection, tags, categories } = await request.json();

    if (!title || !situation || !task || !action || !result) {
      return NextResponse.json(
        { error: 'Title, situation, task, action, and result are required' },
        { status: 400 }
      );
    }

    const story = await prisma.story.create({
      data: {
        id: uuidv4(),
        user_id: user.id,
        title,
        situation,
        task,
        action,
        result,
        reflection: reflection || null,
        tags: tags || [],
        categories: categories || [],
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'Story created successfully',
      story 
    });
  } catch (error) {
    console.error('Story creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
}
