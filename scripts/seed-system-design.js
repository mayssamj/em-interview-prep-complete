
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSystemDesignContent() {
  console.log('🌱 Seeding system design content...');

  // First, let's create system design frameworks
  const frameworks = [
    {
      name: "CAP Theorem",
      description: "Fundamental principle stating that distributed systems can only guarantee two of three properties: Consistency, Availability, and Partition tolerance.",
      category: "data_consistency",
      keyPrinciples: [
        "Consistency: All nodes see the same data simultaneously",
        "Availability: System remains operational during failures",
        "Partition tolerance: System continues despite network failures",
        "You can only guarantee two out of three properties"
      ],
      useCases: [
        "Designing distributed databases",
        "Choosing between SQL and NoSQL systems",
        "Making tradeoffs in microservices architecture",
        "Designing fault-tolerant systems"
      ],
      tradeoffs: [
        "CP systems sacrifice availability for consistency",
        "AP systems sacrifice consistency for availability",
        "CA systems cannot handle network partitions",
        "Real-world systems often choose eventual consistency"
      ],
      examples: [
        "Banking systems prioritize CP (consistency + partition tolerance)",
        "Social media feeds often choose AP (availability + partition tolerance)",
        "Traditional RDBMS in single datacenter are CA systems"
      ],
      resources: [
        "https://en.wikipedia.org/wiki/CAP_theorem",
        "https://www.ibm.com/cloud/learn/cap-theorem"
      ],
      difficulty: "Medium"
    },
    {
      name: "ACID Properties",
      description: "Set of properties that guarantee database transactions are processed reliably in traditional relational databases.",
      category: "data_consistency",
      keyPrinciples: [
        "Atomicity: Transactions are all-or-nothing",
        "Consistency: Database remains in valid state",
        "Isolation: Concurrent transactions don't interfere",
        "Durability: Committed transactions persist"
      ],
      useCases: [
        "Financial transaction systems",
        "E-commerce order processing",
        "Inventory management systems",
        "Any system requiring strong consistency"
      ],
      tradeoffs: [
        "Strong consistency vs. performance",
        "ACID compliance vs. scalability",
        "Reliability vs. speed",
        "Complex implementation vs. data integrity"
      ],
      examples: [
        "Bank account transfers",
        "E-commerce checkout process",
        "Booking systems (hotels, flights)",
        "Medical record systems"
      ],
      resources: [
        "https://en.wikipedia.org/wiki/ACID",
        "https://www.databricks.com/glossary/acid-transactions"
      ],
      difficulty: "Easy"
    },
    {
      name: "Microservices Architecture",
      description: "Architectural pattern that structures an application as a collection of loosely coupled, independently deployable services.",
      category: "architecture_patterns",
      keyPrinciples: [
        "Single responsibility per service",
        "Decentralized governance and data management",
        "Failure isolation and resilience",
        "Technology diversity and team autonomy"
      ],
      useCases: [
        "Large-scale web applications",
        "Organizations with multiple teams",
        "Systems requiring different scaling patterns",
        "Applications with diverse technology needs"
      ],
      tradeoffs: [
        "Complexity vs. flexibility",
        "Network latency vs. service isolation",
        "Operational overhead vs. team autonomy",
        "Data consistency vs. service independence"
      ],
      examples: [
        "Netflix streaming platform",
        "Amazon e-commerce platform",
        "Uber ride-sharing system",
        "Spotify music streaming"
      ],
      resources: [
        "https://microservices.io/",
        "https://martinfowler.com/articles/microservices.html"
      ],
      difficulty: "Hard"
    }
  ];

  // Create frameworks
  for (const framework of frameworks) {
    await prisma.systemDesignFramework.upsert({
      where: { name: framework.name },
      update: framework,
      create: framework
    });
  }

  // Now let's create system design questions for each company
  const companies = await prisma.company.findMany();
  
  const systemDesignQuestions = [
    // Meta questions
    {
      companyName: "Meta",
      questions: [
        {
          questionText: "Design Meta's News Feed system.",
          category: "distributed_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["news_feed", "social_media", "real_time", "personalization"],
          systemDesignDetails: {
            architectureFocus: ["distributed_systems", "real_time_processing", "recommendation_systems", "caching"],
            complexityLevel: "senior",
            leadershipAspects: ["technical_decision_making", "cross_functional_collaboration", "stakeholder_management"],
            frameworks: ["microservices", "event_driven_architecture", "caching_strategies"],
            evaluationCriteria: ["scalability", "real_time_performance", "personalization_quality", "system_reliability"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle celebrity posts that get millions of interactions?",
              "How would you implement real-time updates for the feed?",
              "How would you personalize the feed for different user segments?",
              "How would you handle content moderation at scale?"
            ],
            commonMistakes: [
              "Not considering the scale of Meta's user base",
              "Ignoring real-time requirements",
              "Not addressing personalization complexity",
              "Overlooking content moderation challenges"
            ],
            keyTradeoffs: [
              "Real-time updates vs. system performance",
              "Personalization accuracy vs. computational cost",
              "Content freshness vs. relevance",
              "Global consistency vs. availability"
            ],
            resources: []
          }
        },
        {
          questionText: "Design Meta Messenger or a similar large-scale chat system.",
          category: "real_time_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["messaging", "real_time", "websockets", "mobile"],
          systemDesignDetails: {
            architectureFocus: ["real_time_communication", "mobile_optimization", "message_delivery", "presence_system"],
            complexityLevel: "senior",
            leadershipAspects: ["technical_decision_making", "mobile_team_coordination", "infrastructure_planning"],
            frameworks: ["websockets", "message_queues", "eventual_consistency"],
            evaluationCriteria: ["message_delivery_reliability", "real_time_performance", "mobile_battery_optimization", "scalability"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you ensure message delivery in poor network conditions?",
              "How would you implement end-to-end encryption?",
              "How would you handle group chats with thousands of participants?",
              "How would you optimize for mobile battery life?"
            ],
            commonMistakes: [
              "Not considering mobile-specific constraints",
              "Ignoring message delivery guarantees",
              "Not planning for offline scenarios",
              "Overlooking presence system complexity"
            ],
            keyTradeoffs: [
              "Message delivery speed vs. reliability",
              "Real-time features vs. battery life",
              "End-to-end encryption vs. feature richness",
              "Consistency vs. availability in poor networks"
            ],
            resources: []
          }
        }
      ]
    },
    // Amazon questions
    {
      companyName: "Amazon",
      questions: [
        {
          questionText: "Design a scalable e-commerce product page with real-time inventory and recommendations.",
          category: "e_commerce",
          difficulty: "Hard",
          isCritical: true,
          tags: ["e_commerce", "inventory", "recommendations", "real_time"],
          systemDesignDetails: {
            architectureFocus: ["inventory_management", "recommendation_systems", "caching", "real_time_updates"],
            complexityLevel: "senior",
            leadershipAspects: ["product_team_collaboration", "business_metrics_optimization", "customer_experience"],
            frameworks: ["microservices", "caching_strategies", "event_driven_architecture"],
            evaluationCriteria: ["page_load_performance", "inventory_accuracy", "recommendation_relevance", "conversion_optimization"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle flash sales with limited inventory?",
              "How would you personalize recommendations for new users?",
              "How would you ensure inventory consistency across regions?",
              "How would you optimize for mobile commerce?"
            ],
            commonMistakes: [
              "Not considering inventory race conditions",
              "Ignoring recommendation cold start problem",
              "Not optimizing for mobile performance",
              "Overlooking international considerations"
            ],
            keyTradeoffs: [
              "Inventory accuracy vs. system performance",
              "Personalization vs. page load speed",
              "Real-time updates vs. caching efficiency",
              "Feature richness vs. simplicity"
            ],
            resources: []
          }
        }
      ]
    },
    // Google questions
    {
      companyName: "Google",
      questions: [
        {
          questionText: "Design Google Maps.",
          category: "geospatial_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["maps", "geospatial", "routing", "real_time"],
          systemDesignDetails: {
            architectureFocus: ["geospatial_indexing", "routing_algorithms", "real_time_traffic", "mobile_optimization"],
            complexityLevel: "senior",
            leadershipAspects: ["cross_functional_coordination", "data_partnerships", "privacy_considerations"],
            frameworks: ["geospatial_databases", "graph_algorithms", "real_time_processing"],
            evaluationCriteria: ["routing_accuracy", "real_time_performance", "data_freshness", "mobile_experience"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle real-time traffic updates?",
              "How would you optimize routing for different transportation modes?",
              "How would you store and query geospatial data efficiently?",
              "How would you handle offline map functionality?"
            ],
            commonMistakes: [
              "Not considering geospatial indexing complexity",
              "Ignoring real-time traffic integration",
              "Not optimizing for mobile constraints",
              "Overlooking privacy implications"
            ],
            keyTradeoffs: [
              "Map detail vs. storage/bandwidth",
              "Real-time accuracy vs. computational cost",
              "Feature richness vs. performance",
              "Privacy vs. personalization"
            ],
            resources: []
          }
        }
      ]
    }
  ];

  // Create system design questions
  for (const companyData of systemDesignQuestions) {
    const company = companies.find(c => c.name === companyData.companyName);
    if (!company) continue;

    for (const questionData of companyData.questions) {
      const { systemDesignDetails, ...questionFields } = questionData;
      
      // Check if question already exists
      const existingQuestion = await prisma.question.findFirst({
        where: {
          questionText: questionData.questionText,
          companyId: company.id
        }
      });

      let question;
      if (existingQuestion) {
        question = await prisma.question.update({
          where: { id: existingQuestion.id },
          data: {
            ...questionFields,
            companyId: company.id,
            questionType: 'system_design'
          }
        });
      } else {
        question = await prisma.question.create({
          data: {
            ...questionFields,
            companyId: company.id,
            questionType: 'system_design'
          }
        });
      }

      // Create system design details
      await prisma.systemDesignQuestion.upsert({
        where: {
          questionId: question.id
        },
        update: systemDesignDetails,
        create: {
          questionId: question.id,
          ...systemDesignDetails
        }
      });
    }
  }

  console.log('✅ System design content seeded successfully!');
}

seedSystemDesignContent()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
