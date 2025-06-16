
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPasswordHash = await hashPassword('adminadmin');
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      isAdmin: true,
      preferences: {
        theme: 'light',
        viewMode: 'normal'
      }
    }
  });

  console.log('Admin user created');

  // Create a regular user (Mayssam)
  const userPasswordHash = await hashPassword('password123');
  const regularUser = await prisma.user.upsert({
    where: { username: 'mayssam' },
    update: {},
    create: {
      username: 'mayssam',
      passwordHash: userPasswordHash,
      isAdmin: false,
      preferences: {
        theme: 'light',
        viewMode: 'normal'
      }
    }
  });

  console.log('Regular user created');

  // Create companies
  const companies = [
    {
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
    {
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
    }
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { name: company.name },
      update: company,
      create: company
    });
  }

  console.log('Companies created');

  // Create some sample questions
  const metaCompany = await prisma.company.findUnique({ where: { name: 'Meta' } });
  const microsoftCompany = await prisma.company.findUnique({ where: { name: 'Microsoft' } });

  if (metaCompany) {
    await prisma.question.create({
      data: {
        companyId: metaCompany.id,
        category: "leadership",
        questionText: "Describe a time when you led a team through a challenging project.",
        difficulty: "Medium",
        tags: ["STAR-focused", "Project Management"],
        isCritical: true
      }
    });

    await prisma.question.create({
      data: {
        companyId: metaCompany.id,
        category: "leadership",
        questionText: "Tell me about a difficult employee situation (e.g., underperformance, conflict) and how you handled it.",
        difficulty: "Medium",
        tags: ["STAR-focused", "People Management"],
        isCritical: true
      }
    });
  }

  if (microsoftCompany) {
    await prisma.question.create({
      data: {
        companyId: microsoftCompany.id,
        category: "leadership",
        questionText: "Tell me about a time you had to lead a team through a significant change or transformation.",
        difficulty: "Medium",
        tags: ["STAR-focused", "Change Management", "Growth Mindset"],
        isCritical: true
      }
    });

    await prisma.question.create({
      data: {
        companyId: microsoftCompany.id,
        category: "leadership",
        questionText: "Describe how you've built an inclusive and diverse engineering team. What specific actions did you take?",
        difficulty: "Medium",
        tags: ["STAR-focused", "Diversity & Inclusion", "Team Building"],
        isCritical: true
      }
    });
  }

  console.log('Questions created');
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
