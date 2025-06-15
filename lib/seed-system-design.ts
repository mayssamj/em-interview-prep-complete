
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
    },
    // Anthropic questions
    {
      companyName: "Anthropic",
      questions: [
        {
          questionText: "Design a system for safe AI model deployment with constitutional AI principles.",
          category: "ai_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["ai_safety", "constitutional_ai", "model_deployment", "safety_monitoring"],
          systemDesignDetails: {
            architectureFocus: ["ai_safety_systems", "constitutional_ai", "safety_monitoring", "model_alignment"],
            complexityLevel: "senior",
            leadershipAspects: ["ai_safety_culture", "ethical_considerations", "safety_first_mindset"],
            frameworks: ["constitutional_ai", "safety_monitoring", "model_alignment"],
            evaluationCriteria: ["safety_compliance", "model_helpfulness", "harm_prevention", "alignment_quality"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you implement constitutional AI training?",
              "How would you monitor for harmful outputs in real-time?",
              "How would you handle edge cases in AI safety?",
              "How would you ensure model alignment with human values?"
            ],
            commonMistakes: [
              "Not prioritizing safety over performance",
              "Ignoring constitutional AI principles",
              "Not implementing comprehensive safety monitoring",
              "Overlooking alignment verification"
            ],
            keyTradeoffs: [
              "Safety vs. model capability",
              "Constitutional constraints vs. helpfulness",
              "Real-time monitoring vs. latency",
              "Safety verification vs. deployment speed"
            ],
            resources: []
          }
        }
      ]
    },
    // Netflix questions
    {
      companyName: "Netflix",
      questions: [
        {
          questionText: "Design Netflix's content recommendation system.",
          category: "machine_learning",
          difficulty: "Hard",
          isCritical: true,
          tags: ["recommendations", "personalization", "content_discovery", "machine_learning"],
          systemDesignDetails: {
            architectureFocus: ["recommendation_systems", "personalization", "content_ranking", "a_b_testing"],
            complexityLevel: "senior",
            leadershipAspects: ["content_strategy", "user_engagement", "data_science_collaboration"],
            frameworks: ["collaborative_filtering", "content_based_filtering", "deep_learning"],
            evaluationCriteria: ["engagement_metrics", "content_discovery", "user_satisfaction", "business_impact"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle the cold start problem for new content?",
              "How would you incorporate viewing context (time, device)?",
              "How would you balance popular vs. niche content?",
              "How would you measure recommendation quality?"
            ],
            commonMistakes: [
              "Not considering content lifecycle",
              "Ignoring viewing context factors",
              "Not balancing exploration vs. exploitation",
              "Overlooking business objectives"
            ],
            keyTradeoffs: [
              "Personalization vs. content diversity",
              "Popular content vs. long-tail discovery",
              "Real-time updates vs. computational cost",
              "User satisfaction vs. business metrics"
            ],
            resources: []
          }
        },
        {
          questionText: "Design a global video streaming platform with adaptive bitrate.",
          category: "media_streaming",
          difficulty: "Hard",
          isCritical: true,
          tags: ["video_streaming", "adaptive_bitrate", "global_cdn", "quality_optimization"],
          systemDesignDetails: {
            architectureFocus: ["adaptive_streaming", "global_cdn", "video_encoding", "quality_optimization"],
            complexityLevel: "senior",
            leadershipAspects: ["global_infrastructure", "user_experience", "cost_optimization"],
            frameworks: ["adaptive_bitrate", "cdn_optimization", "video_encoding"],
            evaluationCriteria: ["streaming_quality", "global_performance", "cost_efficiency", "user_experience"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you implement adaptive bitrate streaming?",
              "How would you optimize for different network conditions?",
              "How would you handle global content distribution?",
              "How would you minimize buffering and startup time?"
            ],
            commonMistakes: [
              "Not considering network variability",
              "Ignoring device-specific optimizations",
              "Not planning for global latency",
              "Overlooking cost implications"
            ],
            keyTradeoffs: [
              "Video quality vs. bandwidth usage",
              "Startup time vs. quality",
              "Global consistency vs. local optimization",
              "Cost vs. performance"
            ],
            resources: []
          }
        }
      ]
    },
    // Uber questions
    {
      companyName: "Uber",
      questions: [
        {
          questionText: "Design Uber's real-time ride matching system.",
          category: "real_time_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["ride_matching", "real_time", "geospatial", "optimization"],
          systemDesignDetails: {
            architectureFocus: ["real_time_matching", "geospatial_systems", "optimization_algorithms", "mobile_systems"],
            complexityLevel: "senior",
            leadershipAspects: ["marketplace_dynamics", "user_experience", "operational_efficiency"],
            frameworks: ["geospatial_indexing", "real_time_processing", "optimization_algorithms"],
            evaluationCriteria: ["matching_efficiency", "wait_times", "system_scalability", "user_satisfaction"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle surge pricing algorithms?",
              "How would you optimize for driver utilization?",
              "How would you handle real-time location updates?",
              "How would you ensure fair matching algorithms?"
            ],
            commonMistakes: [
              "Not considering real-time constraints",
              "Ignoring geospatial complexity",
              "Not optimizing for marketplace balance",
              "Overlooking mobile network limitations"
            ],
            keyTradeoffs: [
              "Matching speed vs. optimization quality",
              "Driver utilization vs. passenger wait time",
              "Real-time updates vs. battery life",
              "Fairness vs. efficiency"
            ],
            resources: []
          }
        }
      ]
    },
    // Airbnb questions
    {
      companyName: "Airbnb",
      questions: [
        {
          questionText: "Design Airbnb's search and ranking system.",
          category: "search_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["search", "ranking", "personalization", "marketplace"],
          systemDesignDetails: {
            architectureFocus: ["search_systems", "ranking_algorithms", "personalization", "marketplace_dynamics"],
            complexityLevel: "senior",
            leadershipAspects: ["marketplace_balance", "user_experience", "business_optimization"],
            frameworks: ["search_engines", "ranking_algorithms", "personalization_systems"],
            evaluationCriteria: ["search_relevance", "booking_conversion", "user_satisfaction", "host_fairness"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you personalize search results?",
              "How would you handle location-based search?",
              "How would you balance guest preferences with host availability?",
              "How would you implement dynamic pricing suggestions?"
            ],
            commonMistakes: [
              "Not considering marketplace dynamics",
              "Ignoring location complexity",
              "Not balancing multiple stakeholders",
              "Overlooking seasonal patterns"
            ],
            keyTradeoffs: [
              "Personalization vs. discovery",
              "Guest satisfaction vs. host fairness",
              "Search accuracy vs. response time",
              "Business metrics vs. user experience"
            ],
            resources: []
          }
        }
      ]
    },
    // TikTok questions
    {
      companyName: "TikTok",
      questions: [
        {
          questionText: "Design TikTok's For You Page algorithm.",
          category: "machine_learning",
          difficulty: "Hard",
          isCritical: true,
          tags: ["recommendation_algorithm", "short_video", "engagement", "personalization"],
          systemDesignDetails: {
            architectureFocus: ["recommendation_systems", "real_time_personalization", "engagement_optimization", "content_understanding"],
            complexityLevel: "senior",
            leadershipAspects: ["content_creator_ecosystem", "user_engagement", "algorithmic_fairness"],
            frameworks: ["deep_learning", "real_time_processing", "content_analysis"],
            evaluationCriteria: ["user_engagement", "content_diversity", "creator_satisfaction", "platform_growth"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle new user cold start?",
              "How would you ensure content diversity?",
              "How would you incorporate real-time engagement signals?",
              "How would you prevent filter bubbles?"
            ],
            commonMistakes: [
              "Not considering content lifecycle",
              "Ignoring creator fairness",
              "Not handling engagement manipulation",
              "Overlooking content safety"
            ],
            keyTradeoffs: [
              "Engagement vs. content diversity",
              "Personalization vs. discovery",
              "Real-time updates vs. computational cost",
              "Creator reach vs. user preferences"
            ],
            resources: []
          }
        }
      ]
    },
    // LinkedIn questions
    {
      companyName: "LinkedIn",
      questions: [
        {
          questionText: "Design LinkedIn's professional network feed algorithm.",
          category: "social_networks",
          difficulty: "Hard",
          isCritical: true,
          tags: ["professional_network", "feed_algorithm", "content_ranking", "networking"],
          systemDesignDetails: {
            architectureFocus: ["social_graph_analysis", "content_ranking", "professional_relevance", "network_effects"],
            complexityLevel: "senior",
            leadershipAspects: ["professional_community", "content_quality", "network_growth"],
            frameworks: ["graph_algorithms", "content_ranking", "social_signals"],
            evaluationCriteria: ["professional_relevance", "engagement_quality", "network_growth", "content_value"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you rank professional content vs. personal updates?",
              "How would you leverage professional graph signals?",
              "How would you handle content from different industries?",
              "How would you promote meaningful professional interactions?"
            ],
            commonMistakes: [
              "Not considering professional context",
              "Ignoring network relationship strength",
              "Not balancing content types",
              "Overlooking professional relevance"
            ],
            keyTradeoffs: [
              "Professional relevance vs. engagement",
              "Network growth vs. content quality",
              "Industry focus vs. diversity",
              "Personal vs. professional content"
            ],
            resources: []
          }
        }
      ]
    },
    // Snowflake questions
    {
      companyName: "Snowflake",
      questions: [
        {
          questionText: "Design a cloud-native data warehouse with automatic scaling.",
          category: "data_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["data_warehouse", "cloud_native", "auto_scaling", "analytics"],
          systemDesignDetails: {
            architectureFocus: ["cloud_architecture", "auto_scaling", "data_storage", "query_optimization"],
            complexityLevel: "senior",
            leadershipAspects: ["data_strategy", "cost_optimization", "performance_engineering"],
            frameworks: ["cloud_architecture", "distributed_storage", "query_engines"],
            evaluationCriteria: ["query_performance", "cost_efficiency", "scalability", "data_freshness"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you implement automatic scaling for compute resources?",
              "How would you optimize for different query patterns?",
              "How would you handle data partitioning and clustering?",
              "How would you ensure data consistency across regions?"
            ],
            commonMistakes: [
              "Not considering cost implications of scaling",
              "Ignoring query optimization opportunities",
              "Not planning for data governance",
              "Overlooking multi-tenancy requirements"
            ],
            keyTradeoffs: [
              "Performance vs. cost",
              "Automatic scaling vs. predictability",
              "Data freshness vs. consistency",
              "Flexibility vs. optimization"
            ],
            resources: []
          }
        }
      ]
    },
    // Scale AI questions
    {
      companyName: "Scale AI",
      questions: [
        {
          questionText: "Design a system for large-scale data labeling and annotation.",
          category: "data_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["data_labeling", "annotation", "quality_control", "machine_learning"],
          systemDesignDetails: {
            architectureFocus: ["data_pipeline", "quality_control", "human_in_the_loop", "workflow_management"],
            complexityLevel: "senior",
            leadershipAspects: ["data_quality", "human_workforce_management", "ml_pipeline_integration"],
            frameworks: ["workflow_systems", "quality_control", "human_computer_interaction"],
            evaluationCriteria: ["annotation_quality", "throughput", "cost_efficiency", "turnaround_time"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you ensure annotation quality and consistency?",
              "How would you handle different types of data (text, image, video)?",
              "How would you implement quality control mechanisms?",
              "How would you scale human annotation workforce?"
            ],
            commonMistakes: [
              "Not considering annotation quality variance",
              "Ignoring human workflow optimization",
              "Not planning for different data types",
              "Overlooking quality control complexity"
            ],
            keyTradeoffs: [
              "Quality vs. speed",
              "Human annotation vs. automated labeling",
              "Cost vs. accuracy",
              "Scalability vs. quality control"
            ],
            resources: []
          }
        }
      ]
    },
    // Reddit questions
    {
      companyName: "Reddit",
      questions: [
        {
          questionText: "Design Reddit's content ranking and moderation system.",
          category: "content_systems",
          difficulty: "Hard",
          isCritical: true,
          tags: ["content_ranking", "moderation", "community", "voting_systems"],
          systemDesignDetails: {
            architectureFocus: ["voting_systems", "content_ranking", "community_moderation", "spam_detection"],
            complexityLevel: "senior",
            leadershipAspects: ["community_management", "content_policy", "platform_governance"],
            frameworks: ["ranking_algorithms", "moderation_systems", "community_governance"],
            evaluationCriteria: ["content_quality", "community_health", "engagement", "moderation_effectiveness"],
            estimatedTimeMinutes: 45,
            followUpQuestions: [
              "How would you handle vote manipulation and spam?",
              "How would you implement community-specific moderation?",
              "How would you balance free speech with content policy?",
              "How would you scale moderation across thousands of communities?"
            ],
            commonMistakes: [
              "Not considering community dynamics",
              "Ignoring vote manipulation",
              "Not scaling moderation effectively",
              "Overlooking content policy complexity"
            ],
            keyTradeoffs: [
              "Free speech vs. content moderation",
              "Community autonomy vs. platform standards",
              "Automated vs. human moderation",
              "Engagement vs. quality"
            ],
            resources: []
          }
        }
      ]
    },
    // Startups & Scale-ups questions
    {
      companyName: "Startups & Scale-ups",
      questions: [
        {
          questionText: "Design a scalable system architecture for a fast-growing startup.",
          category: "startup_systems",
          difficulty: "Medium",
          isCritical: true,
          tags: ["startup_architecture", "scalability", "cost_optimization", "rapid_growth"],
          systemDesignDetails: {
            architectureFocus: ["cost_effective_scaling", "rapid_iteration", "technical_debt_management", "team_productivity"],
            complexityLevel: "mid",
            leadershipAspects: ["resource_constraints", "rapid_scaling", "technical_decision_making"],
            frameworks: ["lean_architecture", "cloud_first", "iterative_development"],
            evaluationCriteria: ["cost_efficiency", "development_velocity", "scalability_potential", "technical_debt"],
            estimatedTimeMinutes: 40,
            followUpQuestions: [
              "How would you balance technical debt vs. feature velocity?",
              "How would you plan for uncertain scaling requirements?",
              "How would you optimize for limited engineering resources?",
              "How would you ensure system reliability with small team?"
            ],
            commonMistakes: [
              "Over-engineering for uncertain scale",
              "Not considering cost constraints",
              "Ignoring technical debt accumulation",
              "Not planning for team growth"
            ],
            keyTradeoffs: [
              "Perfect architecture vs. time to market",
              "Cost vs. scalability",
              "Feature velocity vs. technical debt",
              "Simplicity vs. future flexibility"
            ],
            resources: []
          }
        },
        {
          questionText: "Design a minimum viable product (MVP) architecture that can scale.",
          category: "startup_systems",
          difficulty: "Medium",
          isCritical: false,
          tags: ["mvp", "scalable_architecture", "lean_development", "product_market_fit"],
          systemDesignDetails: {
            architectureFocus: ["mvp_architecture", "scalability_planning", "lean_development", "iteration_speed"],
            complexityLevel: "mid",
            leadershipAspects: ["product_strategy", "engineering_efficiency", "market_validation"],
            frameworks: ["lean_startup", "agile_development", "cloud_native"],
            evaluationCriteria: ["time_to_market", "development_cost", "scalability_potential", "iteration_speed"],
            estimatedTimeMinutes: 35,
            followUpQuestions: [
              "How would you validate technical assumptions quickly?",
              "How would you plan for pivot scenarios?",
              "How would you balance MVP simplicity with future needs?",
              "How would you measure technical success metrics?"
            ],
            commonMistakes: [
              "Building too much for MVP",
              "Not considering future scaling",
              "Ignoring user feedback loops",
              "Over-optimizing prematurely"
            ],
            keyTradeoffs: [
              "MVP simplicity vs. future scalability",
              "Speed vs. quality",
              "Feature completeness vs. time to market",
              "Technical perfection vs. user validation"
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
