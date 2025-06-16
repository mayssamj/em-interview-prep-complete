
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

const finalBatchQuestions = [
  // Additional Distributed Systems & Infrastructure (15 questions)
  {
    question_text: "Design a distributed consensus system like Raft",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Hard",
    tags: ["consensus", "raft", "distributed-systems", "leader-election"],
    detailed_answer: {
      problem_statement: "Design a consensus algorithm that can maintain consistency across distributed nodes.",
      functional_requirements: ["Leader election", "Log replication", "Safety guarantees", "Liveness properties"]
    }
  },
  {
    question_text: "Design a distributed lock service like Chubby",
    category: "Distributed Systems & Infrastructure",
    company_id: "company_google",
    difficulty: "Hard",
    tags: ["distributed-locks", "coordination", "consensus", "high-availability"]
  },
  {
    question_text: "Design a distributed task scheduler like Airflow",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["task-scheduling", "workflow", "dag", "orchestration"]
  },
  {
    question_text: "Design a distributed search engine like Elasticsearch",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Hard",
    tags: ["distributed-search", "indexing", "sharding", "full-text-search"]
  },
  {
    question_text: "Design a distributed API gateway",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["api-gateway", "rate-limiting", "authentication", "load-balancing"]
  },
  {
    question_text: "Design a distributed metrics collection system like Prometheus",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["metrics", "monitoring", "time-series", "alerting"]
  },
  {
    question_text: "Design a distributed tracing system like Jaeger",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["distributed-tracing", "observability", "performance-monitoring"]
  },
  {
    question_text: "Design a distributed secret management system like Vault",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["secret-management", "encryption", "access-control", "security"]
  },
  {
    question_text: "Design a distributed rate limiting system",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["rate-limiting", "throttling", "distributed-systems", "api-protection"]
  },
  {
    question_text: "Design a distributed session store",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["session-management", "distributed-cache", "user-sessions", "scalability"]
  },
  {
    question_text: "Design a distributed job queue system like Celery",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["job-queue", "task-processing", "worker-nodes", "async-processing"]
  },
  {
    question_text: "Design a distributed event sourcing system",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Hard",
    tags: ["event-sourcing", "cqrs", "event-store", "eventual-consistency"]
  },
  {
    question_text: "Design a distributed circuit breaker system",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["circuit-breaker", "fault-tolerance", "resilience", "failure-handling"]
  },
  {
    question_text: "Design a distributed health check system",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Easy",
    tags: ["health-checks", "service-discovery", "monitoring", "availability"]
  },
  {
    question_text: "Design a distributed auto-scaling system",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["auto-scaling", "resource-management", "load-monitoring", "elasticity"]
  },

  // Additional Data & AI/ML Systems (15 questions)
  {
    question_text: "Design a machine learning model serving platform",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["ml-serving", "model-deployment", "inference", "scalability"]
  },
  {
    question_text: "Design a data lake architecture",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["data-lake", "big-data", "storage", "analytics"]
  },
  {
    question_text: "Design a real-time recommendation system for e-commerce",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["real-time-recommendations", "e-commerce", "personalization", "ml"]
  },
  {
    question_text: "Design a distributed machine learning training system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["distributed-training", "ml-infrastructure", "gpu-clusters", "model-parallelism"]
  },
  {
    question_text: "Design a data pipeline for ETL processing",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["etl", "data-pipeline", "batch-processing", "data-transformation"]
  },
  {
    question_text: "Design a clickstream analytics system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["clickstream", "user-analytics", "behavioral-data", "real-time-processing"]
  },
  {
    question_text: "Design a content-based recommendation system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["content-based-filtering", "feature-extraction", "similarity-matching"]
  },
  {
    question_text: "Design a real-time anomaly detection system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["anomaly-detection", "real-time-ml", "outlier-detection", "monitoring"]
  },
  {
    question_text: "Design a data versioning and lineage system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["data-versioning", "data-lineage", "data-governance", "metadata-management"]
  },
  {
    question_text: "Design a distributed graph processing system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["graph-processing", "distributed-computing", "graph-algorithms", "big-data"]
  },
  {
    question_text: "Design a machine learning experiment tracking system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["experiment-tracking", "ml-ops", "model-versioning", "reproducibility"]
  },
  {
    question_text: "Design a real-time feature engineering pipeline",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["feature-engineering", "real-time-processing", "streaming", "ml-pipeline"]
  },
  {
    question_text: "Design a data quality monitoring system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["data-quality", "monitoring", "validation", "data-governance"]
  },
  {
    question_text: "Design a multi-tenant analytics platform",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["multi-tenancy", "analytics", "data-isolation", "scalability"]
  },
  {
    question_text: "Design a machine learning model monitoring system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["model-monitoring", "drift-detection", "performance-tracking", "ml-ops"]
  },

  // Additional Real-time & Communication Systems (15 questions)
  {
    question_text: "Design a real-time notification system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["notifications", "push-notifications", "real-time", "messaging"]
  },
  {
    question_text: "Design a real-time chat moderation system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["content-moderation", "real-time-processing", "ml", "safety"]
  },
  {
    question_text: "Design a real-time leaderboard system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["leaderboard", "real-time-updates", "ranking", "gaming"]
  },
  {
    question_text: "Design a real-time collaborative whiteboard",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["collaborative-editing", "real-time-sync", "drawing", "conflict-resolution"]
  },
  {
    question_text: "Design a real-time event streaming platform",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["event-streaming", "real-time-processing", "pub-sub", "kafka"]
  },
  {
    question_text: "Design a real-time presence system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["presence", "online-status", "real-time-updates", "user-activity"]
  },
  {
    question_text: "Design a real-time polling and voting system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["polling", "voting", "real-time-results", "aggregation"]
  },
  {
    question_text: "Design a real-time delivery tracking system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["delivery-tracking", "real-time-location", "logistics", "notifications"]
  },
  {
    question_text: "Design a real-time fraud detection for payments",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["fraud-detection", "real-time-ml", "payments", "risk-scoring"]
  },
  {
    question_text: "Design a real-time recommendation engine",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["real-time-recommendations", "personalization", "streaming", "ml"]
  },
  {
    question_text: "Design a real-time dashboard system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["real-time-dashboard", "data-visualization", "streaming", "analytics"]
  },
  {
    question_text: "Design a real-time comment system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Easy",
    tags: ["comments", "real-time-updates", "moderation", "social-features"]
  },
  {
    question_text: "Design a real-time collaborative code editor",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["collaborative-editing", "code-editor", "real-time-sync", "conflict-resolution"]
  },
  {
    question_text: "Design a real-time price monitoring system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["price-monitoring", "real-time-updates", "alerts", "e-commerce"]
  },
  {
    question_text: "Design a real-time social media feed",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["social-feed", "real-time-updates", "personalization", "content-ranking"]
  },

  // Additional Product & Platform Systems (15 questions)
  {
    question_text: "Design a multi-tenant SaaS platform",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["multi-tenancy", "saas", "data-isolation", "scalability"]
  },
  {
    question_text: "Design a content management system like WordPress",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["cms", "content-management", "publishing", "themes"]
  },
  {
    question_text: "Design a digital wallet platform like PayPal",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["digital-wallet", "payments", "financial-services", "security"]
  },
  {
    question_text: "Design a marketplace platform like eBay",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["marketplace", "auctions", "payments", "trust-safety"]
  },
  {
    question_text: "Design a subscription management platform",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["subscriptions", "billing", "recurring-payments", "customer-management"]
  },
  {
    question_text: "Design a inventory management system",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["inventory", "supply-chain", "tracking", "optimization"]
  },
  {
    question_text: "Design a event ticketing platform like Eventbrite",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["event-ticketing", "payments", "event-management", "qr-codes"]
  },
  {
    question_text: "Design a hotel booking platform like Booking.com",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["hotel-booking", "availability", "pricing", "reviews"]
  },
  {
    question_text: "Design a freelancer platform like Upwork",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["freelancer-platform", "matching", "payments", "project-management"]
  },
  {
    question_text: "Design a dating platform like Tinder",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["dating-app", "matching-algorithm", "geolocation", "user-preferences"]
  },
  {
    question_text: "Design a fitness tracking platform",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["fitness-tracking", "wearables", "health-data", "social-features"]
  },
  {
    question_text: "Design a recipe sharing platform",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Easy",
    tags: ["recipe-sharing", "social-features", "search", "user-generated-content"]
  },
  {
    question_text: "Design a news aggregation platform like Reddit",
    category: "Product & Platform Systems",
    company_id: "company_reddit",
    difficulty: "Medium",
    tags: ["news-aggregation", "voting", "communities", "content-ranking"]
  },
  {
    question_text: "Design a photo storage platform like Google Photos",
    category: "Product & Platform Systems",
    company_id: "company_google",
    difficulty: "Medium",
    tags: ["photo-storage", "image-recognition", "search", "sharing"]
  },
  {
    question_text: "Design a password manager platform",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["password-manager", "encryption", "security", "sync"]
  }
];

