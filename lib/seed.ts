
import { prisma } from './db';
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

const companyData = {
  microsoft: {
    name: "Microsoft",
    values: [
      "Respect: We are each responsible for creating an inclusive culture",
      "Integrity: We are each responsible for creating a culture of integrity",
      "Accountability: We are each responsible for our company, our customers, our partners, and ourselves"
    ],
    evaluationCriteria: [
      "Leadership and People Management (coaching, developing talent, building inclusive teams)",
      "Technical Excellence and Innovation (system design, technical decision-making, staying current)",
      "Customer Focus and Business Impact (understanding customer needs, driving results)",
      "Collaboration and Communication (cross-functional partnership, influence without authority)",
      "Growth Mindset and Learning Agility (continuous improvement, adapting to change)",
      "Cultural Fit (alignment with Microsoft values, diversity and inclusion commitment)"
    ],
    interviewFormat: "Multi-stage process: 1. Resume screening and recruiter phone screen (30 min: background, motivation, basic behavioral). 2. Technical phone screen (45-60 min: coding, system design basics). 3. Virtual or onsite loop (4-6 interviews, 45-60 min each): Behavioral/Leadership interviews (2-3 rounds), Technical interviews (coding, system design), Cross-functional collaboration scenarios, As Appropriate (AA) interview with senior leader. Focus on growth mindset, inclusive leadership, and technical depth.",
    successTips: [
      "Demonstrate growth mindset through examples of learning from failures and continuous improvement",
      "Show commitment to diversity and inclusion with specific examples",
      "Prepare technical examples showing innovation and customer impact",
      "Use STAR method with emphasis on collaboration and inclusive leadership",
      "Research Microsoft's recent initiatives and cultural transformation",
      "Show passion for empowering others and creating inclusive environments"
    ],
    redFlags: [
      "Fixed mindset or inability to discuss failures constructively",
      "Lack of awareness about diversity and inclusion importance",
      "Poor technical depth for engineering management role",
      "Inability to show customer focus or business impact",
      "Negative attitude toward change or learning new technologies"
    ]
  },
  openai: {
    name: "OpenAI",
    values: [
      "AGI Safety: Ensuring artificial general intelligence benefits all of humanity",
      "Broad Benefit: Distributing benefits of AI broadly and fairly",
      "Long-term Safety: Prioritizing safety research and responsible deployment",
      "Technical Leadership: Pushing the boundaries of AI capabilities",
      "Transparency: Being open about our research and limitations"
    ],
    evaluationCriteria: [
      "AI/ML Technical Expertise (deep understanding of machine learning, neural networks, AI systems)",
      "Safety-First Mindset (commitment to responsible AI development and deployment)",
      "Research and Innovation Leadership (ability to drive cutting-edge research)",
      "Cross-functional Collaboration (working with researchers, product, policy teams)",
      "Ethical Decision-Making (navigating complex AI ethics and safety considerations)",
      "Mission Alignment (genuine commitment to beneficial AGI development)"
    ],
    interviewFormat: "Rigorous process: 1. Application review focusing on AI/ML background. 2. Technical screening (60 min: ML concepts, system design for AI systems). 3. Research discussion (45 min: discussing published work or research interests). 4. Onsite loop (5-6 interviews): Technical deep-dive (AI/ML systems), Research presentation, Safety and ethics discussion, Leadership and collaboration scenarios, Mission alignment conversation. Strong emphasis on both technical depth and safety consciousness.",
    successTips: [
      "Demonstrate deep technical knowledge of AI/ML systems and current research",
      "Show genuine commitment to AI safety and responsible development",
      "Prepare to discuss ethical implications of AI technology",
      "Have examples of leading technical teams in ambiguous, cutting-edge domains",
      "Stay current with latest AI research and OpenAI's publications",
      "Show ability to balance innovation with safety considerations"
    ],
    redFlags: [
      "Lack of genuine interest in AI safety and responsible development",
      "Insufficient technical depth in AI/ML for the role level",
      "Inability to discuss ethical implications of AI technology",
      "Overemphasis on speed without considering safety implications",
      "Poor understanding of current AI research landscape"
    ]
  },
  snowflake: {
    name: "Snowflake",
    values: [
      "Put Customers First",
      "Integrity Always",
      "Think Big",
      "Be Excellent",
      "Get It Done",
      "Own It",
      "Embrace Each Other's Differences"
    ],
    evaluationCriteria: [
      "Data Platform Expertise (understanding of data warehousing, cloud platforms, analytics)",
      "Customer-Centric Leadership (focus on customer success and value delivery)",
      "Technical Excellence (system design, scalability, performance optimization)",
      "Execution and Results (ability to deliver complex projects on time)",
      "Team Building and Collaboration (building high-performing engineering teams)",
      "Innovation and Strategic Thinking (driving product innovation and technical strategy)"
    ],
    interviewFormat: "Comprehensive process: 1. Recruiter screening (30 min: background, motivation, culture fit). 2. Technical phone screen (45 min: system design, data platform concepts). 3. Virtual panel interviews (4-5 sessions, 45 min each): Technical leadership scenarios, Data platform architecture discussion, People management and team building, Customer focus and business impact, Cultural fit and values alignment. Strong focus on data platform experience and customer obsession.",
    successTips: [
      "Demonstrate deep understanding of data platforms, warehousing, and cloud technologies",
      "Show customer obsession with specific examples of driving customer value",
      "Prepare technical examples related to data processing, analytics, or cloud platforms",
      "Emphasize execution excellence and ability to deliver results",
      "Show experience building and scaling engineering teams",
      "Research Snowflake's technology and competitive landscape"
    ],
    redFlags: [
      "Lack of data platform or cloud technology experience",
      "Inability to demonstrate customer focus",
      "Poor execution track record or inability to deliver results",
      "Weak technical depth for data engineering leadership role",
      "Lack of experience scaling engineering teams"
    ]
  },
  anthropic: {
    name: "Anthropic",
    values: [
      "AI Safety: Building AI systems that are safe, beneficial, and understandable",
      "Research Excellence: Conducting rigorous, high-quality research",
      "Responsible Development: Thoughtful and careful approach to AI development",
      "Transparency: Being open about our research and its implications",
      "Collaboration: Working together to solve complex challenges"
    ],
    evaluationCriteria: [
      "AI Safety Expertise (deep understanding of AI alignment, safety research, responsible AI)",
      "Research Leadership (ability to drive and evaluate cutting-edge AI research)",
      "Technical Excellence (strong ML/AI engineering and system design skills)",
      "Ethical Reasoning (thoughtful approach to AI ethics and safety considerations)",
      "Cross-functional Leadership (managing researchers, engineers, and safety teams)",
      "Mission Alignment (genuine commitment to safe and beneficial AI)"
    ],
    interviewFormat: "Research-focused process: 1. Application review emphasizing AI safety background. 2. Technical screening (60 min: AI safety concepts, ML systems design). 3. Research discussion (60 min: AI safety research, alignment problems). 4. Onsite interviews (5-6 sessions): Technical leadership in AI safety, Research methodology and evaluation, Safety-first engineering practices, Team leadership and collaboration, Mission and values alignment. Heavy emphasis on AI safety knowledge and research experience.",
    successTips: [
      "Demonstrate deep knowledge of AI safety research and alignment problems",
      "Show experience with responsible AI development practices",
      "Prepare to discuss technical approaches to AI safety and interpretability",
      "Have examples of leading teams in research-oriented environments",
      "Stay current with AI safety literature and Anthropic's research",
      "Show ability to balance research goals with practical engineering constraints"
    ],
    redFlags: [
      "Lack of genuine interest or knowledge in AI safety",
      "Insufficient research background or methodology understanding",
      "Inability to discuss AI alignment and safety challenges",
      "Overemphasis on capability advancement without safety considerations",
      "Poor fit for research-oriented culture"
    ]
  },
  scaleai: {
    name: "Scale AI",
    values: [
      "Accelerate AI: Helping AI applications reach production faster",
      "Data Excellence: Providing the highest quality training data",
      "Customer Success: Enabling our customers to build better AI",
      "Innovation: Pushing the boundaries of data and AI technology",
      "Execution: Delivering results with speed and precision"
    ],
    evaluationCriteria: [
      "AI/ML Platform Experience (building systems for AI training and deployment)",
      "Data Engineering Excellence (large-scale data processing, quality, and infrastructure)",
      "Product and Customer Focus (understanding AI customer needs and use cases)",
      "Scaling and Performance (building systems that handle massive scale)",
      "Team Leadership (building and managing high-performing engineering teams)",
      "Startup Agility (thriving in fast-paced, high-growth environment)"
    ],
    interviewFormat: "Fast-paced process: 1. Recruiter screening (30 min: background, startup fit, motivation). 2. Technical phone screen (45 min: system design for AI/data platforms). 3. Onsite loop (4-5 interviews, 45 min each): Technical leadership and architecture, Data platform and ML systems design, People management and team scaling, Product thinking and customer focus, Culture fit and startup mentality. Emphasis on ability to move fast and scale systems.",
    successTips: [
      "Show experience building AI/ML platforms or data infrastructure at scale",
      "Demonstrate ability to move fast and iterate quickly",
      "Prepare examples of scaling engineering teams in high-growth environments",
      "Show understanding of AI training data challenges and solutions",
      "Emphasize customer focus and product thinking",
      "Research Scale AI's platform and customer use cases"
    ],
    redFlags: [
      "Lack of AI/ML or data platform experience",
      "Inability to work in fast-paced, ambiguous environments",
      "Poor track record of scaling teams or systems",
      "Lack of customer or product focus",
      "Inability to demonstrate startup mentality and agility"
    ]
  },
  netflix: {
    name: "Netflix",
    values: [
      "Judgment: Making wise decisions despite ambiguity",
      "Communication: Listening well and communicating clearly",
      "Impact: Accomplishing amazing amounts of important work",
      "Curiosity: Learning rapidly and eagerly",
      "Innovation: Creating new ideas that prove useful",
      "Courage: Saying what you think when it's in Netflix's best interest",
      "Passion: Inspiring others with your thrill for excellence",
      "Honesty: Being known for candor and directness",
      "Selflessness: Seeking what's best for Netflix rather than yourself"
    ],
    evaluationCriteria: [
      "High Performance Culture Fit (thriving in freedom and responsibility environment)",
      "Technical Excellence (streaming technology, distributed systems, data platforms)",
      "Innovation and Experimentation (A/B testing, data-driven decision making)",
      "Global Scale Experience (building systems for hundreds of millions of users)",
      "Leadership and Talent Density (hiring and developing exceptional talent)",
      "Business Impact (understanding entertainment industry and customer experience)"
    ],
    interviewFormat: "Culture-focused process: 1. Recruiter screening (45 min: culture fit, high performance mindset). 2. Technical phone screen (60 min: distributed systems, streaming technology). 3. Onsite loop (5-6 interviews, 60 min each): Technical leadership and architecture, Data and experimentation platforms, People management and culture building, Innovation and product thinking, Values and culture deep-dive, Business impact and strategy. Strong emphasis on culture fit and high performance.",
    successTips: [
      "Demonstrate high performance mindset and results-oriented approach",
      "Show experience with large-scale distributed systems and streaming technology",
      "Prepare examples of data-driven decision making and experimentation",
      "Emphasize innovation and ability to work with ambiguity",
      "Show experience building high-performing, diverse teams",
      "Research Netflix's technology stack and engineering culture"
    ],
    redFlags: [
      "Poor fit for high-performance, freedom and responsibility culture",
      "Lack of experience with large-scale distributed systems",
      "Inability to demonstrate innovation or experimentation mindset",
      "Poor communication or feedback skills",
      "Lack of business impact or customer focus"
    ]
  },
  linkedin: {
    name: "LinkedIn",
    values: [
      "Members First: Putting our members at the center of everything we do",
      "Relationships Matter: Building authentic relationships and trust",
      "Be Open, Honest and Constructive: Communicating with transparency",
      "Demand Excellence: Setting high standards and delivering quality",
      "Take Intelligent Risks: Being bold and innovative",
      "Act Like an Owner: Taking responsibility and thinking long-term"
    ],
    evaluationCriteria: [
      "Professional Network Understanding (deep knowledge of professional networking and career development)",
      "Data and AI Expertise (recommendation systems, search, professional insights)",
      "Member-Centric Leadership (focus on member value and professional success)",
      "Technical Excellence (large-scale systems, data platforms, machine learning)",
      "Business Acumen (understanding of professional services and B2B markets)",
      "Inclusive Leadership (building diverse teams and inclusive products)"
    ],
    interviewFormat: "Professional-focused process: 1. Recruiter screening (30 min: background, LinkedIn passion, culture fit). 2. Technical phone screen (45 min: system design, data platforms). 3. Onsite loop (4-5 interviews, 45 min each): Technical leadership and architecture, Data and ML systems design, People management and team building, Product thinking and member focus, Culture and values alignment. Strong emphasis on member obsession and professional networking understanding.",
    successTips: [
      "Show genuine passion for professional networking and career development",
      "Demonstrate experience with recommendation systems, search, or social platforms",
      "Prepare examples of member/user-centric product development",
      "Show experience building inclusive and diverse engineering teams",
      "Emphasize data-driven approach to product and engineering decisions",
      "Research LinkedIn's platform, member needs, and competitive landscape"
    ],
    redFlags: [
      "Lack of understanding or passion for professional networking",
      "Insufficient experience with social platforms or recommendation systems",
      "Poor member/user focus or customer empathy",
      "Weak data and analytics background",
      "Inability to demonstrate inclusive leadership"
    ]
  },
  uber: {
    name: "Uber",
    values: [
      "We Build Globally: Thinking globally and acting locally",
      "We Are Customer Obsessed: Putting riders and drivers first",
      "We Celebrate Differences: Embracing diversity and inclusion",
      "We Do the Right Thing: Acting with integrity and transparency",
      "We Act Like Owners: Taking responsibility and thinking long-term",
      "We Persevere: Overcoming challenges with grit and determination"
    ],
    evaluationCriteria: [
      "Marketplace and Platform Experience (two-sided markets, supply-demand optimization)",
      "Global Scale and Localization (building products for diverse global markets)",
      "Real-time Systems Expertise (location services, routing, real-time matching)",
      "Operational Excellence (reliability, safety, regulatory compliance)",
      "Growth and Experimentation (scaling platforms, A/B testing, growth metrics)",
      "Leadership in Complex Environments (managing through rapid change and challenges)"
    ],
    interviewFormat: "Marketplace-focused process: 1. Recruiter screening (30 min: background, Uber mission alignment). 2. Technical phone screen (45 min: distributed systems, real-time platforms). 3. Onsite loop (4-5 interviews, 45 min each): Technical leadership and marketplace systems, Real-time platform architecture, People management and scaling teams, Product strategy and growth, Culture and values alignment. Strong focus on marketplace dynamics and global scale.",
    successTips: [
      "Demonstrate understanding of marketplace dynamics and two-sided platforms",
      "Show experience with real-time systems, location services, or matching algorithms",
      "Prepare examples of building products for global, diverse markets",
      "Emphasize operational excellence and reliability in critical systems",
      "Show experience scaling teams and systems through rapid growth",
      "Research Uber's platform, marketplace challenges, and global expansion"
    ],
    redFlags: [
      "Lack of marketplace or platform experience",
      "Insufficient understanding of real-time systems and scalability",
      "Poor operational mindset or reliability focus",
      "Inability to work in fast-paced, complex environments",
      "Lack of global perspective or cultural sensitivity"
    ]
  },
  airbnb: {
    name: "Airbnb",
    values: [
      "Champion the Mission: Creating a world where anyone can belong anywhere",
      "Be a Host: Treating others with respect and care",
      "Embrace the Adventure: Being bold and taking smart risks",
      "Be a Cereal Entrepreneur: Being resourceful and creative"
    ],
    evaluationCriteria: [
      "Marketplace and Trust & Safety Expertise (two-sided marketplace, user safety, fraud prevention)",
      "Global Community Building (understanding diverse cultures and local markets)",
      "Product and Design Thinking (user experience, host and guest journey optimization)",
      "Data-Driven Decision Making (experimentation, analytics, growth metrics)",
      "Inclusive Leadership (building diverse teams and inclusive products)",
      "Mission Alignment (genuine belief in belonging and community building)"
    ],
    interviewFormat: "Community-focused process: 1. Recruiter screening (30 min: background, mission alignment, culture fit). 2. Technical phone screen (45 min: system design, marketplace platforms). 3. Onsite loop (4-5 interviews, 45 min each): Technical leadership and marketplace systems, Trust & safety and platform integrity, People management and inclusive leadership, Product thinking and community building, Culture and mission alignment. Strong emphasis on belonging and community values.",
    successTips: [
      "Show genuine passion for community building and creating belonging",
      "Demonstrate experience with marketplace platforms and trust & safety",
      "Prepare examples of building inclusive products and teams",
      "Show understanding of global markets and cultural sensitivity",
      "Emphasize user experience and host/guest journey optimization",
      "Research Airbnb's community, trust & safety challenges, and global expansion"
    ],
    redFlags: [
      "Lack of passion for community building or belonging mission",
      "Insufficient marketplace or trust & safety experience",
      "Poor cultural sensitivity or global perspective",
      "Weak product thinking or user experience focus",
      "Inability to demonstrate inclusive leadership"
    ]
  },
  tiktok: {
    name: "TikTok",
    values: [
      "Lead with Curiosity: Always learning and exploring new possibilities",
      "Aim for the Extraordinary: Setting ambitious goals and exceeding expectations",
      "Seek Truth and Be Transparent: Being honest and open in all interactions",
      "Act with Integrity: Doing the right thing even when no one is watching",
      "Be Humble and Open: Learning from others and embracing feedback"
    ],
    evaluationCriteria: [
      "Social Media and Content Platform Expertise (recommendation algorithms, content moderation, creator tools)",
      "Global Scale and Performance (serving billions of users with low latency)",
      "AI and Machine Learning Leadership (recommendation systems, content understanding, personalization)",
      "Content Safety and Moderation (building safe, positive community experiences)",
      "Creator Economy Understanding (monetization, creator tools, community building)",
      "Cross-Cultural Leadership (managing global, diverse teams and products)"
    ],
    interviewFormat: "Global-scale process: 1. Recruiter screening (30 min: background, global mindset, culture fit). 2. Technical phone screen (45 min: large-scale systems, ML/AI platforms). 3. Onsite loop (4-5 interviews, 45 min each): Technical leadership and recommendation systems, Content platform and safety architecture, People management and global team leadership, Product strategy and creator economy, Culture and values alignment. Strong focus on AI/ML and global scale.",
    successTips: [
      "Demonstrate experience with recommendation systems and content platforms",
      "Show understanding of content moderation and safety challenges",
      "Prepare examples of building AI/ML systems at massive scale",
      "Emphasize global perspective and cross-cultural leadership",
      "Show experience with creator economy or social media platforms",
      "Research TikTok's algorithm, content policies, and global challenges"
    ],
    redFlags: [
      "Lack of social media or content platform experience",
      "Insufficient AI/ML or recommendation system background",
      "Poor understanding of content safety and moderation challenges",
      "Weak global perspective or cultural sensitivity",
      "Inability to work with ambiguous, rapidly evolving requirements"
    ]
  },
  reddit: {
    name: "Reddit",
    values: [
      "Remember the Human: Treating everyone with respect and empathy",
      "Empower Communities: Supporting diverse communities and conversations",
      "Make Reddit for Everyone: Building inclusive and accessible experiences",
      "Privacy by Design: Protecting user privacy and data",
      "Authentic Conversations: Fostering genuine, meaningful discussions"
    ],
    evaluationCriteria: [
      "Community Platform Expertise (forum systems, moderation tools, community management)",
      "Content and Discussion Systems (threading, voting, recommendation algorithms)",
      "Trust & Safety Leadership (content moderation, harassment prevention, community guidelines)",
      "User Privacy and Data Protection (privacy-first engineering, data governance)",
      "Inclusive Product Development (accessibility, diverse community needs)",
      "Authentic Communication (transparent, honest leadership style)"
    ],
    interviewFormat: "Community-focused process: 1. Recruiter screening (30 min: background, Reddit community understanding). 2. Technical phone screen (45 min: system design, community platforms). 3. Onsite loop (4-5 interviews, 45 min each): Technical leadership and community systems, Trust & safety and content moderation, People management and inclusive leadership, Product thinking and community building, Culture and authenticity assessment. Strong emphasis on community values and authentic communication.",
    successTips: [
      "Show deep understanding of online communities and forum dynamics",
      "Demonstrate experience with content moderation and trust & safety",
      "Prepare examples of building inclusive and accessible products",
      "Emphasize authentic communication and transparent leadership",
      "Show experience with discussion systems, voting, or recommendation algorithms",
      "Research Reddit's communities, moderation challenges, and platform evolution"
    ],
    redFlags: [
      "Lack of community platform or forum experience",
      "Insufficient understanding of content moderation challenges",
      "Poor communication style or lack of authenticity",
      "Weak privacy or data protection awareness",
      "Inability to demonstrate inclusive leadership"
    ]
  },
  startups: {
    name: "Startups & Scale-ups",
    values: [
      "Move Fast and Break Things: Rapid iteration and learning from failures",
      "Customer First: Deep customer obsession and rapid feedback loops",
      "Ownership and Accountability: Taking full responsibility for outcomes",
      "Resourcefulness: Doing more with less and creative problem-solving",
      "Growth Mindset: Continuous learning and adaptation",
      "Team First: Building strong, collaborative, high-trust teams"
    ],
    evaluationCriteria: [
      "Startup Experience and Mentality (thriving in ambiguous, resource-constrained environments)",
      "Full-Stack Leadership (wearing multiple hats, end-to-end ownership)",
      "Rapid Scaling Expertise (0-1 and 1-100 scaling experience)",
      "Customer Development (direct customer interaction, product-market fit)",
      "Technical Versatility (broad technical skills, pragmatic technology choices)",
      "Cultural Building (establishing engineering culture and practices from scratch)"
    ],
    interviewFormat: "Practical and fast process: 1. Founder/CTO screening (30-45 min: background, startup fit, technical overview). 2. Technical conversation (45 min: architecture decisions, technology choices, scaling challenges). 3. Team interviews (2-3 sessions, 30-45 min each): Technical leadership and hands-on skills, Team building and culture creation, Customer focus and product development, Problem-solving and resourcefulness. Emphasis on practical experience and cultural fit.",
    successTips: [
      "Show hands-on experience building products from 0-1 or scaling 1-100",
      "Demonstrate ability to work with limited resources and tight timelines",
      "Prepare examples of direct customer interaction and product iteration",
      "Emphasize pragmatic technology choices and technical versatility",
      "Show experience building engineering culture and practices",
      "Research the specific startup's stage, challenges, and technology stack"
    ],
    redFlags: [
      "Lack of startup or early-stage company experience",
      "Inability to work in ambiguous, fast-paced environments",
      "Over-engineering or lack of pragmatic approach",
      "Poor customer focus or product sense",
      "Inability to wear multiple hats or take on diverse responsibilities"
    ]
  },
  meta: {
    name: "Meta",
    values: [
      "Move Fast",
      "Focus on Long-term Impact", 
      "Build Awesome Things",
      "Live in the Future",
      "Be Direct and Respect Your Colleagues",
      "Meta, Metamates, Me"
    ],
    evaluationCriteria: [
      "Leadership and People Management skills (developing teams, handling difficult conversations, influencing without authority).",
      "Problem-solving and Decision-making abilities (analytical skills, trade-off analysis, handling ambiguity).",
      "Cross-functional Collaboration effectiveness (working with product, design, and other stakeholders).",
      "Strong Communication Skills (articulating complex ideas clearly, advocating for projects).",
      "Adaptability and Resilience (managing change, learning from failures, maintaining performance under pressure).",
      "Cultural Fit (alignment with Meta's values, transparency, growth mindset, empowering engineers).",
      "Thoughtful, data-informed, and collaborative decision-making process."
    ],
    interviewFormat: "Multi-stage process (4-8 weeks): 1. Resume Screening. 2. Recruiter Phone Screen (15-30 min: background, motivation). 3. Initial Video Interview (45 min: people management, technical design, career motivation). 4. Onsite Loop (5-6 interviews, 45 min each): Leadership & People Management (often 2 rounds), Technical System Design, Technical Coding/Code Review, Project Retrospective, Domain-specific/Product Design (if applicable), Machine Learning (if relevant). Behavioral questions (STAR method) integrated throughout.",
    successTips: [
      "Use the STAR method authentically for storytelling, but avoid sounding overly scripted.",
      "Prepare specific examples demonstrating leadership, technical problem-solving, conflict resolution, and adaptability.",
      "Align stories with Meta's core values (Move Fast, Impact, Transparency, Collaboration, etc.).",
      "Quantify impact with metrics or tangible results whenever possible.",
      "Be transparent; Meta values humility, learning from failures, and a growth mindset.",
      "Understand Meta's culture, recent projects, and leadership principles to tailor responses.",
      "Practice mock interviews and prepare insightful questions for the interviewers.",
      "Demonstrate empowerment of engineers, reflecting Meta's bottom-up culture.",
      "Show passion, enthusiasm, and be structured and concise in communication."
    ],
    redFlags: [
      "Poor self-presentation or unclear elevator pitch.",
      "Overemphasizing management tasks without linking them to business impact.",
      "Inadequate preparation for technical (coding, system design) questions.",
      "Lack of authenticity; overly scripted or rehearsed responses.",
      "Poor communication skills or an unstructured thought process.",
      "Not asking insightful questions or showing disinterest in the role or Meta."
    ]
  },
  amazon: {
    name: "Amazon",
    values: [
      "Customer Obsession",
      "Ownership",
      "Invent and Simplify",
      "Are Right, A Lot",
      "Learn and Be Curious",
      "Hire and Develop the Best",
      "Insist on the Highest Standards",
      "Think Big",
      "Bias for Action",
      "Frugality",
      "Earn Trust",
      "Dive Deep",
      "Have Backbone; Disagree and Commit",
      "Deliver Results",
      "Strive to be Earth's Best Employer",
      "Success and Scale Bring Broad Responsibility"
    ],
    evaluationCriteria: [
      "Alignment with Amazon's 16 Leadership Principles (primary evaluation lens).",
      "Demonstrated behavioral competencies (e.g., Ownership, Customer Obsession, Bias for Action).",
      "Technical proficiency for role (coding, system design, problem-solving) - approx. 50% for technical roles.",
      "Ability to provide specific, metric-driven examples using the STAR method.",
      "Cultural fit, assessed by a 'Bar Raiser' to maintain high hiring standards.",
      "Data-driven decision-making and effective stakeholder management."
    ],
    interviewFormat: "Multi-stage process: 1. Application and Resume Screening. 2. Initial Screening (30-45 min phone/video with recruiter/hiring manager: basic qualifications, behavioral questions based on LPs, role-specific scenarios, compensation). 3. Behavioral Interviews using STAR method focused on Leadership Principles. 4. Interview Loop (4-6 interviews, 45-60 min each): includes hiring manager, team members, cross-functional stakeholders, and a 'Bar Raiser'. Mix of technical assessments (coding, system design for tech roles) and deep behavioral evaluations against LPs. 5. Post-Interview Debrief and Decision (feedback typically within 5 business days after loop).",
    successTips: [
      "Prepare multiple, diverse STAR stories for each Leadership Principle, focusing on individual contributions ('I' statements).",
      "Quantify achievements with specific data and metrics to demonstrate impact.",
      "Be authentic; discuss challenges and failures, emphasizing lessons learned and growth.",
      "Understand Amazon's culture and LPs deeply; tailor stories to exemplify these values.",
      "Practice articulating stories clearly and concisely (2-3 minutes each).",
      "Ask thoughtful questions to show engagement and genuine interest.",
      "For technical rounds, be prepared for live coding and system design discussions.",
      "Demonstrate a customer-first mindset and the ability to make data-informed decisions."
    ],
    redFlags: [
      "Arriving late or appearing unprepared (test tech beforehand).",
      "Vague, generic, or irrelevant responses; not using STAR effectively.",
      "Overusing 'we' instead of 'I' when describing contributions.",
      "Failing to provide multiple, diverse examples for different LPs or questions.",
      "Not asking insightful questions at the end of the interview.",
      "Sharing confidential information or making discriminatory remarks.",
      "Speaking negatively about past employers or colleagues.",
      "Lack of self-awareness, accountability, or inability to discuss failures constructively.",
      "Inability to quantify achievements or provide data-backed examples.",
      "Responses that disregard or misalign with Amazon's Leadership Principles.",
      "Becoming defensive or unable to handle challenging questions or disagreements respectfully."
    ]
  },
  google: {
    name: "Google",
    values: [
      "Googleyness: Comfort with ambiguity, Bias to action, Collaboration and humility, Passion for innovation, Valuing diversity and inclusion.",
      "Emergent Leadership.",
      "Focus on General Cognitive Ability (GCA) and Role-Related Knowledge (RRK)."
    ],
    evaluationCriteria: [
      "Demonstration of 'Googleyness' (cultural fit, including comfort with ambiguity, bias to action, collaboration).",
      "Leadership capabilities (especially emergent leadership) and people management skills.",
      "Strong problem-solving skills and General Cognitive Ability (GCA).",
      "Role-Related Knowledge and Experience (RRK), including technical expertise for EM roles.",
      "Ability to make decisions under ambiguity and drive change.",
      "Commitment to diversity and inclusion.",
      "Ability to deliver results and drive impact."
    ],
    interviewFormat: "Process typically spans 1-3 months: 1. Resume screening. 2. Recruiter screening (phone/video: behavioral, experience fit, 'Why Google?'). 3. Technical screening (coding interview via Google Meets, using a shared Google Doc; focus on data structures, algorithms, problem-solving, clean code). 4. Onsite interviews (typically 5-6 sessions, 45 min each): Leadership interviews (x2, behavioral and hypothetical), System Design interviews (x1-2), Coding & Algorithm interviews (x1-2). Behavioral questions assessing Googleyness, leadership, and problem-solving are integrated. Lunch with an engineer (informal). Final stages include hiring committee review, senior leader review, compensation committee, and executive review for senior roles.",
    successTips: [
      "Use the STAR method for behavioral questions, providing specific examples with quantifiable outcomes and lessons learned.",
      "Thoroughly prepare for technical rounds: practice coding in a shared document environment and system design with a focus on scalability and trade-offs.",
      "Understand and be able to articulate Google's core values and 'Googleyness' attributes through your experiences.",
      "Be authentic; share real experiences, including failures, and demonstrate a growth mindset.",
      "Clearly articulate your thought process during problem-solving (both technical and behavioral).",
      "Demonstrate leadership, strong decision-making, and collaborative skills.",
      "Prepare for follow-up questions that probe deeper into your stories.",
      "Research Google's culture, recent products, and initiatives to show genuine interest."
    ],
    redFlags: [
      "Underestimating the importance of behavioral questions or 'Googleyness'.",
      "Focusing solely on technical skills without demonstrating cultural fit or leadership.",
      "Neglecting thorough preparation for system design and leadership scenario questions.",
      "Failing to clearly articulate the thought process during problem-solving exercises.",
      "Lack of self-awareness or inability to discuss past mistakes constructively.",
      "Appearing unenthusiastic or not well-researched about Google and the role."
    ]
  }
};

