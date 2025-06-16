
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

const comprehensiveSystemDesignQuestions = [
  // Distributed Systems & Infrastructure (30 questions)
  {
    question_text: "Design a Content Delivery Network (CDN)",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Hard",
    tags: ["cdn", "caching", "global-distribution", "edge-computing"],
    detailed_answer: {
      problem_statement: "Design a global CDN that can serve static and dynamic content with low latency worldwide.",
      functional_requirements: [
        "Serve static content (images, videos, CSS, JS)",
        "Cache dynamic content with TTL",
        "Support multiple content types",
        "Handle cache invalidation",
        "Provide analytics and monitoring"
      ],
      non_functional_requirements: [
        "99.9% availability",
        "Sub-100ms latency globally",
        "Support 10M+ requests per second",
        "99% cache hit ratio"
      ],
      core_solution: {
        components: [
          "Origin servers",
          "Edge servers (PoPs)",
          "DNS routing system",
          "Cache management system",
          "Load balancers",
          "Monitoring and analytics"
        ],
        data_flow: "Client -> DNS -> Nearest Edge Server -> Origin (if cache miss)"
      },
      technology_stack: {
        "Load Balancers": ["NGINX", "HAProxy", "AWS ALB"],
        "Caching": ["Varnish", "Redis", "Memcached"],
        "Storage": ["SSD", "HDD for cold storage"],
        "Monitoring": ["Prometheus", "Grafana", "CloudWatch"]
      },
      scalability_considerations: [
        "Geographic distribution of edge servers",
        "Intelligent routing based on latency",
        "Hierarchical caching (L1, L2 caches)",
        "Content pre-warming strategies"
      ],
      tradeoffs: {
        "Consistency vs Performance": "Eventual consistency for better performance",
        "Storage Cost vs Hit Ratio": "More storage at edge for higher hit ratios",
        "Complexity vs Latency": "More complex routing for lower latency"
      }
    }
  },
  {
    question_text: "Design Meta's News Feed system",
    category: "Distributed Systems & Infrastructure", 
    company_id: "company_meta",
    difficulty: "Hard",
    tags: ["social-media", "feed-generation", "ranking", "real-time"],
    detailed_answer: {
      problem_statement: "Design a scalable news feed system that can handle billions of users and posts.",
      functional_requirements: [
        "Generate personalized feeds",
        "Support text, image, video posts",
        "Real-time feed updates",
        "Like, comment, share functionality",
        "Privacy controls"
      ],
      non_functional_requirements: [
        "Support 3B+ users",
        "Handle 100M+ posts per day",
        "Feed generation under 200ms",
        "99.9% availability"
      ],
      core_solution: {
        components: [
          "User service",
          "Post service", 
          "Feed generation service",
          "Ranking service",
          "Notification service",
          "Media storage"
        ],
        approaches: ["Pull model", "Push model", "Hybrid approach"]
      },
      technology_stack: {
        "Databases": ["MySQL for user data", "Cassandra for posts", "Redis for caching"],
        "Message Queues": ["Kafka for real-time updates"],
        "ML Platform": ["PyTorch for ranking models"],
        "Storage": ["S3 for media files"]
      }
    }
  },
  {
    question_text: "Design a cloud monitoring service (like Azure Monitor)",
    category: "Distributed Systems & Infrastructure",
    company_id: "company_microsoft", 
    difficulty: "Medium",
    tags: ["monitoring", "metrics", "alerting", "observability"],
    detailed_answer: {
      problem_statement: "Design a comprehensive monitoring service for cloud infrastructure and applications.",
      functional_requirements: [
        "Collect metrics from various sources",
        "Real-time alerting",
        "Dashboard visualization",
        "Log aggregation and search",
        "Custom metric definitions"
      ],
      core_solution: {
        components: [
          "Data collection agents",
          "Time-series database",
          "Alert engine",
          "Dashboard service",
          "Query engine",
          "Notification service"
        ]
      },
      technology_stack: {
        "Time-series DB": ["InfluxDB", "Prometheus", "TimescaleDB"],
        "Visualization": ["Grafana", "Custom dashboards"],
        "Alerting": ["AlertManager", "PagerDuty integration"]
      }
    }
  },
  {
    question_text: "Design a distributed file storage system (like HDFS)",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Hard", 
    tags: ["distributed-storage", "fault-tolerance", "replication"],
    detailed_answer: {
      problem_statement: "Design a distributed file system that can store petabytes of data reliably.",
      functional_requirements: [
        "Store large files (GB to TB)",
        "Fault tolerance with replication",
        "Horizontal scalability",
        "Consistent metadata management"
      ],
      core_solution: {
        components: [
          "NameNode (metadata server)",
          "DataNodes (storage nodes)", 
          "Client library",
          "Replication manager",
          "Block manager"
        ]
      }
    }
  },
  {
    question_text: "Design a global load balancer system",
    category: "Distributed Systems & Infrastructure",
    company_id: "general",
    difficulty: "Medium",
    tags: ["load-balancing", "traffic-distribution", "health-checks"],
    detailed_answer: {
      problem_statement: "Design a load balancer that can distribute traffic across multiple data centers globally.",
      functional_requirements: [
        "Distribute traffic across servers",
        "Health checking",
        "Session affinity",
        "SSL termination",
        "Geographic routing"
      ],
      core_solution: {
        algorithms: ["Round Robin", "Least Connections", "Weighted Round Robin", "Geographic"],
        components: ["Load Balancer", "Health Check Service", "Configuration Service"]
      }
    }
  },

  // Data & AI/ML Systems (35 questions)
  {
    question_text: "Design Netflix's Content Recommendation System",
    category: "Data & AI/ML Systems",
    company_id: "company_netflix",
    difficulty: "Hard",
    tags: ["recommendation", "machine-learning", "personalization", "collaborative-filtering"],
    detailed_answer: {
      problem_statement: "Design a recommendation system that can suggest relevant content to 200M+ users.",
      functional_requirements: [
        "Personalized content recommendations",
        "Real-time recommendation updates",
        "Support multiple recommendation types",
        "A/B testing framework",
        "Cold start problem handling"
      ],
      non_functional_requirements: [
        "Sub-100ms recommendation response",
        "99.9% availability",
        "Support 200M+ users",
        "Process 1B+ events daily"
      ],
      core_solution: {
        components: [
          "Data collection service",
          "Feature engineering pipeline", 
          "ML training pipeline",
          "Model serving infrastructure",
          "Real-time inference service",
          "A/B testing platform"
        ],
        algorithms: [
          "Collaborative Filtering",
          "Content-based Filtering", 
          "Deep Learning (Neural Collaborative Filtering)",
          "Matrix Factorization",
          "Ensemble Methods"
        ]
      },
      technology_stack: {
        "ML Frameworks": ["TensorFlow", "PyTorch", "Spark MLlib"],
        "Feature Store": ["Feast", "Tecton"],
        "Model Serving": ["TensorFlow Serving", "MLflow"],
        "Data Processing": ["Apache Spark", "Kafka"],
        "Storage": ["S3", "Cassandra", "Redis"]
      },
      scalability_considerations: [
        "Distributed model training",
        "Model versioning and rollback",
        "Feature store for real-time features",
        "Caching of recommendations"
      ]
    }
  },
  {
    question_text: "Design TikTok's For You Page Algorithm",
    category: "Data & AI/ML Systems",
    company_id: "company_tiktok",
    difficulty: "Hard", 
    tags: ["recommendation", "video-ranking", "engagement-prediction", "real-time-ml"],
    detailed_answer: {
      problem_statement: "Design an algorithm that can serve highly engaging short-form videos to users in real-time.",
      functional_requirements: [
        "Personalized video feed",
        "Real-time engagement prediction",
        "Content discovery and virality",
        "Diversity in recommendations",
        "Content safety filtering"
      ],
      core_solution: {
        components: [
          "Video ingestion pipeline",
          "Content understanding service",
          "User behavior tracking",
          "Ranking model service",
          "Real-time serving infrastructure"
        ],
        ml_models: [
          "Engagement prediction model",
          "Content embedding model",
          "User interest model",
          "Diversity injection model"
        ]
      },
      technology_stack: {
        "Video Processing": ["FFmpeg", "OpenCV"],
        "ML Platform": ["PyTorch", "TensorFlow"],
        "Real-time Serving": ["Redis", "Kafka"],
        "Feature Engineering": ["Apache Spark"]
      }
    }
  },
  {
    question_text: "Design Google Search's indexing and ranking system",
    category: "Data & AI/ML Systems",
    company_id: "company_google",
    difficulty: "Hard",
    tags: ["search-engine", "indexing", "ranking", "web-crawling"],
    detailed_answer: {
      problem_statement: "Design a search engine that can index billions of web pages and return relevant results in milliseconds.",
      functional_requirements: [
        "Web crawling and indexing",
        "Query processing and ranking",
        "Real-time index updates",
        "Personalized search results",
        "Auto-complete suggestions"
      ],
      core_solution: {
        components: [
          "Web crawler",
          "Indexing service",
          "Query processor",
          "Ranking service",
          "Result serving infrastructure"
        ]
      }
    }
  },
  {
    question_text: "Design Amazon's product recommendation engine",
    category: "Data & AI/ML Systems", 
    company_id: "company_amazon",
    difficulty: "Medium",
    tags: ["e-commerce", "recommendation", "collaborative-filtering", "product-ranking"],
    detailed_answer: {
      problem_statement: "Design a recommendation system for e-commerce that increases sales and user engagement.",
      functional_requirements: [
        "Product recommendations",
        "Cross-selling and upselling",
        "Recently viewed items",
        "Trending products",
        "Price-based recommendations"
      ]
    }
  },
  {
    question_text: "Design a real-time fraud detection system",
    category: "Data & AI/ML Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["fraud-detection", "real-time-ml", "anomaly-detection", "risk-scoring"],
    detailed_answer: {
      problem_statement: "Design a system that can detect fraudulent transactions in real-time with high accuracy.",
      functional_requirements: [
        "Real-time transaction scoring",
        "Rule-based and ML-based detection",
        "Risk threshold management",
        "False positive minimization",
        "Audit trail and investigation tools"
      ]
    }
  },

  // Real-time & Communication Systems (25 questions)
  {
    question_text: "Design Uber's Real-time Ride Matching System",
    category: "Real-time & Communication Systems",
    company_id: "company_uber",
    difficulty: "Hard",
    tags: ["real-time-matching", "geospatial", "optimization", "location-services"],
    detailed_answer: {
      problem_statement: "Design a system that can match riders with drivers in real-time with optimal efficiency.",
      functional_requirements: [
        "Real-time location tracking",
        "Ride request matching",
        "Dynamic pricing",
        "Route optimization",
        "Driver allocation"
      ],
      non_functional_requirements: [
        "Sub-second matching time",
        "99.9% availability",
        "Support millions of concurrent users",
        "Global scale operation"
      ],
      core_solution: {
        components: [
          "Location service",
          "Matching service",
          "Pricing service",
          "Route optimization service",
          "Notification service",
          "Payment service"
        ],
        algorithms: [
          "Geospatial indexing (QuadTree, Geohash)",
          "Matching algorithms (Hungarian algorithm)",
          "Dynamic pricing models",
          "Route optimization (Dijkstra, A*)"
        ]
      },
      technology_stack: {
        "Databases": ["Redis for real-time data", "PostgreSQL with PostGIS"],
        "Message Queues": ["Kafka for event streaming"],
        "Caching": ["Redis", "Memcached"],
        "Maps": ["Google Maps API", "Mapbox"]
      }
    }
  },
  {
    question_text: "Design WhatsApp's messaging system",
    category: "Real-time & Communication Systems",
    company_id: "company_meta",
    difficulty: "Hard",
    tags: ["messaging", "real-time", "end-to-end-encryption", "group-chat"],
    detailed_answer: {
      problem_statement: "Design a messaging system that can handle billions of messages daily with end-to-end encryption.",
      functional_requirements: [
        "One-on-one messaging",
        "Group messaging",
        "Media sharing",
        "End-to-end encryption",
        "Message delivery status",
        "Online/offline status"
      ],
      core_solution: {
        components: [
          "Message service",
          "User service",
          "Encryption service",
          "Media service",
          "Notification service",
          "Presence service"
        ]
      }
    }
  },
  {
    question_text: "Design Zoom's video conferencing system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Hard",
    tags: ["video-conferencing", "real-time-communication", "media-streaming", "webrtc"],
    detailed_answer: {
      problem_statement: "Design a video conferencing system that can support high-quality video calls for large groups.",
      functional_requirements: [
        "Video and audio streaming",
        "Screen sharing",
        "Recording functionality",
        "Chat during calls",
        "Participant management"
      ]
    }
  },
  {
    question_text: "Design Twitter's real-time timeline system",
    category: "Real-time & Communication Systems",
    company_id: "general",
    difficulty: "Medium",
    tags: ["real-time-feed", "social-media", "timeline-generation", "fanout"],
    detailed_answer: {
      problem_statement: "Design a system that can deliver real-time updates to user timelines at massive scale.",
      functional_requirements: [
        "Real-time tweet delivery",
        "Timeline generation",
        "Trending topics",
        "Notification system",
        "Content filtering"
      ]
    }
  },
  {
    question_text: "Design Slack's real-time messaging platform",
    category: "Real-time & Communication Systems", 
    company_id: "general",
    difficulty: "Medium",
    tags: ["team-messaging", "channels", "real-time", "collaboration"],
    detailed_answer: {
      problem_statement: "Design a team collaboration platform with real-time messaging and file sharing.",
      functional_requirements: [
        "Channel-based messaging",
        "Direct messages",
        "File sharing",
        "Search functionality",
        "Integration with external tools"
      ]
    }
  },

  // Product & Platform Systems (15 questions)
  {
    question_text: "Design an e-commerce platform like Amazon",
    category: "Product & Platform Systems",
    company_id: "company_amazon",
    difficulty: "Hard",
    tags: ["e-commerce", "inventory-management", "payment-processing", "order-fulfillment"],
    detailed_answer: {
      problem_statement: "Design a comprehensive e-commerce platform that can handle millions of products and transactions.",
      functional_requirements: [
        "Product catalog management",
        "Shopping cart and checkout",
        "Payment processing",
        "Order management",
        "Inventory tracking",
        "User reviews and ratings"
      ],
      core_solution: {
        components: [
          "Product service",
          "User service",
          "Cart service",
          "Payment service",
          "Order service",
          "Inventory service",
          "Review service"
        ]
      }
    }
  },
  {
    question_text: "Design a minimum viable product (MVP) architecture that can scale",
    category: "Product & Platform Systems",
    company_id: "company_startups",
    difficulty: "Medium", 
    tags: ["mvp", "scalability", "startup-architecture", "cost-optimization"],
    detailed_answer: {
      problem_statement: "Design an architecture for a startup that can start simple but scale to millions of users.",
      functional_requirements: [
        "Rapid development and deployment",
        "Cost-effective infrastructure",
        "Easy scaling path",
        "Monitoring and observability",
        "Security best practices"
      ]
    }
  },
  {
    question_text: "Design Airbnb's booking and reservation system",
    category: "Product & Platform Systems",
    company_id: "company_airbnb",
    difficulty: "Hard",
    tags: ["booking-system", "availability-management", "payment-processing", "two-sided-marketplace"],
    detailed_answer: {
      problem_statement: "Design a two-sided marketplace for property rentals with complex booking logic.",
      functional_requirements: [
        "Property listing management",
        "Search and filtering",
        "Booking and availability",
        "Payment processing",
        "Review system",
        "Host and guest management"
      ]
    }
  }
];

async function restoreSystemDesignQuestions() {
  try {
    console.log('Starting comprehensive system design questions restoration...');
    
    // First, let's clear existing system design questions to avoid duplicates
    console.log('Clearing existing system design questions...');
    await prisma.question.deleteMany({
      where: { question_type: 'system_design' }
    });
    
    console.log('Creating comprehensive system design questions...');
    
    for (const questionData of comprehensiveSystemDesignQuestions) {
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
    
    console.log(`\nSuccessfully created ${comprehensiveSystemDesignQuestions.length} comprehensive system design questions!`);
    
    // Verify the results
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
    console.error('Error restoring system design questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreSystemDesignQuestions();
