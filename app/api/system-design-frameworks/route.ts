
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    const frameworks = await prisma.systemDesignFramework.findMany({
      where,
      orderBy: [
        { difficulty: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(frameworks);
  } catch (error) {
    console.error('Error fetching system design frameworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system design frameworks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      category,
      keyPrinciples,
      useCases,
      tradeoffs,
      examples,
      resources,
      difficulty
    } = body;

    const framework = await prisma.systemDesignFramework.create({
      data: {
        name,
        description,
        category,
        keyPrinciples: keyPrinciples || [],
        useCases: useCases || [],
        tradeoffs: tradeoffs || [],
        examples: examples || [],
        resources: resources || [],
        difficulty: difficulty || 'Medium'
      }
    });

    return NextResponse.json(framework, { status: 201 });
  } catch (error) {
    console.error('Error creating system design framework:', error);
    return NextResponse.json(
      { error: 'Failed to create system design framework' },
      { status: 500 }
    );
  }
}