const questions = {
  microsoft: [
    {
      category: "leadership",
      questionText: "Tell me about a time you had to lead a team through a significant change or transformation.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Change Management", "Growth Mindset"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "Describe how you've built an inclusive and diverse engineering team. What specific actions did you take?",
      difficulty: "Medium",
      tags: ["STAR-focused", "Diversity & Inclusion", "Team Building"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "Give an example of how you've coached and developed a team member who was struggling.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Coaching", "People Management"]
    },
    {
      category: "conflict_resolution",
      questionText: "Tell me about a time you had to address a conflict between team members with different perspectives.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Conflict Resolution", "Inclusive Leadership"]
    },
    {
      category: "technical_decisions",
      questionText: "Describe a technical decision you made that had significant customer impact. How did you ensure it met customer needs?",
      difficulty: "Hard",
      tags: ["STAR-focused", "Customer Focus", "Technical Leadership"],
      isCritical: true
    },
    {
      category: "ambiguity",
      questionText: "Tell me about a time you had to learn a new technology or domain quickly to solve a business problem.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Learning Agility", "Growth Mindset"]
    }
  ],
  openai: [
    {
      category: "leadership",
      questionText: "Describe how you've led a team working on cutting-edge AI research while ensuring safety considerations.",
      difficulty: "Hard",
      tags: ["STAR-focused", "AI Safety", "Research Leadership"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "Tell me about a time you had to balance innovation speed with responsible AI development practices.",
      difficulty: "Hard",
      tags: ["STAR-focused", "AI Safety", "Ethical Decision-Making"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Describe a complex AI/ML system you've architected. What safety and ethical considerations did you incorporate?",
      difficulty: "Hard",
      tags: ["STAR-focused", "AI/ML Systems", "Safety-First Design"],
      isCritical: true
    },
    {
      category: "conflict_resolution",
      questionText: "Tell me about a time you had to navigate disagreement between researchers and engineers on AI safety approaches.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Cross-functional Collaboration", "AI Safety"]
    },
    {
      category: "communication",
      questionText: "How would you explain the importance of AI safety to stakeholders who are primarily focused on capability advancement?",
      difficulty: "Medium",
      tags: ["Hypothetical", "AI Safety", "Stakeholder Communication"]
    }
  ],
  snowflake: [
    {
      category: "leadership",
      questionText: "Tell me about a time you led a data platform migration or major infrastructure change.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Data Platform", "Technical Leadership"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "Describe how you've built a customer-obsessed engineering culture. What specific practices did you implement?",
      difficulty: "Medium",
      tags: ["STAR-focused", "Customer Focus", "Culture Building"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Describe a time you had to optimize data processing performance for a critical customer use case.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Performance Optimization", "Customer Impact"]
    },
    {
      category: "team_building",
      questionText: "Tell me about how you've scaled an engineering team to support rapid business growth.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Team Scaling", "Execution Excellence"]
    },
    {
      category: "communication",
      questionText: "Describe a time you had to influence senior leadership to invest in data platform improvements.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Stakeholder Management", "Strategic Thinking"]
    }
  ],
  anthropic: [
    {
      category: "leadership",
      questionText: "Tell me about a time you led a research team through a complex AI safety challenge.",
      difficulty: "Hard",
      tags: ["STAR-focused", "AI Safety Research", "Research Leadership"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Describe how you've approached building interpretable and safe AI systems. What methodologies did you use?",
      difficulty: "Hard",
      tags: ["STAR-focused", "AI Interpretability", "Safety-First Engineering"],
      isCritical: true
    },
    {
      category: "conflict_resolution",
      questionText: "Tell me about a time you had to balance research goals with practical engineering constraints.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Research vs Engineering", "Trade-offs"]
    },
    {
      category: "communication",
      questionText: "How would you communicate AI safety research findings to both technical and non-technical stakeholders?",
      difficulty: "Medium",
      tags: ["Hypothetical", "Research Communication", "AI Safety"]
    }
  ],
  scaleai: [
    {
      category: "leadership",
      questionText: "Tell me about a time you built an AI/ML platform from scratch in a fast-paced startup environment.",
      difficulty: "Hard",
      tags: ["STAR-focused", "AI/ML Platform", "Startup Scaling"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "Describe how you've scaled an engineering team during rapid company growth.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Team Scaling", "High-Growth Environment"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Tell me about a time you had to make critical architecture decisions with limited time and resources.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Architecture Decisions", "Resource Constraints"]
    },
    {
      category: "team_building",
      questionText: "Describe how you've built a customer-focused engineering culture in a B2B AI company.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Customer Focus", "B2B Product Development"]
    }
  ],
  netflix: [
    {
      category: "leadership",
      questionText: "Tell me about a time you had to make a difficult decision that required courage and went against popular opinion.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Courage", "High Performance Culture"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "Describe how you've built and maintained a high-performance engineering team.",
      difficulty: "Medium",
      tags: ["STAR-focused", "High Performance", "Talent Density"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Tell me about a time you architected a system to handle massive global scale with high availability requirements.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Global Scale", "Distributed Systems"]
    },
    {
      category: "communication",
      questionText: "Describe a time you had to give direct, honest feedback that was difficult to hear.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Honesty", "Direct Communication"]
    },
    {
      category: "ambiguity",
      questionText: "Tell me about a time you had to make a critical decision with incomplete information under time pressure.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Judgment", "Decision Making"]
    }
  ],
  linkedin: [
    {
      category: "leadership",
      questionText: "Tell me about how you've built products that help professionals advance their careers.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Member Focus", "Professional Development"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Describe a recommendation system or search algorithm you've built for professional networking.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Recommendation Systems", "Professional Networks"]
    },
    {
      category: "team_building",
      questionText: "Tell me about how you've fostered authentic relationships and trust within your engineering team.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Relationship Building", "Trust"]
    },
    {
      category: "communication",
      questionText: "Describe a time you took an intelligent risk that led to significant member value.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Intelligent Risks", "Member Value"]
    }
  ],
  uber: [
    {
      category: "leadership",
      questionText: "Tell me about a time you built technology solutions for diverse global markets with different needs.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Global Scale", "Localization"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Describe a real-time matching or routing system you've built. How did you handle scale and latency requirements?",
      difficulty: "Hard",
      tags: ["STAR-focused", "Real-time Systems", "Marketplace Technology"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "Tell me about how you've balanced the needs of different sides of a marketplace (riders vs drivers).",
      difficulty: "Medium",
      tags: ["STAR-focused", "Marketplace Dynamics", "Stakeholder Management"]
    },
    {
      category: "ambiguity",
      questionText: "Describe a time you had to persevere through significant challenges or setbacks.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Perseverance", "Resilience"]
    }
  ],
  airbnb: [
    {
      category: "leadership",
      questionText: "Tell me about how you've built products that create a sense of belonging for diverse global communities.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Belonging", "Global Communities"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Describe a trust and safety system you've built for a marketplace platform.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Trust & Safety", "Marketplace Platforms"],
      isCritical: true
    },
    {
      category: "team_building",
      questionText: "Tell me about a time you had to be resourceful and creative to solve a problem with limited resources.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Resourcefulness", "Creative Problem-Solving"]
    },
    {
      category: "communication",
      questionText: "Describe how you've optimized user experience for both hosts and guests in a marketplace.",
      difficulty: "Medium",
      tags: ["STAR-focused", "User Experience", "Marketplace UX"]
    }
  ],
  tiktok: [
    {
      category: "leadership",
      questionText: "Tell me about how you've built recommendation systems that serve billions of users globally.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Recommendation Systems", "Global Scale"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Describe a content moderation or safety system you've built for a social media platform.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Content Safety", "Social Media Platforms"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "Tell me about how you've led engineering teams across different cultures and time zones.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Cross-Cultural Leadership", "Global Teams"]
    },
    {
      category: "ambiguity",
      questionText: "Describe a time you had to make decisions in a rapidly evolving regulatory environment.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Regulatory Compliance", "Ambiguous Requirements"]
    }
  ],
  reddit: [
    {
      category: "leadership",
      questionText: "Tell me about how you've built systems that empower diverse online communities.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Community Empowerment", "Forum Systems"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Describe a content moderation system you've built that balances free speech with community safety.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Content Moderation", "Community Guidelines"],
      isCritical: true
    },
    {
      category: "communication",
      questionText: "Tell me about a time you had to communicate transparently about a difficult technical or policy decision.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Transparent Communication", "Authentic Leadership"]
    },
    {
      category: "team_building",
      questionText: "Describe how you've built privacy-first engineering practices into your team's development process.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Privacy by Design", "Engineering Practices"]
    }
  ],
  startups: [
    {
      category: "leadership",
      questionText: "Tell me about a time you built a product or platform from 0 to 1 in a resource-constrained environment.",
      difficulty: "Hard",
      tags: ["STAR-focused", "0-1 Building", "Resource Constraints"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "Describe how you've scaled an engineering team from 5 to 50+ people.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Team Scaling", "High Growth"],
      isCritical: true
    },
    {
      category: "technical_decisions",
      questionText: "Tell me about a time you had to make pragmatic technology choices to ship quickly while maintaining quality.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Pragmatic Decisions", "Speed vs Quality"]
    },
    {
      category: "team_building",
      questionText: "Describe how you've established engineering culture and practices from scratch.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Culture Building", "Engineering Practices"]
    },
    {
      category: "communication",
      questionText: "Tell me about a time you had direct customer interaction that significantly influenced your product decisions.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Customer Development", "Product-Market Fit"]
    }
  ],
  meta: [
    {
      category: "leadership",
      questionText: "Describe a time when you led a team through a challenging project.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Project Management"],
      isCritical: true
    },
    {
      category: "leadership", 
      questionText: "Tell me about a difficult employee situation (e.g., underperformance, conflict) and how you handled it.",
      difficulty: "Medium",
      tags: ["STAR-focused", "People Management"],
      isCritical: true
    },
    {
      category: "leadership",
      questionText: "How do you motivate and develop team members, especially high-potentials and those who are stagnating?",
      difficulty: "Medium", 
      tags: ["Hypothetical", "People Management", "Coaching"]
    },
    {
      category: "leadership",
      questionText: "Describe a situation where you had to make a tough decision that impacted your team. How did you manage the change and communicate it?",
      difficulty: "Hard",
      tags: ["STAR-focused", "Decision Making", "Change Management"]
    },
    {
      category: "conflict_resolution",
      questionText: "Give an example of resolving a significant disagreement within your team or with a peer manager.",
      difficulty: "Medium",
      tags: ["STAR-focused"],
      isCritical: true
    },
    {
      category: "conflict_resolution",
      questionText: "Describe a time you mediated a conflict between stakeholders with differing priorities.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Stakeholder Management"]
    },
    {
      category: "conflict_resolution",
      questionText: "How do you foster an environment where healthy debate is encouraged but destructive conflict is minimized?",
      difficulty: "Medium",
      tags: ["Hypothetical", "Team Culture"]
    },
    {
      category: "team_building",
      questionText: "Give an example of how you've built or improved a high-performing engineering team.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Hiring", "Team Culture"]
    },
    {
      category: "team_building",
      questionText: "Describe a time you had to collaborate with a difficult cross-functional partner. How did you make it work?",
      difficulty: "Medium",
      tags: ["STAR-focused", "Cross-functional"]
    },
    {
      category: "team_building",
      questionText: "How do you ensure effective collaboration between your team and other teams (e.g., product, design, other engineering teams)?",
      difficulty: "Medium",
      tags: ["Hypothetical", "Process"]
    },
    {
      category: "technical_decisions",
      questionText: "Tell me about a complex technical problem your team faced. What was your role in solving it, and what was the outcome?",
      difficulty: "Hard",
      tags: ["STAR-focused", "Technical Leadership"]
    },
    {
      category: "technical_decisions",
      questionText: "Describe a critical technical decision you made with limited information or under pressure. What was your process and the trade-offs?",
      difficulty: "Hard",
      tags: ["STAR-focused", "Trade-offs"]
    },
    {
      category: "technical_decisions",
      questionText: "How do you balance the need to 'Move Fast' with maintaining high quality and technical excellence in your team's work?",
      difficulty: "Medium",
      tags: ["Hypothetical", "Meta Values", "Trade-offs"]
    },
    {
      category: "ambiguity",
      questionText: "Share an experience where project requirements were unclear or constantly changing. How did you lead your team through it?",
      difficulty: "Medium",
      tags: ["STAR-focused"]
    },
    {
      category: "ambiguity",
      questionText: "Tell me about a time a project you were leading was failing or significantly off-track. What actions did you take?",
      difficulty: "Hard",
      tags: ["STAR-focused", "Problem Solving"]
    },
    {
      category: "communication",
      questionText: "Describe a situation where you had to influence a senior leader or a group of stakeholders without direct authority.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Stakeholder Management"]
    },
    {
      category: "communication",
      questionText: "How do you communicate complex technical information to non-technical audiences effectively?",
      difficulty: "Medium",
      tags: ["Hypothetical", "Communication Strategy"]
    },
    {
      category: "communication",
      questionText: "Tell me about a time you had to deliver difficult feedback to a team member or a peer. How did you approach it?",
      difficulty: "Medium",
      tags: ["STAR-focused", "Feedback"]
    }
  ],
  amazon: [
    {
      category: "leadership",
      questionText: "Tell me about a time you took responsibility for a project or task that was outside your defined role. What was the outcome?",
      difficulty: "Medium",
      tags: ["STAR-focused", "LP:Ownership", "Initiative"]
    },
    {
      category: "leadership",
      questionText: "Describe your approach to hiring and developing talent. Give an example of how you've mentored someone to success or helped improve a team member's performance.",
      difficulty: "Medium",
      tags: ["STAR-focused", "LP:Hire and Develop the Best", "People Management"]
    },
    {
      category: "leadership",
      questionText: "Share an example of a challenging goal you were responsible for achieving. How did you ensure you delivered results, especially when facing obstacles?",
      difficulty: "Hard",
      tags: ["STAR-focused", "LP:Deliver Results", "Execution"]
    },
    {
      category: "conflict_resolution",
      questionText: "Describe a time you disagreed with a manager or a popular decision. How did you voice your concerns, and what happened next? Did you commit to the final decision?",
      difficulty: "Hard",
      tags: ["STAR-focused", "LP:Have Backbone; Disagree and Commit", "Integrity"]
    },
    {
      category: "conflict_resolution",
      questionText: "Tell me about a situation where you had to build or rebuild trust with a colleague, team, or customer.",
      difficulty: "Medium",
      tags: ["STAR-focused", "LP:Earn Trust", "Interpersonal Skills"]
    },
    {
      category: "team_building",
      questionText: "Describe a time when you needed to influence a peer or another team who had a differing opinion or priorities to achieve a shared goal.",
      difficulty: "Medium",
      tags: ["STAR-focused", "LP:Earn Trust", "LP:Deliver Results", "Influence"]
    },
    {
      category: "team_building",
      questionText: "How do you foster a collaborative environment within your team and with cross-functional partners?",
      difficulty: "Medium",
      tags: ["Hypothetical", "LP:Deliver Results", "LP:Hire and Develop the Best", "Team Culture"]
    },
    {
      category: "technical_decisions",
      questionText: "Explain a situation where you had to dive deep into data or a complex problem to understand the root cause. What was your process and what did you uncover?",
      difficulty: "Hard",
      tags: ["STAR-focused", "LP:Dive Deep", "Analytical Skills"]
    },
    {
      category: "technical_decisions",
      questionText: "Give an example of a complex problem you solved with a simple or innovative solution. How did you identify the opportunity to simplify?",
      difficulty: "Medium",
      tags: ["STAR-focused", "LP:Invent and Simplify", "Innovation"]
    },
    {
      category: "technical_decisions",
      questionText: "Describe a critical decision you made based on your judgment, perhaps with incomplete data, that proved to be correct. What was your reasoning?",
      difficulty: "Hard",
      tags: ["STAR-focused", "LP:Are Right, A Lot", "Judgment"]
    },
    {
      category: "ambiguity",
      questionText: "Give an example of a calculated risk you took where speed was critical. How did you make the decision and manage the risk?",
      difficulty: "Medium",
      tags: ["STAR-focused", "LP:Bias for Action", "Decision Making"]
    },
    {
      category: "ambiguity",
      questionText: "Tell me about a time you had to quickly learn something new or adapt to a significant change in your work environment or project.",
      difficulty: "Medium",
      tags: ["STAR-focused", "LP:Learn and Be Curious", "Adaptability"]
    },
    {
      category: "communication",
      questionText: "Describe a time when you went above and beyond to understand and meet a customer's needs, even if it was challenging.",
      difficulty: "Medium",
      tags: ["STAR-focused", "LP:Customer Obsession", "Client Focus"]
    },
    {
      category: "communication",
      questionText: "Tell me about a time you proposed a bold or unconventional idea. How did you advocate for it and what was the outcome?",
      difficulty: "Hard",
      tags: ["STAR-focused", "LP:Think Big", "Strategic Thinking"]
    },
    {
      category: "communication",
      questionText: "How do you ensure your team maintains high standards, and what do you do if you see them slipping?",
      difficulty: "Medium",
      tags: ["STAR-focused", "Hypothetical", "LP:Insist on the Highest Standards", "Quality"]
    },
    {
      category: "communication",
      questionText: "Describe a situation where you had to make a decision with limited resources or budget. How did you approach it?",
      difficulty: "Medium",
      tags: ["STAR-focused", "LP:Frugality", "Resource Management"]
    }
  ],
  google: [
    {
      category: "leadership",
      questionText: "Tell me about a time you led a team through a challenging project or a period of significant change.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Project Management", "Change Management"]
    },
    {
      category: "leadership",
      questionText: "How do you approach motivating a team, especially when dealing with low performers or team members with differing levels of experience?",
      difficulty: "Medium",
      tags: ["Hypothetical", "STAR-focused", "People Management"]
    },
    {
      category: "leadership",
      questionText: "Describe a time you had to make a difficult decision regarding a team member (e.g., performance improvement plan, role change).",
      difficulty: "Hard",
      tags: ["STAR-focused", "People Management"]
    },
    {
      category: "leadership",
      questionText: "What is your philosophy on developing engineers and fostering their career growth?",
      difficulty: "Medium",
      tags: ["Hypothetical", "Coaching", "People Management"]
    },
    {
      category: "conflict_resolution",
      questionText: "Describe a conflict you had with a team member or a peer. How did you approach resolving it, and what was the outcome?",
      difficulty: "Medium",
      tags: ["STAR-focused"]
    },
    {
      category: "conflict_resolution",
      questionText: "Tell me about a time you had to mediate a disagreement between two team members or stakeholders.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Mediation"]
    },
    {
      category: "team_building",
      questionText: "How have you fostered diversity and inclusion within your teams? Provide a specific example.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Googleyness", "D&I"]
    },
    {
      category: "team_building",
      questionText: "Describe a situation where you had to collaborate with a cross-functional team with different goals or priorities. How did you align them?",
      difficulty: "Medium",
      tags: ["STAR-focused", "Cross-functional"]
    },
    {
      category: "team_building",
      questionText: "How do you build psychological safety within a team?",
      difficulty: "Medium",
      tags: ["Hypothetical", "Team Culture", "Googleyness"]
    },
    {
      category: "technical_decisions",
      questionText: "Tell me about a complex technical challenge your team faced. What was your role in the decision-making and problem-solving process?",
      difficulty: "Hard",
      tags: ["STAR-focused", "Technical Leadership"]
    },
    {
      category: "technical_decisions",
      questionText: "Describe a time you had to make a significant technical trade-off. What factors did you consider, and what was the result?",
      difficulty: "Hard",
      tags: ["STAR-focused", "Trade-offs"]
    },
    {
      category: "ambiguity",
      questionText: "Give an example of a time you had to make an important decision with incomplete or ambiguous information. What was your process?",
      difficulty: "Medium",
      tags: ["STAR-focused", "Googleyness", "Decision Making"]
    },
    {
      category: "ambiguity",
      questionText: "Describe how you managed a project that was failing or significantly deviating from its original plan.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Problem Solving", "Adaptability"]
    },
    {
      category: "communication",
      questionText: "Tell me about a time you influenced stakeholders or senior management without formal authority to adopt your idea or approach.",
      difficulty: "Hard",
      tags: ["STAR-focused", "Googleyness", "Influence"]
    },
    {
      category: "communication",
      questionText: "How do you ensure your team understands the 'why' behind their work and how it connects to broader company goals?",
      difficulty: "Medium",
      tags: ["Hypothetical", "Communication Strategy", "Leadership"]
    },
    {
      category: "communication",
      questionText: "Describe a situation where you had to push for a change in your team or organization that you believed was important.",
      difficulty: "Medium",
      tags: ["STAR-focused", "Googleyness", "Initiative"]
    }
  ]
};

