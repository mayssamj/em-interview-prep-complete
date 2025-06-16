
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get actual counts from database
    const categoryCounts = await prisma.questions.groupBy({
      by: ['category'],
      where: { question_type: 'system_design' },
      _count: { category: true }
    });

    // Map database categories to display categories
    const categoryMap = {
      'Distributed Systems & Infrastructure': {
        id: 'distributed_systems_infrastructure',
        name: 'Distributed Systems & Infrastructure',
        description: 'Large-scale distributed systems, infrastructure design, CDNs, monitoring systems'
      },
      'Data & AI/ML Systems': {
        id: 'data_ai_ml_systems',
        name: 'Data & AI/ML Systems', 
        description: 'Data platforms, AI/ML systems, search engines, recommendation systems'
      },
      'Real-time & Communication Systems': {
        id: 'real_time_communication_systems',
        name: 'Real-time & Communication Systems',
        description: 'Real-time systems, messaging, streaming, social networks, collaboration tools'
      },
      'Product & Platform Systems': {
        id: 'product_platform_systems',
        name: 'Product & Platform Systems',
        description: 'E-commerce, startup systems, content platforms, geospatial systems'
      }
    };

    // Build categories with actual counts
    const categories = Object.entries(categoryMap).map(([dbCategory, info]) => {
      const countData = categoryCounts.find(c => c.category === dbCategory);
      return {
        id: info.id,
        name: info.name,
        description: info.description,
        count: countData?._count.category || 0
      };
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching system design categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
