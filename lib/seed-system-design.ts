
import { prisma } from './db';

export async function seedSystemDesignContent() {
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
      name: "BASE Principle",
      description: "Alternative to ACID for distributed systems, emphasizing availability and eventual consistency over immediate consistency.",
      category: "data_consistency",
      keyPrinciples: [
        "Basically Available: System remains available",
        "Soft state: Data may change over time",
        "Eventual consistency: System becomes consistent eventually",
        "Prioritizes availability over immediate consistency"
      ],
      useCases: [
        "Large-scale distributed systems",
        "Social media platforms",
        "Content delivery networks",
        "Real-time analytics systems"
      ],
      tradeoffs: [
        "Availability vs. immediate consistency",
        "Scalability vs. data accuracy",
        "Performance vs. complexity",
        "User experience vs. data precision"
      ],
      examples: [
        "Facebook news feed",
        "Twitter timeline",
        "Amazon product recommendations",
        "Netflix viewing history"
      ],
      resources: [
        "https://en.wikipedia.org/wiki/Eventual_consistency",
        "https://www.allthingsdistributed.com/2008/12/eventually_consistent.html"
      ],
      difficulty: "Medium"
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
    },
    {
      name: "Load Balancing Strategies",
      description: "Techniques for distributing incoming requests across multiple servers to ensure optimal resource utilization and availability.",
      category: "scalability",
      keyPrinciples: [
        "Distribute load evenly across servers",
        "Health checking and failover",
        "Session affinity considerations",
        "Geographic and latency-based routing"
      ],
      useCases: [
        "High-traffic web applications",
        "API gateways",
        "Database connection pooling",
        "Content delivery networks"
      ],
      tradeoffs: [
        "Round-robin vs. weighted distribution",
        "Session stickiness vs. load distribution",
        "Hardware vs. software load balancers",
        "Cost vs. performance and reliability"
      ],
      examples: [
        "AWS Application Load Balancer",
        "NGINX load balancing",
        "Google Cloud Load Balancing",
        "Cloudflare load balancing"
      ],
      resources: [
        "https://aws.amazon.com/what-is/load-balancing/",
        "https://nginx.org/en/docs/http/load_balancing.html"
      ],
      difficulty: "Medium"
    },
    {
      name: "Caching Strategies",
      description: "Techniques for storing frequently accessed data in fast storage to improve system performance and reduce latency.",
      category: "performance",
      keyPrinciples: [
        "Cache frequently accessed data",
        "Consider cache invalidation strategies",
        "Choose appropriate cache levels",
        "Handle cache misses gracefully"
      ],
      useCases: [
        "Web application performance optimization",
        "Database query optimization",
        "API response caching",
        "Static content delivery"
      ],
      tradeoffs: [
        "Memory usage vs. performance gain",
        "Cache consistency vs. performance",
        "Cache complexity vs. simplicity",
        "Cost vs. speed improvement"
      ],
      examples: [
        "Redis for session storage",
        "CDN for static assets",
        "Database query result caching",
        "Application-level caching"
      ],
      resources: [
        "https://aws.amazon.com/caching/",
        "https://redis.io/docs/manual/patterns/"
      ],
      difficulty: "Medium"
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
            resources: [
              "https://engineering.fb.com/2013/03/20/core-data/tao-the-power-of-the-graph/",
              "https://engineering.fb.com/2016/03/25/core-data/realtime-data-infrastructure-at-facebook/"
            ]
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
            resources: [
              "https://engineering.fb.com/2011/12/12/core-data/the-underlying-technology-of-messages/",
              "https://engineering.fb.com/2016/02/12/ios/building-facebook-messenger/"
            ]
          }
        },
        {
          questionText: "Design a system to handle notifications for billions of users.",
          category: "distributed_systems",
          difficulty: "Hard",
          isCritical: false,
          tags: ["notifications", "push_notifications", "mobile", "personalization"],
          systemDesignDetails: {
            architectureFocus: ["push_notification_systems", "mobile_platforms", "personalization", "rate_limiting"],
            complexityLevel: "senior",
            leadershipAspects: ["cross_platform_coordination", "user_experience_optimization", "privacy_considerations"],
            frameworks: ["message_queues", "rate_limiting", "personalization_engines"],
            evaluationCriteria: ["delivery_reliability", "personalization_effectiveness", "user_engagement", "system_scalability"],
            estimatedTimeMinutes: 40,
            followUpQuestions: [
              "How would you prevent notification spam?",
              "How would you personalize notification timing?",
              "How would you handle different mobile platforms?",
              "How would you measure notification effectiveness?"
            ],
            commonMistakes: [
              "Not considering user notification preferences",
              "Ignoring platform-specific limitations",
              "Not implementing proper rate limiting",
              "Overlooking notification fatigue"
            ],
            keyTradeoffs: [
              "Notification frequency vs. user engagement",
              "Personalization vs. privacy",
              "Real-time delivery vs. battery optimization",
              "Feature richness vs. simplicity"
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
        },
        {
          questionText: "Design a Content Delivery Network (CDN).",
          category: "infrastructure",
          difficulty: "Hard",
          isCritical: true,
          tags: ["cdn", "caching", "global_distribution", "performance"],
          systemDesignDetails: {
            architectureFocus: ["global_distribution", "caching_strategies", "edge_computing", "content_optimization"],
            complexityLevel: "senior",
            leadershipAspects: ["infrastructure_planning", "cost_optimization", "global_team_coordination"],
            frameworks: ["caching_strategies", "load_balancing", "geographic_distribution"],
            evaluationCriteria: ["content_delivery_speed", "global_availability", "cost_efficiency", "cache_hit_ratio"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle cache invalidation across global edge nodes?",
              "How would you optimize for different content types?",
              "How would you implement intelligent routing?",
              "How would you handle DDoS attacks?"
            ],
            commonMistakes: [
              "Not considering cache invalidation complexity",
              "Ignoring geographic latency variations",
              "Not planning for traffic spikes",
              "Overlooking security considerations"
            ],
            keyTradeoffs: [
              "Cache duration vs. content freshness",
              "Edge node density vs. cost",
              "Performance vs. security",
              "Automation vs. control"
            ],
            resources: []
          }
        },
        {
          questionText: "Design a recommendation system for Amazon.com.",
          category: "machine_learning",
          difficulty: "Hard",
          isCritical: false,
          tags: ["recommendations", "machine_learning", "personalization", "e_commerce"],
          systemDesignDetails: {
            architectureFocus: ["machine_learning_systems", "real_time_personalization", "data_processing", "a_b_testing"],
            complexityLevel: "senior",
            leadershipAspects: ["data_science_collaboration", "product_metrics_optimization", "experimentation_culture"],
            frameworks: ["machine_learning_pipelines", "real_time_processing", "a_b_testing"],
            evaluationCriteria: ["recommendation_relevance", "conversion_improvement", "system_scalability", "model_performance"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle the cold start problem for new users?",
              "How would you incorporate real-time user behavior?",
              "How would you measure recommendation quality?",
              "How would you handle seasonal trends?"
            ],
            commonMistakes: [
              "Not addressing cold start problem",
              "Ignoring real-time behavior signals",
              "Not considering business objectives",
              "Overlooking recommendation diversity"
            ],
            keyTradeoffs: [
              "Personalization vs. diversity",
              "Real-time updates vs. computational cost",
              "Accuracy vs. explainability",
              "Exploration vs. exploitation"
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
        },
        {
          questionText: "Design YouTube or a large-scale video streaming platform.",
          category: "media_streaming",
          difficulty: "Hard",
          isCritical: true,
          tags: ["video_streaming", "cdn", "encoding", "recommendations"],
          systemDesignDetails: {
            architectureFocus: ["video_processing", "content_delivery", "recommendation_systems", "live_streaming"],
            complexityLevel: "senior",
            leadershipAspects: ["content_creator_ecosystem", "monetization_strategy", "global_infrastructure"],
            frameworks: ["video_encoding", "cdn_optimization", "recommendation_engines"],
            evaluationCriteria: ["video_quality", "streaming_performance", "content_discovery", "creator_satisfaction"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle live streaming at scale?",
              "How would you optimize video encoding for different devices?",
              "How would you implement content recommendation?",
              "How would you handle copyright detection?"
            ],
            commonMistakes: [
              "Not considering video encoding complexity",
              "Ignoring global content delivery challenges",
              "Not planning for live streaming requirements",
              "Overlooking content moderation needs"
            ],
            keyTradeoffs: [
              "Video quality vs. bandwidth/storage",
              "Real-time processing vs. cost",
              "Content discovery vs. creator fairness",
              "Global availability vs. content restrictions"
            ],
            resources: []
          }
        }
      ]
    },
    // Microsoft questions
    {
      companyName: "Microsoft",
      questions: [
        {
          questionText: "Design a system for real-time document co-authoring (like Office 365).",
          category: "collaboration_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["collaboration", "real_time", "conflict_resolution", "office"],
          systemDesignDetails: {
            architectureFocus: ["operational_transformation", "conflict_resolution", "real_time_sync", "version_control"],
            complexityLevel: "senior",
            leadershipAspects: ["user_experience_optimization", "enterprise_requirements", "security_compliance"],
            frameworks: ["operational_transformation", "conflict_resolution", "real_time_communication"],
            evaluationCriteria: ["collaboration_smoothness", "conflict_resolution_accuracy", "real_time_performance", "data_consistency"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle conflicting edits from multiple users?",
              "How would you implement undo/redo in a collaborative environment?",
              "How would you ensure document consistency?",
              "How would you handle offline editing?"
            ],
            commonMistakes: [
              "Not understanding operational transformation",
              "Ignoring conflict resolution complexity",
              "Not considering offline scenarios",
              "Overlooking version history requirements"
            ],
            keyTradeoffs: [
              "Real-time collaboration vs. consistency",
              "Feature richness vs. performance",
              "Conflict resolution accuracy vs. speed",
              "Offline capability vs. synchronization complexity"
            ],
            resources: []
          }
        },
        {
          questionText: "Design a cloud monitoring service (like Azure Monitor).",
          category: "monitoring_systems",
          difficulty: "Medium",
          isCritical: false,
          tags: ["monitoring", "observability", "alerting", "cloud"],
          systemDesignDetails: {
            architectureFocus: ["metrics_collection", "alerting_systems", "data_visualization", "anomaly_detection"],
            complexityLevel: "mid",
            leadershipAspects: ["devops_culture", "incident_response", "cost_optimization"],
            frameworks: ["time_series_databases", "alerting_systems", "data_aggregation"],
            evaluationCriteria: ["monitoring_coverage", "alert_accuracy", "query_performance", "cost_efficiency"],
            estimatedTimeMinutes: 40,
            followUpQuestions: [
              "How would you handle high-frequency metrics ingestion?",
              "How would you implement intelligent alerting?",
              "How would you optimize storage for time-series data?",
              "How would you handle multi-tenant isolation?"
            ],
            commonMistakes: [
              "Not considering metrics volume scaling",
              "Ignoring alert fatigue problems",
              "Not optimizing time-series storage",
              "Overlooking multi-tenancy requirements"
            ],
            keyTradeoffs: [
              "Monitoring granularity vs. storage cost",
              "Alert sensitivity vs. noise",
              "Real-time processing vs. resource usage",
              "Feature completeness vs. simplicity"
            ],
            resources: []
          }
        }
      ]
    },
    // OpenAI questions
    {
      companyName: "OpenAI",
      questions: [
        {
          questionText: "Design a system to serve a large language model (e.g., GPT-4) to millions of users with low latency.",
          category: "ai_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["llm", "ai_inference", "gpu_optimization", "latency"],
          systemDesignDetails: {
            architectureFocus: ["model_serving", "gpu_optimization", "request_batching", "caching_strategies"],
            complexityLevel: "senior",
            leadershipAspects: ["ai_infrastructure", "cost_optimization", "safety_considerations"],
            frameworks: ["model_serving", "gpu_optimization", "request_batching"],
            evaluationCriteria: ["inference_latency", "throughput", "cost_efficiency", "model_quality"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you optimize GPU utilization for inference?",
              "How would you handle request batching for efficiency?",
              "How would you implement model caching strategies?",
              "How would you ensure AI safety and content filtering?"
            ],
            commonMistakes: [
              "Not considering GPU memory constraints",
              "Ignoring request batching opportunities",
              "Not planning for model updates",
              "Overlooking safety and filtering requirements"
            ],
            keyTradeoffs: [
              "Latency vs. throughput optimization",
              "Model quality vs. inference speed",
              "Cost vs. performance",
              "Safety filtering vs. response time"
            ],
            resources: []
          }
        },
        {
          questionText: "Design a distributed training pipeline for large AI models.",
          category: "ai_systems",
          difficulty: "Hard",
          isCritical: false,
          tags: ["distributed_training", "model_parallelism", "data_parallelism", "gpu_clusters"],
          systemDesignDetails: {
            architectureFocus: ["distributed_training", "model_parallelism", "gradient_synchronization", "fault_tolerance"],
            complexityLevel: "senior",
            leadershipAspects: ["research_infrastructure", "experiment_management", "resource_allocation"],
            frameworks: ["distributed_training", "model_parallelism", "fault_tolerance"],
            evaluationCriteria: ["training_efficiency", "fault_tolerance", "resource_utilization", "experiment_reproducibility"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle node failures during training?",
              "How would you implement gradient synchronization?",
              "How would you optimize data loading for training?",
              "How would you manage experiment tracking and versioning?"
            ],
            commonMistakes: [
              "Not considering fault tolerance in long training runs",
              "Ignoring data loading bottlenecks",
              "Not planning for gradient synchronization complexity",
              "Overlooking experiment reproducibility"
            ],
            keyTradeoffs: [
              "Training speed vs. fault tolerance",
              "Model parallelism vs. data parallelism",
              "Resource utilization vs. cost",
              "Experiment flexibility vs. infrastructure complexity"
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
