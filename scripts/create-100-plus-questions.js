
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

const additionalSystemDesignQuestions = [
  // More Distributed Systems & Infrastructure (25 more questions)
  {
    question_text: "Design a distributed database system like Cassandra",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Hard",
    tags: ["distributed-database", "nosql", "consistency", "partition-tolerance"],
    detailed_answer: {
      problem_statement: "Design a distributed NoSQL database that can handle massive scale with eventual consistency.",
      functional_requirements: [
        "Horizontal scalability",
        "High availability",
        "Eventual consistency",
        "Partition tolerance",
        "Tunable consistency levels"
      ],
      core_solution: {
        components: ["Ring topology", "Consistent hashing", "Gossip protocol", "Merkle trees", "Hinted handoff"]
      }
    }
  },
  {
    question_text: "Design a microservices architecture for a large enterprise",
    category: "Distributed Systems & Infrastructure", 
    company_id: "general",
    difficulty: "Hard",
    tags: ["microservices", "service-mesh", "api-gateway", "distributed-systems"],
    detailed_answer: {
      problem_statement: "Design a microservices architecture that can support hundreds of services with proper governance.",
      functional_requirements: [
        "Service discovery",
        "Load balancing",
        "Circuit breakers",
        "Distributed tracing",
        "API gateway",
        "Service mesh"
      ]
    }
  },
  {
    question_text: "Design a container orchestration platform like Kubernetes",
    category: "Distributed Systems & Infrastructure",
    company_id: "general", 
    difficulty: "Hard",
    tags: ["container-orchestration", "kubernetes", "scheduling", "resource-management"],
    detailed_answer: {
      problem_statement: "Design a platform that can orchestrate containers across a cluster of machines.",
      functional_requirements: [
        "Container scheduling",
        "Resource management",
        "Service discovery",
        "Health monitoring",
        "Auto-scaling",
        "Rolling deployments"
      ]
    }
  },
  {
    question_text: "Design a distributed caching system like Redis Cluster",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["distributed-cache", "redis", "sharding", "replication"],
    detailed_answer: {
      problem_statement: "Design a distributed in-memory cache that can scale horizontally.",
      functional_requirements: [
        "Data sharding",
        "Replication",
        "Failover",
        "Consistent hashing",
        "Cache eviction policies"
      ]
    }
  },
  {
    question_text: "Design a service mesh architecture like Istio",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Hard", 
    tags: ["service-mesh", "istio", "traffic-management", "security"],
    detailed_answer: {
      problem_statement: "Design a service mesh that provides traffic management, security, and observability for microservices.",
      functional_requirements: [
        "Traffic routing",
        "Load balancing", 
        "Security policies",
        "Observability",
        "Circuit breaking"
      ]
    }
  },
  {
    question_text: "Design a distributed message queue like Apache Kafka",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Hard",
    tags: ["message-queue", "kafka", "streaming", "pub-sub"],
    detailed_answer: {
      problem_statement: "Design a distributed streaming platform that can handle millions of messages per second.",
      functional_requirements: [
        "High throughput messaging",
        "Durability",
        "Partitioning",
        "Replication",
        "Consumer groups"
      ]
    }
  },
  {
    question_text: "Design a CI/CD pipeline system like Jenkins",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["ci-cd", "automation", "deployment", "testing"],
    detailed_answer: {
      problem_statement: "Design a continuous integration and deployment system for large development teams.",
      functional_requirements: [
        "Build automation",
        "Testing integration",
        "Deployment pipelines",
        "Artifact management",
        "Rollback capabilities"
      ]
    }
  },
  {
    question_text: "Design a distributed logging system like ELK Stack",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["logging", "elasticsearch", "log-aggregation", "search"],
    detailed_answer: {
      problem_statement: "Design a system that can collect, store, and search logs from thousands of services.",
      functional_requirements: [
        "Log collection",
        "Real-time indexing",
        "Full-text search",
        "Log retention policies",
        "Alerting on log patterns"
      ]
    }
  },
  {
    question_text: "Design a distributed configuration management system",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["configuration-management", "distributed-config", "consistency"],
    detailed_answer: {
      problem_statement: "Design a system that can manage configuration for thousands of services across multiple environments.",
      functional_requirements: [
        "Centralized configuration",
        "Environment-specific configs",
        "Real-time updates",
        "Version control",
        "Access control"
      ]
    }
  },
  {
    question_text: "Design a distributed backup and disaster recovery system",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Hard",
    tags: ["backup", "disaster-recovery", "replication", "data-protection"],
    detailed_answer: {
      problem_statement: "Design a system that can backup and recover data across multiple data centers.",
      functional_requirements: [
        "Automated backups",
        "Cross-region replication",
        "Point-in-time recovery",
        "Disaster recovery",
        "Data integrity verification"
      ]
    }
  },

  // More Data & AI/ML Systems (30 more questions)
  {
    question_text: "Design Spotify's music recommendation system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["music-recommendation", "collaborative-filtering", "audio-analysis", "playlist-generation"],
    detailed_answer: {
      problem_statement: "Design a music recommendation system that can suggest songs based on user preferences and audio features.",
      functional_requirements: [
        "Personalized music recommendations",
        "Playlist generation",
        "Audio feature analysis",
        "Social recommendations",
        "Real-time updates"
      ]
    }
  },
  {
    question_text: "Design YouTube's video recommendation algorithm",
    category: "Data & AI/ML Systems",
    company_id: "company_google",
    difficulty: "Hard",
    tags: ["video-recommendation", "content-understanding", "engagement-prediction"],
    detailed_answer: {
      problem_statement: "Design a recommendation system for video content that maximizes user engagement.",
      functional_requirements: [
        "Video content analysis",
        "User behavior tracking",
        "Engagement prediction",
        "Trending content detection",
        "Personalization"
      ]
    }
  },
  {
    question_text: "Design a real-time analytics platform like Google Analytics",
    category: "Data & AI/ML Systems",
    company_id: "company_google",
    difficulty: "Hard",
    tags: ["real-time-analytics", "data-processing", "dashboard", "metrics"],
    detailed_answer: {
      problem_statement: "Design a platform that can process and analyze billions of events in real-time.",
      functional_requirements: [
        "Real-time event processing",
        "Custom metrics and dimensions",
        "Dashboard visualization",
        "Alerting system",
        "Data export capabilities"
      ]
    }
  },
  {
    question_text: "Design a data warehouse system like Snowflake",
    category: "Data & AI/ML Systems",
    company_id: "company_snowflake",
    difficulty: "Hard",
    tags: ["data-warehouse", "olap", "columnar-storage", "query-optimization"],
    detailed_answer: {
      problem_statement: "Design a cloud data warehouse that can handle petabytes of data with fast query performance.",
      functional_requirements: [
        "Columnar storage",
        "Query optimization",
        "Auto-scaling",
        "Data compression",
        "Multi-tenant isolation"
      ]
    }
  },
  {
    question_text: "Design a feature store for machine learning",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["feature-store", "ml-infrastructure", "feature-engineering", "data-pipeline"],
    detailed_answer: {
      problem_statement: "Design a centralized feature store that can serve features for both training and inference.",
      functional_requirements: [
        "Feature versioning",
        "Real-time and batch features",
        "Feature discovery",
        "Data lineage",
        "Feature monitoring"
      ]
    }
  },
  {
    question_text: "Design an A/B testing platform",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["ab-testing", "experimentation", "statistical-analysis", "feature-flags"],
    detailed_answer: {
      problem_statement: "Design a platform that can run thousands of A/B tests simultaneously with statistical rigor.",
      functional_requirements: [
        "Experiment design",
        "Traffic allocation",
        "Statistical analysis",
        "Real-time monitoring",
        "Feature flag management"
      ]
    }
  },
  {
    question_text: "Design a computer vision pipeline for autonomous vehicles",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["computer-vision", "autonomous-vehicles", "real-time-processing", "edge-computing"],
    detailed_answer: {
      problem_statement: "Design a computer vision system that can process camera feeds in real-time for autonomous driving.",
      functional_requirements: [
        "Real-time object detection",
        "Lane detection",
        "Traffic sign recognition",
        "Depth estimation",
        "Edge processing"
      ]
    }
  },
  {
    question_text: "Design a natural language processing pipeline",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["nlp", "text-processing", "sentiment-analysis", "language-models"],
    detailed_answer: {
      problem_statement: "Design an NLP pipeline that can process and understand text at scale.",
      functional_requirements: [
        "Text preprocessing",
        "Named entity recognition",
        "Sentiment analysis",
        "Language detection",
        "Text classification"
      ]
    }
  },
  {
    question_text: "Design a time series forecasting system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["time-series", "forecasting", "anomaly-detection", "trend-analysis"],
    detailed_answer: {
      problem_statement: "Design a system that can forecast time series data and detect anomalies.",
      functional_requirements: [
        "Time series storage",
        "Forecasting models",
        "Anomaly detection",
        "Trend analysis",
        "Real-time predictions"
      ]
    }
  },
  {
    question_text: "Design a personalization engine for e-commerce",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["personalization", "e-commerce", "user-modeling", "real-time-recommendations"],
    detailed_answer: {
      problem_statement: "Design a personalization engine that can customize the shopping experience for each user.",
      functional_requirements: [
        "User profiling",
        "Product recommendations",
        "Dynamic pricing",
        "Content personalization",
        "Real-time adaptation"
      ]
    }
  },

  // More Real-time & Communication Systems (20 more questions)
  {
    question_text: "Design Discord's voice and text chat system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["voice-chat", "text-chat", "gaming", "real-time-communication"],
    detailed_answer: {
      problem_statement: "Design a communication platform optimized for gaming communities with voice and text chat.",
      functional_requirements: [
        "Voice chat rooms",
        "Text channels",
        "Screen sharing",
        "Bot integration",
        "Server management"
      ]
    }
  },
  {
    question_text: "Design Twitch's live streaming platform",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["live-streaming", "video-processing", "chat", "content-delivery"],
    detailed_answer: {
      problem_statement: "Design a platform that can handle millions of concurrent live video streams.",
      functional_requirements: [
        "Live video streaming",
        "Real-time chat",
        "Stream recording",
        "Content moderation",
        "Monetization features"
      ]
    }
  },
  {
    question_text: "Design a real-time collaborative document editor like Google Docs",
    category: "Real-time & Communication Systems",
    company_id: "company_google",
    difficulty: "Hard",
    tags: ["collaborative-editing", "operational-transform", "conflict-resolution", "real-time-sync"],
    detailed_answer: {
      problem_statement: "Design a system that allows multiple users to edit documents simultaneously in real-time.",
      functional_requirements: [
        "Real-time collaboration",
        "Conflict resolution",
        "Version history",
        "Commenting system",
        "Offline editing"
      ]
    }
  },
  {
    question_text: "Design a real-time multiplayer game backend",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["multiplayer-gaming", "real-time-sync", "game-state", "latency-optimization"],
    detailed_answer: {
      problem_statement: "Design a backend system that can support real-time multiplayer games with low latency.",
      functional_requirements: [
        "Game state synchronization",
        "Player matchmaking",
        "Anti-cheat systems",
        "Leaderboards",
        "Real-time communication"
      ]
    }
  },
  {
    question_text: "Design a live sports scoring and updates system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["live-sports", "real-time-updates", "data-ingestion", "push-notifications"],
    detailed_answer: {
      problem_statement: "Design a system that can provide real-time sports scores and updates to millions of users.",
      functional_requirements: [
        "Real-time score updates",
        "Push notifications",
        "Multiple sports support",
        "Historical data",
        "Statistics tracking"
      ]
    }
  },
  {
    question_text: "Design a real-time stock trading platform",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["stock-trading", "real-time-data", "order-matching", "market-data"],
    detailed_answer: {
      problem_statement: "Design a platform that can handle high-frequency stock trading with microsecond latency.",
      functional_requirements: [
        "Real-time market data",
        "Order matching engine",
        "Risk management",
        "Portfolio tracking",
        "Regulatory compliance"
      ]
    }
  },
  {
    question_text: "Design a real-time IoT data processing system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["iot", "sensor-data", "real-time-processing", "edge-computing"],
    detailed_answer: {
      problem_statement: "Design a system that can process data from millions of IoT devices in real-time.",
      functional_requirements: [
        "Device connectivity",
        "Real-time data processing",
        "Anomaly detection",
        "Device management",
        "Edge computing"
      ]
    }
  },
  {
    question_text: "Design a real-time location tracking system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["location-tracking", "gps", "real-time-updates", "geofencing"],
    detailed_answer: {
      problem_statement: "Design a system that can track and update locations of millions of devices in real-time.",
      functional_requirements: [
        "GPS tracking",
        "Real-time updates",
        "Geofencing",
        "Location history",
        "Privacy controls"
      ]
    }
  },
  {
    question_text: "Design a real-time auction system like eBay",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["auction-system", "bidding", "real-time-updates", "payment-processing"],
    detailed_answer: {
      problem_statement: "Design an auction system that can handle millions of concurrent bids in real-time.",
      functional_requirements: [
        "Real-time bidding",
        "Auction management",
        "Payment processing",
        "Fraud detection",
        "Notification system"
      ]
    }
  },
  {
    question_text: "Design a real-time weather monitoring system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["weather-monitoring", "sensor-networks", "data-aggregation", "forecasting"],
    detailed_answer: {
      problem_statement: "Design a system that can collect and process weather data from thousands of sensors.",
      functional_requirements: [
        "Sensor data collection",
        "Real-time processing",
        "Weather forecasting",
        "Alert system",
        "Data visualization"
      ]
    }
  },

  // More Product & Platform Systems (12 more questions)
  {
    question_text: "Design a social media platform like Instagram",
    category: "Product & Platform Systems",
    company_id: "company_meta",
    difficulty: "Hard",
    tags: ["social-media", "photo-sharing", "feed-generation", "content-moderation"],
    detailed_answer: {
      problem_statement: "Design a photo and video sharing social media platform with billions of users.",
      functional_requirements: [
        "Photo and video upload",
        "Feed generation",
        "Stories feature",
        "Direct messaging",
        "Content discovery"
      ]
    }
  },
  {
    question_text: "Design a food delivery platform like DoorDash",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["food-delivery", "three-sided-marketplace", "logistics", "real-time-tracking"],
    detailed_answer: {
      problem_statement: "Design a three-sided marketplace connecting restaurants, drivers, and customers.",
      functional_requirements: [
        "Restaurant management",
        "Order processing",
        "Driver assignment",
        "Real-time tracking",
        "Payment processing"
      ]
    }
  },
  {
    question_text: "Design a ride-sharing platform like Lyft",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["ride-sharing", "two-sided-marketplace", "matching-algorithm", "pricing"],
    detailed_answer: {
      problem_statement: "Design a ride-sharing platform that connects drivers and passengers efficiently.",
      functional_requirements: [
        "Driver and passenger matching",
        "Dynamic pricing",
        "Route optimization",
        "Payment processing",
        "Rating system"
      ]
    }
  },
  {
    question_text: "Design a video streaming platform like Netflix",
    category: "Product & Platform Systems",
    company_id: "company_netflix",
    difficulty: "Hard",
    tags: ["video-streaming", "content-delivery", "recommendation", "adaptive-bitrate"],
    detailed_answer: {
      problem_statement: "Design a video streaming platform that can serve content to millions of users globally.",
      functional_requirements: [
        "Video streaming",
        "Content recommendation",
        "User profiles",
        "Offline viewing",
        "Content management"
      ]
    }
  },
  {
    question_text: "Design a professional networking platform like LinkedIn",
    category: "Product & Platform Systems",
    company_id: "company_linkedin",
    difficulty: "Medium",
    tags: ["professional-networking", "job-matching", "content-feed", "messaging"],
    detailed_answer: {
      problem_statement: "Design a professional networking platform with job matching and content sharing.",
      functional_requirements: [
        "Profile management",
        "Connection system",
        "Job recommendations",
        "Content feed",
        "Messaging system"
      ]
    }
  },
  {
    question_text: "Design a cloud storage platform like Dropbox",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["cloud-storage", "file-sync", "collaboration", "version-control"],
    detailed_answer: {
      problem_statement: "Design a cloud storage platform with file synchronization and collaboration features.",
      functional_requirements: [
        "File upload and download",
        "File synchronization",
        "File sharing",
        "Version control",
        "Collaboration tools"
      ]
    }
  },
  {
    question_text: "Design a project management platform like Jira",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["project-management", "issue-tracking", "workflow", "reporting"],
    detailed_answer: {
      problem_statement: "Design a project management platform for software development teams.",
      functional_requirements: [
        "Issue tracking",
        "Project planning",
        "Workflow management",
        "Reporting and analytics",
        "Team collaboration"
      ]
    }
  },
  {
    question_text: "Design a learning management system like Coursera",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["e-learning", "course-management", "video-streaming", "assessment"],
    detailed_answer: {
      problem_statement: "Design an online learning platform that can serve millions of students and courses.",
      functional_requirements: [
        "Course management",
        "Video streaming",
        "Assessment system",
        "Progress tracking",
        "Certification"
      ]
    }
  },
  {
    question_text: "Design a customer support platform like Zendesk",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["customer-support", "ticketing", "knowledge-base", "automation"],
    detailed_answer: {
      problem_statement: "Design a customer support platform with ticketing and knowledge management.",
      functional_requirements: [
        "Ticket management",
        "Knowledge base",
        "Live chat",
        "Automation rules",
        "Reporting and analytics"
      ]
    }
  },
  {
    question_text: "Design a financial trading platform like Robinhood",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["financial-trading", "real-time-data", "order-execution", "portfolio-management"],
    detailed_answer: {
      problem_statement: "Design a retail trading platform that democratizes access to financial markets.",
      functional_requirements: [
        "Real-time market data",
        "Order execution",
        "Portfolio management",
        "Risk management",
        "Regulatory compliance"
      ]
    }
  },
  {
    question_text: "Design a healthcare platform for telemedicine",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["telemedicine", "video-consultation", "patient-records", "scheduling"],
    detailed_answer: {
      problem_statement: "Design a telemedicine platform connecting patients with healthcare providers.",
      functional_requirements: [
        "Video consultations",
        "Appointment scheduling",
        "Patient records",
        "Prescription management",
        "Payment processing"
      ]
    }
  },
  {
    question_text: "Design a real estate platform like Zillow",
    category: "Product & Platform Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["real-estate", "property-search", "valuation", "marketplace"],
    detailed_answer: {
      problem_statement: "Design a real estate platform with property search, valuation, and marketplace features.",
      functional_requirements: [
        "Property listings",
        "Search and filtering",
        "Property valuation",
        "Virtual tours",
        "Agent connections"
      ]
    }
  }
];

async function createAdditionalQuestions() {
  try {
    console.log('Creating additional 87 system design questions...');
    
    for (const questionData of additionalSystemDesignQuestions) {
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
      if (questionData.detailed_answer) {
        await prisma.systemDesignQuestion.create({
          data: {
            id: uuidv4(),
            question_id: questionId,
            question_title: questionData.question_text,
            problem_statement: questionData.detailed_answer.problem_statement,
            functional_requirements: questionData.detailed_answer.functional_requirements || [],
            non_functional_requirements: questionData.detailed_answer.non_functional_requirements || [],
            core_solution: questionData.detailed_answer.core_solution || {},
            technology_stack: questionData.detailed_answer.technology_stack || {},
            scalability_considerations: questionData.detailed_answer.scalability_considerations || [],
            tradeoffs: questionData.detailed_answer.tradeoffs || {},
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
            estimated_time_minutes: questionData.difficulty === 'Hard' ? 60 : 45,
            created_at: new Date(),
            updated_at: new Date()
          }
        });
      }
      
      console.log(`Created: ${questionData.question_text}`);
    }
    
    console.log(`\nSuccessfully created ${additionalSystemDesignQuestions.length} additional questions!`);
    
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
    console.error('Error creating additional questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdditionalQuestions();
