
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { title, situation, task, action, result, reflection, tags, categories } = await request.json();

    if (!title?.trim() || !situation?.trim() || !task?.trim() || !action?.trim() || !result?.trim()) {
      return NextResponse.json(
        { error: 'Title, situation, task, action, and result are required' },
        { status: 400 }
      );
    }

    const story = await prisma.story.create({
      data: {
        userId: user.id,
        title: title.trim(),
        situation: situation.trim(),
        task: task.trim(),
        action: action.trim(),
        result: result.trim(),
        reflection: reflection?.trim() || null,
        tags: tags || [],
        categories: categories || [],
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Story creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    const where: any = { userId: user.id };
    
    if (category) {
      where.categories = { has: category };
    }
    
    if (tag) {
      where.tags = { has: tag };
    }

    const stories = await prisma.story.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Stories fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}
