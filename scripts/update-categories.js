
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the new 4 categories and their mappings
const categoryMappings = {
  // Distributed Systems & Infrastructure
  'distributed_systems': ['Distributed Systems & Infrastructure'],
  'infrastructure': ['Distributed Systems & Infrastructure'],
  'monitoring_systems': ['Distributed Systems & Infrastructure'],
  
  // Data & AI/ML Systems
  'data_systems': ['Data & AI/ML Systems'],
  'ai_systems': ['Data & AI/ML Systems'],
  'machine_learning': ['Data & AI/ML Systems'],
  'search_systems': ['Data & AI/ML Systems'],
  
  // Real-time & Communication Systems
  'real_time_systems': ['Real-time & Communication Systems'],
  'collaboration_systems': ['Real-time & Communication Systems'],
  'media_streaming': ['Real-time & Communication Systems'],
  'social_networks': ['Real-time & Communication Systems'],
  
  // Product & Platform Systems
  'e_commerce': ['Product & Platform Systems'],
  'startup_systems': ['Product & Platform Systems'],
  'content_systems': ['Product & Platform Systems'],
  'geospatial_systems': ['Product & Platform Systems']
};

async function updateCategories() {
  try {
    console.log('Starting category update...');
    
    // Get all system design questions
    const questions = await prisma.question.findMany({
      where: {
        question_type: 'system_design'
      }
    });
    
    console.log(`Found ${questions.length} system design questions`);
    
    for (const question of questions) {
      const oldCategory = question.category;
      const newCategories = categoryMappings[oldCategory] || ['Product & Platform Systems']; // Default fallback
      
      console.log(`Updating question ${question.id}: ${oldCategory} -> ${newCategories.join(', ')}`);
      
      await prisma.question.update({
        where: { id: question.id },
        data: {
          categories: newCategories,
          // Keep the old category for backward compatibility, but update to new primary category
          category: newCategories[0].toLowerCase().replace(/[^a-z0-9]/g, '_')
        }
      });
    }
    
    console.log('Category update completed successfully!');
    
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
    console.error('Error updating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCategories();
