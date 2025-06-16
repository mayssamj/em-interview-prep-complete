
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testComprehensiveFunctionality() {
  console.log('🧪 Starting Comprehensive Functionality Tests...\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing Database Connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Test 2: System Design Questions
    console.log('2️⃣ Testing System Design Questions...');
    const systemDesignQuestions = await prisma.question.findMany({
      where: { question_type: 'system_design' },
      include: { system_design_questions: true }
    });
    
    console.log(`✅ Found ${systemDesignQuestions.length} system design questions`);
    
    const categoryBreakdown = {};
    systemDesignQuestions.forEach(q => {
      categoryBreakdown[q.category] = (categoryBreakdown[q.category] || 0) + 1;
    });
    
    console.log('📊 Category breakdown:');
    Object.entries(categoryBreakdown).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} questions`);
    });
    
    // Check for detailed answers
    const questionsWithDetails = systemDesignQuestions.filter(q => q.system_design_questions);
    console.log(`✅ ${questionsWithDetails.length} questions have detailed answers\n`);

    // Test 3: Behavioral Questions
    console.log('3️⃣ Testing Behavioral Questions...');
    const behavioralQuestions = await prisma.question.findMany({
      where: { question_type: 'behavioral' }
    });
    console.log(`✅ Found ${behavioralQuestions.length} behavioral questions\n`);

    // Test 4: Companies
    console.log('4️⃣ Testing Companies...');
    const companies = await prisma.company.findMany();
    console.log(`✅ Found ${companies.length} companies:`);
    companies.forEach(c => console.log(`   ${c.id}: ${c.name}`));
    console.log('');

    // Test 5: Users
    console.log('5️⃣ Testing Users...');
    const users = await prisma.user.findMany({
      select: { id: true, username: true, is_admin: true }
    });
    console.log(`✅ Found ${users.length} users:`);
    users.forEach(u => console.log(`   ${u.username} (${u.is_admin ? 'Admin' : 'User'})`));
    console.log('');

    // Test 6: Stories
    console.log('6️⃣ Testing Stories...');
    const stories = await prisma.story.findMany();
    console.log(`✅ Found ${stories.length} stories in database\n`);

    // Test 7: API Endpoints (basic connectivity)
    console.log('7️⃣ Testing API Endpoints...');
    
    const fetch = (await import('node-fetch')).default;
    
    const endpoints = [
      'http://localhost:3000/api/system-design-questions',
      'http://localhost:3000/api/system-design-categories',
      'http://localhost:3000/api/companies/system-design',
      'http://localhost:3000/api/companies/with-questions'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(`✅ ${endpoint}: ${response.status} (${Array.isArray(data) ? data.length + ' items' : 'object'})`);
      } catch (error) {
        console.log(`❌ ${endpoint}: Failed - ${error.message}`);
      }
    }
    console.log('');

    // Test 8: Data Quality Checks
    console.log('8️⃣ Testing Data Quality...');
    
    // Check for system design questions without detailed answers
    const systemDesignWithoutDetails = await prisma.question.findMany({
      where: {
        question_type: 'system_design',
        system_design_questions: null
      }
    });
    
    if (systemDesignWithoutDetails.length === 0) {
      console.log('✅ All system design questions have detailed answers');
    } else {
      console.log(`⚠️ Found ${systemDesignWithoutDetails.length} system design questions without detailed answers`);
    }
    
    console.log('✅ Data quality checks completed');
    console.log('');

    // Test 9: Sample Data Verification
    console.log('9️⃣ Testing Sample Data...');
    
    const sampleSystemDesign = await prisma.question.findFirst({
      where: { question_type: 'system_design' },
      include: { system_design_questions: true }
    });
    
    if (sampleSystemDesign) {
      console.log(`✅ Sample system design question: "${sampleSystemDesign.question_text}"`);
      console.log(`   Category: ${sampleSystemDesign.category}`);
      console.log(`   Difficulty: ${sampleSystemDesign.difficulty}`);
      console.log(`   Tags: [${sampleSystemDesign.tags.join(', ')}]`);
      if (sampleSystemDesign.system_design_questions) {
        console.log(`   Has detailed answer: Yes`);
        console.log(`   Functional requirements: ${sampleSystemDesign.system_design_questions.functional_requirements.length}`);
      }
    }
    
    console.log('');

    // Summary
    console.log('📋 SUMMARY:');
    console.log(`✅ System Design Questions: ${systemDesignQuestions.length} (Target: 100+)`);
    console.log(`✅ Behavioral Questions: ${behavioralQuestions.length}`);
    console.log(`✅ Companies: ${companies.length}`);
    console.log(`✅ Users: ${users.length}`);
    console.log(`✅ Stories: ${stories.length}`);
    
    if (systemDesignQuestions.length >= 100) {
      console.log('🎉 SUCCESS: System design questions target achieved!');
    } else {
      console.log('⚠️ WARNING: System design questions below target');
    }
    
    console.log('\n🎯 All core functionality tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testComprehensiveFunctionality();
