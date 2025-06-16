
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the new 4 categories and their mappings based on question content
const categoryMappings = {
  // Distributed Systems & Infrastructure
  'distributed_systems_infrastructure': [
    'cdn', 'content delivery', 'infrastructure', 'monitoring', 'distributed', 'news feed'
  ],
  
  // Data & AI/ML Systems  
  'data_ai_ml_systems': [
    'ai', 'ml', 'machine learning', 'recommendation', 'algorithm', 'gpt', 'language model', 
    'data warehouse', 'data labeling', 'search', 'ranking', 'tiktok', 'netflix'
  ],
  
  // Real-time & Communication Systems
  'real_time_communication_systems': [
    'real-time', 'chat', 'messaging', 'streaming', 'video', 'youtube', 'uber', 'ride matching',
    'co-authoring', 'collaboration', 'messenger'
  ],
  
  // Product & Platform Systems
  'product_platform_systems': [
    'startup', 'mvp', 'e-commerce', 'maps', 'reddit', 'content ranking', 'moderation'
  ]
};

function categorizeQuestion(questionText) {
  const text = questionText.toLowerCase();
  
  // Check each category for keyword matches
  for (const [category, keywords] of Object.entries(categoryMappings)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        switch (category) {
          case 'distributed_systems_infrastructure':
            return ['Distributed Systems & Infrastructure'];
          case 'data_ai_ml_systems':
            return ['Data & AI/ML Systems'];
          case 'real_time_communication_systems':
            return ['Real-time & Communication Systems'];
          case 'product_platform_systems':
            return ['Product & Platform Systems'];
        }
      }
    }
  }
  
  // Default fallback
  return ['Product & Platform Systems'];
}

async function fixCategories() {
  try {
    console.log('Starting category fix...');
    
    // Get all system design questions
    const questions = await prisma.question.findMany({
      where: {
        question_type: 'system_design'
      }
    });
    
    console.log(`Found ${questions.length} system design questions`);
    
    for (const question of questions) {
      const newCategories = categorizeQuestion(question.question_text);
      const newCategory = newCategories[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      console.log(`Updating question: "${question.question_text.substring(0, 50)}..." -> ${newCategories.join(', ')}`);
      
      await prisma.question.update({
        where: { id: question.id },
        data: {
          categories: newCategories,
          category: newCategory
        }
      });
    }
    
    console.log('Category fix completed successfully!');
    
    // Show the new distribution
    const updatedQuestions = await prisma.question.findMany({
      where: {
        question_type: 'system_design'
      },
      select: {
        categories: true
      }
    });
    
    const categoryCount = {};
    updatedQuestions.forEach(q => {
      q.categories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });
    
    console.log('\nNew category distribution:');
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`${cat}: ${count} questions`);
    });
    
  } catch (error) {
    console.error('Error fixing categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategories();