const userStories = [
  {
    title: "Team Member Development Success",
    situation: "Developer with deep knowledge of critical component but narrow scope, creating single point of failure and boredom",
    task: "Broaden responsibilities, enhance engagement, reduce knowledge silos",
    action: "Identified interests during career planning sessions. Gradually expanded role to include oversight of multiple components. Facilitated mentorship opportunities and strategic planning involvement.",
    result: "Became more engaged and motivated. Reduced single point of failure risk. Promoted to lead role, inspiring others.",
    reflection: "Importance of proactively addressing boredom in high-performers",
    tags: ["people-management", "coaching", "career-development"],
    categories: ["leadership", "team_building"]
  },
  {
    title: "Skill Gap Resolution - Communication",
    situation: "Talented engineer who was shy, hesitant to share ideas, faced language barriers in male-dominated team",
    task: "Build confidence in expressing ideas and ensure voice was heard",
    action: "One-on-one coaching sessions highlighting communication as growth area. Intentionally invited her to share thoughts in meetings. Assigned collaborative projects with increasing complexity. Arranged communication workshops and peer feedback.",
    result: "Became more comfortable and confident sharing ideas. Improved communication skills boosted career development. Created more diverse and inclusive environment.",
    reflection: "Value of fostering inclusive culture and supporting individual growth",
    tags: ["diversity-inclusion", "coaching", "communication"],
    categories: ["leadership", "team_building"]
  },
  {
    title: "Major Project Direction Change",
    situation: "Cloud migration project changed from Google Cloud to Azure, timeline shortened from 2.5 years to 4 quarters",
    task: "Realign data platform and data infra teams to meet accelerated timeline",
    action: "Worked with principal engineer and senior staff to reassess risks and adjust strategy. Introduced phased approach with data replication and bridges. Collaborated with program managers to keep stakeholders aligned. Framed challenges as engineering problems to empower team solutions.",
    result: "Successfully met accelerated timeline. Minimized disruption to business operations. Team adapted quickly with proactive risk management.",
    reflection: "Importance of flexibility, clear communication, and problem-solving mindset",
    tags: ["change-management", "cloud-migration", "stakeholder-alignment"],
    categories: ["ambiguity", "communication", "technical_decisions"]
  },
  {
    title: "Cross-Org Conflict Resolution (Cost Savings)",
    situation: "High-priority cost-saving initiative across ML Platform and Data Platform teams",
    task: "Identify and implement cost-saving measures while ensuring optimal performance",
    action: "Conducted thorough analysis of data storage and access patterns. Implemented tiered storage solutions and eliminated redundant layers. Collaborated with ML engineers to map workflows and streamline transformations. Used RAPID framework for decision-making with clean escalation.",
    result: "Achieved over 60% cost savings while maintaining/improving performance. Enhanced efficiency of data access for ML use cases. Strengthened partnership between Data and ML teams.",
    reflection: "Value of cross-team collaboration and strategic cost management",
    tags: ["cost-optimization", "cross-functional", "data-platform"],
    categories: ["conflict_resolution", "technical_decisions"]
  },
  {
    title: "Technical Conflict Resolution",
    situation: "Two senior engineers disagreed on data platform architecture (data lake vs lakehouse)",
    task: "Resolve conflict and establish collaborative path forward",
    action: "Created comprehensive decision matrix evaluating both architectures. Involved multiple engineers for diverse perspectives. Implemented framework for technical disagreements with clear escalation. Used empathy-based approach requiring each side to present other's argument.",
    result: "Adopted hybrid approach balancing both perspectives. Improved team harmony and set precedent for future decisions. Enhanced governance and adaptability.",
    reflection: "Value of structured frameworks and empathy in conflict resolution",
    tags: ["technical-architecture", "conflict-resolution", "decision-framework"],
    categories: ["conflict_resolution", "technical_decisions"]
  }
];

