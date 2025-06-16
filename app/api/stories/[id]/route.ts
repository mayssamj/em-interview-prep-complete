
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);

    const story = await prisma.story.findFirst({
      where: {
        id: params.id,
        user_id: user.id
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Story fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { title, situation, task, action, result, reflection, tags, categories } = await request.json();

    const story = await prisma.story.updateMany({
      where: {
        id: params.id,
        user_id: user.id
      },
      data: {
        title,
        situation,
        task,
        action,
        result,
        reflection: reflection || null,
        tags: tags || [],
        categories: categories || [],
        updated_at: new Date()
      }
    });

    if (story.count === 0) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Story updated successfully' 
    });
  } catch (error) {
    console.error('Story update error:', error);
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);

    const result = await prisma.story.deleteMany({
      where: {
        id: params.id,
        user_id: user.id
      }
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Story deleted successfully' 
    });
  } catch (error) {
    console.error('Story deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
