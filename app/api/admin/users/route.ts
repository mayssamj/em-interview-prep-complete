
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search ? {
      username: {
        contains: search,
      }
    } : {};

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          username: true,
          is_admin: true,
          created_at: true,
          updated_at: true,
          preferences: true,
        }
      }),
      prisma.users.count({ where })
    ]);

    return NextResponse.json({
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin,
        email: user.preferences && typeof user.preferences === 'object' && (user.preferences as any).email || null,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message.includes('required') ? 401 : 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { userId, isAdmin } = await request.json();

    if (!userId || typeof isAdmin !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { 
        is_admin: isAdmin,
        updated_at: new Date(),
      },
      select: {
        id: true,
        username: true,
        is_admin: true,
        updated_at: true,
      }
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        isAdmin: updatedUser.is_admin,
        updatedAt: updatedUser.updated_at,
      }
    });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message.includes('required') ? 401 : 500 }
    );
  }
}
