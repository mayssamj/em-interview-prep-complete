
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the 4 correct categories
const CATEGORIES = {
  'Distributed Systems & Infrastructure': 'distributed_systems_infrastructure',
  'Data & AI/ML Systems': 'data_ai_ml_systems', 
  'Real-time & Communication Systems': 'real_time_communication_systems',
  'Product & Platform Systems': 'product_platform_systems'
};

// Keywords to help categorize questions
const CATEGORY_KEYWORDS = {
  'distributed_systems_infrastructure': [
    'distributed cache', 'cdn', 'load balancer', 'monitoring', 'infrastructure',
    'distributed system', 'microservices', 'service mesh', 'api gateway',
    'distributed storage', 'distributed database', 'sharding', 'replication'
  ],
  'data_ai_ml_systems': [
    'search engine', 'recommendation', 'machine learning', 'ai', 'ml', 'data pipeline',
    'analytics', 'big data', 'data warehouse', 'etl', 'recommendation system',
    'search', 'indexing', 'ranking', 'personalization'
  ],
  'real_time_communication_systems': [
    'chat', 'messaging', 'real-time', 'streaming', 'video', 'audio', 'live',
    'notification', 'websocket', 'pubsub', 'event streaming', 'collaboration',
    'social network', 'feed', 'timeline', 'news feed'
  ],
  'product_platform_systems': [
    'e-commerce', 'marketplace', 'booking', 'ride sharing', 'payment',
    'uber', 'airbnb', 'amazon', 'shopping', 'product catalog', 'inventory',
    'maps', 'location', 'geospatial', 'platform', 'startup'
  ]
};

function categorizeQuestion(questionText) {
  const text = questionText.toLowerCase();
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }
  
  // Default to distributed systems if no match
  return 'distributed_systems_infrastructure';
}

function getCategoryDisplayName(categoryKey) {
  return Object.keys(CATEGORIES).find(key => CATEGORIES[key] === categoryKey);
}

async function fixSystemDesignCategories() {
  try {
    console.log('Starting system design category cleanup...');
    
    // 1. Find all malformed questions with "Design System N for..." pattern
    const malformedQuestions = await prisma.question.findMany({
      where: {
        question_text: {
          contains: 'Design System',
          mode: 'insensitive'
        },
        question_type: 'system_design'
      }
    });
    
    console.log(`Found ${malformedQuestions.length} potentially malformed questions`);
    
    // Filter for actual malformed ones (Design System N for...)
    const actuallyMalformed = malformedQuestions.filter(q => 
      /Design System \d+ for/.test(q.question_text)
    );
    
    console.log(`Found ${actuallyMalformed.length} actually malformed questions to delete`);
    
    // 2. Delete malformed questions
    if (actuallyMalformed.length > 0) {
      const malformedIds = actuallyMalformed.map(q => q.id);
      
      // Delete related records first
      await prisma.systemDesignQuestion.deleteMany({
        where: { question_id: { in: malformedIds } }
      });
      
      await prisma.systemDesignAnswer.deleteMany({
        where: { question_id: { in: malformedIds } }
      });
      
      await prisma.answer.deleteMany({
        where: { question_id: { in: malformedIds } }
      });
      
      await prisma.progress.deleteMany({
        where: { question_id: { in: malformedIds } }
      });
      
      await prisma.questionView.deleteMany({
        where: { question_id: { in: malformedIds } }
      });
      
      // Delete the questions
      await prisma.question.deleteMany({
        where: { id: { in: malformedIds } }
      });
      
      console.log(`Deleted ${actuallyMalformed.length} malformed questions`);
    }
    
    // 3. Get all remaining system design questions that need recategorization
    const questionsToFix = await prisma.question.findMany({
      where: {
        question_type: 'system_design',
        OR: [
          { category: 'distributed_systems' },
          { category: { endsWith: '___infrastructure' } },
          { category: { endsWith: '___ai_ml_systems' } },
          { category: { endsWith: '___communication_systems' } },
          { category: { endsWith: '___platform_systems' } }
        ]
      }
    });
    
    console.log(`Found ${questionsToFix.length} questions to recategorize`);
    
    // 4. Recategorize each question
    let updated = 0;
    for (const question of questionsToFix) {
      const newCategory = categorizeQuestion(question.question_text);
      const newCategoryDisplay = getCategoryDisplayName(newCategory);
      
      await prisma.question.update({
        where: { id: question.id },
        data: {
          category: newCategory,
          categories: [newCategoryDisplay],
          updated_at: new Date()
        }
      });
      
      updated++;
      if (updated % 20 === 0) {
        console.log(`Updated ${updated}/${questionsToFix.length} questions...`);
      }
    }
    
    console.log(`Successfully updated ${updated} questions`);
    
    // 5. Show final category distribution
    const finalDistribution = await prisma.question.groupBy({
      by: ['category'],
      where: { question_type: 'system_design' },
      _count: { category: true }
    });
    
    console.log('\n=== FINAL CATEGORY DISTRIBUTION ===');
    finalDistribution.forEach(cat => {
      const displayName = getCategoryDisplayName(cat.category) || cat.category;
      console.log(`${displayName}: ${cat._count.category} questions`);
    });
    
    console.log('\nCategory cleanup completed successfully!');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSystemDesignCategories();
