
# System Design Questions for Engineering Managers

## Distributed Systems & Infrastructure

### Large-Scale Web Applications
- Design a social media platform like Facebook that can handle 2 billion users
- Design a video streaming service like Netflix for global scale
- Design a real-time messaging system like WhatsApp for 1 billion users
- Design a ride-sharing platform like Uber with real-time location tracking
- Design a content delivery network (CDN) for global content distribution

### Data Storage & Processing
- Design a distributed file storage system like Google Drive
- Design a time-series database for monitoring metrics at scale
- Design a distributed caching system like Redis Cluster
- Design a data pipeline for processing billions of events per day
- Design a backup and disaster recovery system for critical data

### Infrastructure & Monitoring
- Design a container orchestration platform like Kubernetes
- Design a monitoring and alerting system for microservices
- Design an auto-scaling system for cloud infrastructure
- Design a log aggregation and analysis system
- Design a service mesh for microservices communication

## Data & AI/ML Systems

### Search & Discovery
- Design a search engine like Google with ranking algorithms
- Design an autocomplete system for search queries
- Design a recommendation engine for e-commerce products
- Design a personalized news feed algorithm
- Design a fraud detection system using machine learning

### Analytics & Data Processing
- Design a real-time analytics dashboard for business metrics
- Design a data warehouse for business intelligence
- Design an A/B testing platform for feature experiments
- Design a customer segmentation system using ML
- Design a predictive analytics system for demand forecasting

### AI/ML Infrastructure
- Design a machine learning model training and deployment pipeline
- Design a feature store for ML model features
- Design a model serving infrastructure for real-time predictions
- Design an ML experiment tracking and model versioning system
- Design a data labeling platform for supervised learning

## Real-time & Communication Systems

### Messaging & Communication
- Design a chat application like Slack with channels and direct messages
- Design a video conferencing system like Zoom
- Design a notification system for mobile and web applications
- Design a real-time collaborative document editor like Google Docs
- Design a live streaming platform like Twitch

### Real-time Data Processing
- Design a real-time event processing system using stream processing
- Design a real-time leaderboard for online gaming
- Design a real-time fraud detection system for payments
- Design a real-time recommendation system for content
- Design a real-time monitoring dashboard for system health

### Social & Gaming Systems
- Design a multiplayer online game backend
- Design a social network with activity feeds and friend connections
- Design a dating app with matching algorithms
- Design a live sports scoring and statistics system
- Design a real-time auction system like eBay

## Product & Platform Systems

### E-commerce & Marketplace
- Design an e-commerce platform like Amazon with inventory management
- Design a payment processing system like PayPal
- Design a marketplace platform connecting buyers and sellers
- Design an order fulfillment and shipping system
- Design a pricing and promotion engine for e-commerce

### Content & Media Platforms
- Design a blogging platform like Medium with content management
- Design a photo sharing platform like Instagram
- Design a podcast hosting and streaming platform
- Design a digital library system for books and documents
- Design a content moderation system for user-generated content

### Business & Productivity Tools
- Design a project management tool like Jira
- Design a customer relationship management (CRM) system
- Design an email marketing platform
- Design a human resources management system
- Design a financial accounting and reporting system

## System Design Fundamentals

### Scalability Patterns
- How would you design a system to handle 10x traffic growth?
- Design a database sharding strategy for a growing application
- How would you implement horizontal scaling for stateless services?
- Design a caching strategy for a read-heavy application
- How would you handle database scaling for write-heavy workloads?

### Reliability & Availability
- Design a system with 99.99% uptime requirements
- How would you implement circuit breakers and fallback mechanisms?
- Design a multi-region deployment for disaster recovery
- How would you handle graceful degradation during peak traffic?
- Design a system to handle partial failures in distributed services

### Security & Compliance
- Design an authentication and authorization system
- How would you implement end-to-end encryption for messaging?
- Design a system to handle PCI compliance for payment processing
- How would you implement rate limiting and DDoS protection?
- Design a data privacy system compliant with GDPR

### Performance & Optimization
- How would you optimize database queries for a slow application?
- Design a system to minimize latency for global users
- How would you implement efficient data compression and storage?
- Design a system to handle real-time data processing with low latency
- How would you optimize mobile app performance and battery usage?

## Architecture & Design Patterns

### Microservices Architecture
- Design a microservices architecture for a monolithic application
- How would you handle service discovery and communication?
- Design an API gateway for microservices
- How would you implement distributed transactions across services?
- Design a service mesh for microservices security and observability

### Event-Driven Architecture
- Design an event-driven system using message queues
- How would you implement event sourcing for audit trails?
- Design a publish-subscribe system for real-time updates
- How would you handle event ordering and duplicate processing?
- Design a saga pattern for distributed transactions

### Data Architecture
- Design a lambda architecture for batch and real-time processing
- How would you implement a data lake for analytics?
- Design a master data management system
- How would you handle data synchronization across multiple systems?
- Design a data governance and quality management system

## Leadership & Technical Strategy

### Technology Selection
- How would you evaluate and select technologies for a new project?
- Design a technology migration strategy for legacy systems
- How would you balance innovation with stability in technology choices?
- Design a proof-of-concept process for new technologies
- How would you handle technical debt in system design decisions?

### Team & Process Design
- How would you structure engineering teams for a large-scale system?
- Design a development workflow for distributed teams
- How would you implement DevOps practices for system reliability?
- Design a code review and quality assurance process
- How would you handle knowledge sharing and documentation?

### Risk Management
- How would you identify and mitigate technical risks in system design?
- Design a capacity planning process for growing systems
- How would you handle vendor lock-in and technology dependencies?
- Design a business continuity plan for critical systems
- How would you balance feature development with system maintenance?

## Emerging Technologies

### Cloud-Native Systems
- Design a serverless architecture for event processing
- How would you implement infrastructure as code for cloud deployments?
- Design a multi-cloud strategy for vendor independence
- How would you optimize costs in cloud-native applications?
- Design a cloud migration strategy for on-premises systems

### Edge Computing & IoT
- Design an edge computing system for IoT devices
- How would you handle data processing at the edge vs. cloud?
- Design a system for managing millions of IoT devices
- How would you implement real-time analytics for sensor data?
- Design a system for over-the-air updates for IoT devices

### Blockchain & Distributed Ledger
- Design a blockchain-based supply chain tracking system
- How would you implement a cryptocurrency payment system?
- Design a decentralized identity management system
- How would you handle scalability challenges in blockchain systems?
- Design a smart contract platform for business processes
