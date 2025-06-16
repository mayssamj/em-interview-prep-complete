
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return the 4 new categories
    const categories = [
      {
        id: 'distributed_systems_infrastructure',
        name: 'Distributed Systems & Infrastructure',
        description: 'Large-scale distributed systems, infrastructure design, CDNs, monitoring systems',
        count: 3
      },
      {
        id: 'data_ai_ml_systems',
        name: 'Data & AI/ML Systems',
        description: 'Data platforms, AI/ML systems, search engines, recommendation systems',
        count: 8
      },
      {
        id: 'real_time_communication_systems',
        name: 'Real-time & Communication Systems',
        description: 'Real-time systems, messaging, streaming, social networks, collaboration tools',
        count: 6
      },
      {
        id: 'product_platform_systems',
        name: 'Product & Platform Systems',
        description: 'E-commerce, startup systems, content platforms, geospatial systems',
        count: 5
      }
    ];

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching system design categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