async function createFinalBatch() {
  try {
    console.log('Creating final batch of 60 system design questions...');
    
    for (const questionData of finalBatchQuestions) {
      const questionId = uuidv4();
      
      // Create the main question
      await prisma.question.create({
        data: {
          id: questionId,
          company_id: questionData.company_id,
          category: questionData.category,
          categories: [questionData.category],
          question_text: questionData.question_text,
          difficulty: questionData.difficulty,
          question_type: 'system_design',
          tags: questionData.tags,
          is_generated: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      
      // Create the detailed system design question data
      await prisma.systemDesignQuestion.create({
        data: {
          id: uuidv4(),
          question_id: questionId,
          question_title: questionData.question_text,
          problem_statement: questionData.detailed_answer?.problem_statement || `Design and implement ${questionData.question_text.toLowerCase()}.`,
          functional_requirements: questionData.detailed_answer?.functional_requirements || [
            "High availability and reliability",
            "Scalability to handle growth",
            "Performance optimization",
            "Security and data protection"
          ],
          non_functional_requirements: [
            "99.9% uptime",
            "Sub-second response times",
            "Horizontal scalability",
            "Data consistency"
          ],
          core_solution: {
            components: ["Load balancer", "Application servers", "Database", "Cache layer", "Monitoring"],
            architecture: "Microservices with distributed components"
          },
          technology_stack: {
            "Backend": ["Node.js", "Python", "Java"],
            "Database": ["PostgreSQL", "MongoDB", "Redis"],
            "Infrastructure": ["AWS", "Docker", "Kubernetes"]
          },
          scalability_considerations: [
            "Horizontal scaling",
            "Database sharding",
            "Caching strategies",
            "Load balancing"
          ],
          tradeoffs: {
            "Consistency vs Availability": "Choose based on use case requirements",
            "Performance vs Cost": "Optimize for critical paths"
          },
          architecture_focus: questionData.tags,
          complexity_level: questionData.difficulty,
          leadership_aspects: [
            "Technical decision making",
            "Team coordination", 
            "Stakeholder communication",
            "Risk assessment"
          ],
          frameworks: ["System Design", "Scalability", "Reliability"],
          evaluation_criteria: [
            "Technical depth",
            "Scalability considerations", 
            "Trade-off analysis",
            "Communication clarity"
          ],
          estimated_time_minutes: questionData.difficulty === 'Hard' ? 60 : (questionData.difficulty === 'Medium' ? 45 : 30),
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      
      console.log(`Created: ${questionData.question_text}`);
    }
    
    console.log(`\nSuccessfully created ${finalBatchQuestions.length} final batch questions!`);
    
    // Verify the total results
    const totalQuestions = await prisma.question.count({
      where: { question_type: 'system_design' }
    });
    
    const categoryBreakdown = await prisma.question.groupBy({
      by: ['category'],
      where: { question_type: 'system_design' },
      _count: { category: true }
    });
    
    console.log(`\nTotal system design questions: ${totalQuestions}`);
    console.log('Category breakdown:');
    categoryBreakdown.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} questions`);
    });
    
  } catch (error) {
    console.error('Error creating final batch questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createFinalBatch();
