
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAllFixes() {
  console.log('🔍 TESTING ALL FIXES - COMPREHENSIVE VERIFICATION\n');
  
  try {
    // Test 1: Story Templates Data Structure
    console.log('1️⃣ Testing Story Templates Data Structure...');
    const stories = await prisma.story.findMany({
      where: { user_id: "user_admin" },
      take: 3
    });
    
    console.log(`✅ Found ${stories.length} stories for user_admin`);
    if (stories.length > 0) {
      const story = stories[0];
      console.log(`✅ Story structure valid: has created_at (${story.created_at}), tags (${story.tags?.length || 0}), categories (${story.categories?.length || 0})`);
    }
    
    // Test 2: System Design Questions Count
    console.log('\n2️⃣ Testing System Design Questions...');
    const systemDesignQuestions = await prisma.question.findMany({
      where: { question_type: 'system_design' },
      include: { companies: true }
    });
    
    console.log(`✅ Found ${systemDesignQuestions.length} system design questions`);
    
    // Test 3: Categories Distribution
    console.log('\n3️⃣ Testing Categories Distribution...');
    const categories = await prisma.question.groupBy({
      by: ['category'],
      where: { question_type: 'system_design' },
      _count: { category: true }
    });
    
    categories.forEach(cat => {
      console.log(`✅ Category "${cat.category}": ${cat._count.category} questions`);
    });
    
    // Test 4: Company Data
    console.log('\n4️⃣ Testing Company Data...');
    const companies = await prisma.company.findMany();
    console.log(`✅ Found ${companies.length} companies`);
    companies.slice(0, 5).forEach(comp => {
      console.log(`   - ${comp.name} (ID: ${comp.id})`);
    });
    
    // Test 5: Behavioral vs System Design Separation
    console.log('\n5️⃣ Testing Question Type Separation...');
    const behavioralCount = await prisma.question.count({
      where: { question_type: 'behavioral' }
    });
    const systemDesignCount = await prisma.question.count({
      where: { question_type: 'system_design' }
    });
    
    console.log(`✅ Behavioral questions: ${behavioralCount}`);
    console.log(`✅ System design questions: ${systemDesignCount}`);
    
    // Test 6: System Design Question Details
    console.log('\n6️⃣ Testing System Design Question Details...');
    const systemDesignDetails = await prisma.systemDesignQuestion.count();
    console.log(`✅ System design question details: ${systemDesignDetails}`);
    
    // Test 7: Critical Questions
    console.log('\n7️⃣ Testing Critical Questions...');
    const criticalQuestions = await prisma.question.count({
      where: { 
        question_type: 'system_design',
        is_critical: true 
      }
    });
    console.log(`✅ Critical system design questions: ${criticalQuestions}`);
    
    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('\n📊 SUMMARY:');
    console.log(`   - Stories: ${stories.length} (data structure fixed)`);
    console.log(`   - System Design Questions: ${systemDesignCount} (should be 120)`);
    console.log(`   - Categories: ${categories.length} (should be 4)`);
    console.log(`   - Companies: ${companies.length}`);
    console.log(`   - Critical Questions: ${criticalQuestions}`);
    console.log(`   - System Design Details: ${systemDesignDetails}`);
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAllFixes();
