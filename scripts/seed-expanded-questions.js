
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedExpandedSystemDesignQuestions() {
  console.log('🌱 Seeding expanded system design questions...');

  try {
    // Read the JSON file
    const questionsPath = path.join('/home/ubuntu', 'system_design_questions_expanded.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

    console.log(`Found ${questionsData.length} questions to seed`);

    // Companies already exist in database

    const companyMap = {
      'Meta': 'company_meta',
      'Amazon': 'company_amazon',
      'Google': 'company_google',
      'General': 'general'
    };

    // Categories mapping
    const categoryMap = {
      'Distributed Systems & Infrastructure': 'distributed_systems',
      'Data Storage & Processing': 'data_systems',
      'Web Applications & APIs': 'web_applications',
      'Real-time Systems & Communication': 'real_time_systems'
    };

    let successCount = 0;
    let errorCount = 0;

    for (const questionData of questionsData) {
      try {
        const questionId = `sd_${questionData.question_title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50)}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const companyId = companyMap[questionData.company] || 'general';
        const category = categoryMap[questionData.category] || 'distributed_systems';

        // Create the main question
        const question = await prisma.question.create({
          data: {
            id: questionId,
            company_id: companyId,
            category: category,
            categories: [category],
            question_text: questionData.question_title,
            difficulty: questionData.difficulty,
            is_generated: true,
            tags: questionData.tags || [],
            is_critical: questionData.difficulty === 'Hard',
            usage_count: 0,
            question_type: 'system_design',
            updated_at: new Date()
          }
        });

        // Create the system design question details
        await prisma.systemDesignQuestion.create({
          data: {
            id: `sysdes_${questionId}`,
            question_id: questionId,
            question_title: questionData.question_title,
            problem_statement: questionData.problem_statement,
            clarifying_questions: questionData.clarifying_questions || [],
            functional_requirements: questionData.functional_requirements || [],
            non_functional_requirements: questionData.non_functional_requirements || [],
            core_solution: questionData.core_solution || {},
            references: questionData.references || [],
            back_of_envelope_calculations: questionData.back_of_envelope_calculations || {},
            technology_stack: questionData.technology_stack || {},
            tradeoffs: questionData.tradeoffs || {},
            scalability_considerations: questionData.scalability_considerations || [],
            alternative_solutions: questionData.alternative_solutions || [],
            key_technical_criteria: questionData.key_technical_criteria || [],
            architecture_focus: questionData.tags || [],
            complexity_level: questionData.difficulty,
            leadership_aspects: ['Technical Leadership', 'System Architecture', 'Scalability Planning'],
            frameworks: ['System Design', 'Distributed Systems', 'Scalability'],
            evaluation_criteria: [
              'Problem Understanding',
              'System Architecture',
              'Scalability Considerations',
              'Trade-off Analysis',
              'Technical Depth'
            ],
            resources: questionData.references || [],
            estimated_time_minutes: 45,
            follow_up_questions: [
              'How would you handle 10x traffic?',
              'What monitoring would you implement?',
              'How would you ensure data consistency?'
            ],
            common_mistakes: [
              'Not asking clarifying questions',
              'Jumping to implementation details too quickly',
              'Ignoring non-functional requirements',
              'Not considering failure scenarios'
            ],
            key_tradeoffs: Object.keys(questionData.tradeoffs || {}),
            updated_at: new Date()
          }
        });

        successCount++;
        if (successCount % 10 === 0) {
          console.log(`✅ Seeded ${successCount} questions so far...`);
        }

      } catch (error) {
        console.error(`❌ Error seeding question "${questionData.question_title}":`, error.message);
        errorCount++;
      }
    }

    console.log(`\n🎉 Seeding completed!`);
    console.log(`✅ Successfully seeded: ${successCount} questions`);
    console.log(`❌ Errors: ${errorCount} questions`);

    // Update categories count
    console.log('\n📊 Updating category counts...');
    const categories = [
      {
        id: 'distributed_systems',
        name: 'Distributed Systems & Infrastructure',
        description: 'Large-scale system design, microservices, load balancing, caching'
      },
      {
        id: 'data_systems',
        name: 'Data Storage & Processing',
        description: 'Databases, data pipelines, analytics, search systems'
      },
      {
        id: 'web_applications',
        name: 'Web Applications & APIs',
        description: 'Web services, API design, authentication, content delivery'
      },
      {
        id: 'real_time_systems',
        name: 'Real-time Systems & Communication',
        description: 'Chat systems, notifications, streaming, real-time updates'
      }
    ];

    for (const cat of categories) {
      const count = await prisma.question.count({
        where: {
          category: cat.id,
          question_type: 'system_design'
        }
      });

      console.log(`📈 ${cat.name}: ${count} questions`);
    }

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedExpandedSystemDesignQuestions()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