export async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Create admin user
    const adminPasswordHash = await hashPassword('adminadmin');
    const adminUser = await prisma.users.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        id: 'user_admin',
        username: 'admin',
        password_hash: adminPasswordHash,
        is_admin: true,
        preferences: {
          theme: 'light',
          viewMode: 'normal'
        },
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    console.log('Admin user created');

    // Create a regular user (Mayssam)
    const userPasswordHash = await hashPassword('password123');
    const regularUser = await prisma.users.upsert({
      where: { username: 'mayssam' },
      update: {},
      create: {
        id: 'user_mayssam',
        username: 'mayssam',
        password_hash: userPasswordHash,
        is_admin: false,
        preferences: {
          theme: 'light',
          viewMode: 'normal'
        },
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    console.log('Regular user created');

    // Create companies
    for (const [key, data] of Object.entries(companyData)) {
      const transformedData = {
        id: `company_${key}`,
        name: data.name,
        values: data.values,
        evaluation_criteria: data.evaluationCriteria,
        interview_format: data.interviewFormat,
        success_tips: data.successTips,
        red_flags: data.redFlags,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      await prisma.companies.upsert({
        where: { name: data.name },
        update: transformedData,
        create: transformedData
      });
    }

    console.log('Companies created');

    // Create questions for each company
    for (const [companyKey, companyQuestions] of Object.entries(questions)) {
      const company = await prisma.companies.findUnique({
        where: { name: companyData[companyKey as keyof typeof companyData].name }
      });

      if (company) {
        for (const question of companyQuestions) {
          const transformedQuestion = {
            id: `question_${companyKey}_${Math.random().toString(36).substr(2, 9)}`,
            company_id: company.id,
            category: (question as any).category,
            question_text: (question as any).questionText,
            difficulty: (question as any).difficulty,
            is_generated: (question as any).isGenerated || true,
            tags: (question as any).tags || [],
            created_at: new Date(),
            updated_at: new Date(),
            is_critical: (question as any).isCritical || false,
            usage_count: (question as any).usageCount || 0,
            question_type: (question as any).questionType || 'behavioral'
          };
          
          await prisma.questions.create({
            data: transformedQuestion
          });
        }
      }
    }

    console.log('Questions created');

    // Create user stories
    for (const story of userStories) {
      const transformedStory = {
        id: `story_${Math.random().toString(36).substr(2, 9)}`,
        user_id: regularUser.id,
        title: story.title,
        situation: story.situation,
        task: story.task,
        action: story.action,
        result: story.result,
        reflection: story.reflection,
        tags: story.tags,
        categories: story.categories,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      await prisma.stories.create({
        data: transformedStory
      });
    }

    console.log('User stories created');
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
