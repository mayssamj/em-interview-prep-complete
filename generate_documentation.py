
#!/usr/bin/env python3

import json
import os
from collections import defaultdict

def load_json_data(filename):
    """Load JSON data from file"""
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return []

def generate_behavioral_questions_md():
    """Generate behavioral questions markdown"""
    data = load_json_data('behavioral_questions_data.json')
    
    # Group by category
    categories = defaultdict(list)
    for question in data:
        category = question.get('category', 'General')
        categories[category].append(question)
    
    content = """# Behavioral Interview Questions

This document contains a comprehensive collection of behavioral interview questions for Engineering Manager positions, organized by category.

## Table of Contents

"""
    
    # Add table of contents
    for category in sorted(categories.keys()):
        content += f"- [{category}](#{category.lower().replace(' ', '-').replace('/', '-')})\n"
    
    content += "\n---\n\n"
    
    # Add questions by category
    for category in sorted(categories.keys()):
        content += f"## {category}\n\n"
        questions = categories[category]
        
        # Sort by difficulty and criticality
        questions.sort(key=lambda x: (x.get('difficulty', 'medium'), not x.get('is_critical', False)))
        
        for i, question in enumerate(questions, 1):
            difficulty = question.get('difficulty', 'medium').title()
            is_critical = question.get('is_critical', False)
            company = question.get('companies', {}).get('name', 'General') if question.get('companies') else 'General'
            tags = question.get('tags', [])
            
            content += f"### {i}. {question['question_text']}\n\n"
            content += f"**Difficulty:** {difficulty}"
            if is_critical:
                content += " [CRITICAL] **Critical**"
            content += f"\n\n**Company:** {company}\n\n"
            
            if tags:
                content += f"**Tags:** {', '.join(tags)}\n\n"
            
            content += "---\n\n"
    
    return content

def generate_behavioral_questions_with_answers_md():
    """Generate behavioral questions with sample answers"""
    data = load_json_data('behavioral_questions_data.json')
    
    # Group by category
    categories = defaultdict(list)
    for question in data:
        category = question.get('category', 'General')
        categories[category].append(question)
    
    content = """# Behavioral Interview Questions with Sample Answers

This document provides behavioral interview questions along with sample STAR method answers for Engineering Manager positions.

## STAR Method Framework

**S**ituation - Set the context and background
**T**ask - Describe your responsibility or what needed to be accomplished
**A**ction - Explain the specific actions you took
**R**esult - Share the outcome and impact

---

"""
    
    # Add questions by category with sample answers
    for category in sorted(categories.keys()):
        content += f"## {category}\n\n"
        questions = categories[category][:5]  # Limit to top 5 per category for sample answers
        
        for i, question in enumerate(questions, 1):
            difficulty = question.get('difficulty', 'medium').title()
            is_critical = question.get('is_critical', False)
            company = question.get('companies', {}).get('name', 'General') if question.get('companies') else 'General'
            
            content += f"### {i}. {question['question_text']}\n\n"
            content += f"**Difficulty:** {difficulty}"
            if is_critical:
                content += " [CRITICAL] **Critical**"
            content += f"\n\n**Company:** {company}\n\n"
            
            # Add sample STAR answer
            content += "**Sample STAR Answer:**\n\n"
            content += generate_sample_star_answer(question, category)
            content += "\n---\n\n"
    
    return content

def generate_sample_star_answer(question, category):
    """Generate a sample STAR answer based on question category"""
    
    star_templates = {
        'Leadership': {
            'situation': "In my previous role as an Engineering Manager at a fast-growing startup, our team was struggling with delivery timelines and team morale was declining due to unclear priorities and competing deadlines.",
            'task': "I needed to restructure our development process, improve team communication, and ensure we could deliver high-quality features on time while maintaining team satisfaction.",
            'action': "I implemented a structured sprint planning process, introduced daily standups with clear blockers discussion, established one-on-one meetings with each team member, and created a transparent roadmap that aligned with business priorities. I also advocated upward to leadership for more realistic timelines.",
            'result': "Within two quarters, our on-time delivery improved from 60% to 90%, team satisfaction scores increased by 40%, and we reduced technical debt by 25%. The team became more autonomous and proactive in identifying and solving problems."
        },
        'Technical': {
            'situation': "Our main application was experiencing performance issues during peak traffic, with response times increasing to 3+ seconds and occasional timeouts affecting user experience.",
            'task': "As the Engineering Manager, I needed to lead the technical investigation, coordinate the solution across multiple teams, and ensure we could handle our growing user base without compromising performance.",
            'action': "I organized a cross-functional task force including backend, frontend, and DevOps engineers. We conducted thorough performance profiling, identified database query bottlenecks, implemented caching strategies, and optimized our API endpoints. I also established monitoring and alerting systems to prevent future issues.",
            'result': "We reduced average response time from 3 seconds to 400ms, eliminated timeouts completely, and improved our system's capacity to handle 3x the traffic. This directly contributed to a 15% increase in user engagement and prevented potential customer churn."
        },
        'Communication': {
            'situation': "During a major product launch, there was a significant misalignment between the engineering team's technical approach and the product team's business requirements, leading to tension and potential delays.",
            'task': "I needed to facilitate better communication between teams, resolve the technical disagreements, and ensure we could deliver the product on time while meeting both technical and business requirements.",
            'action': "I organized joint planning sessions with both teams, created shared documentation for requirements and technical specifications, established regular cross-team check-ins, and implemented a process for early feedback and iteration. I also served as a translator between technical and business concerns.",
            'result': "We successfully launched the product on time with all critical features implemented. The improved communication process became our standard practice, reducing similar conflicts by 80% and improving cross-team collaboration scores significantly."
        }
    }
    
    # Select appropriate template based on category
    template_key = 'Leadership'
    if 'technical' in category.lower() or 'system' in category.lower():
        template_key = 'Technical'
    elif 'communication' in category.lower() or 'collaboration' in category.lower():
        template_key = 'Communication'
    
    template = star_templates.get(template_key, star_templates['Leadership'])
    
    return f"""**Situation:** {template['situation']}

**Task:** {template['task']}

**Action:** {template['action']}

**Result:** {template['result']}
"""

def generate_system_design_questions_md():
    """Generate system design questions markdown"""
    data = load_json_data('system_design_questions_data.json')
    
    # Group by category
    categories = defaultdict(list)
    for question in data:
        category = question.get('category', 'General')
        categories[category].append(question)
    
    content = """# System Design Interview Questions

This document contains a comprehensive collection of system design interview questions for Engineering Manager positions.

## Table of Contents

"""
    
    # Add table of contents
    for category in sorted(categories.keys()):
        content += f"- [{category}](#{category.lower().replace(' ', '-').replace('/', '-')})\n"
    
    content += "\n---\n\n"
    
    # Add questions by category
    for category in sorted(categories.keys()):
        content += f"## {category}\n\n"
        questions = categories[category]
        
        # Sort by difficulty and criticality
        questions.sort(key=lambda x: (x.get('difficulty', 'medium'), not x.get('is_critical', False)))
        
        for i, question in enumerate(questions, 1):
            difficulty = question.get('difficulty', 'medium').title()
            is_critical = question.get('is_critical', False)
            company = question.get('companies', {}).get('name', 'General') if question.get('companies') else 'General'
            tags = question.get('tags', [])
            
            content += f"### {i}. {question['question_text']}\n\n"
            content += f"**Difficulty:** {difficulty}"
            if is_critical:
                content += " [CRITICAL] **Critical**"
            content += f"\n\n**Company:** {company}\n\n"
            
            if tags:
                content += f"**Tags:** {', '.join(tags)}\n\n"
            
            # Add system design details if available
            if question.get('system_design_questions'):
                sd = question['system_design_questions']
                if sd.get('architecture_focus'):
                    content += f"**Architecture Focus:** {', '.join(sd['architecture_focus'])}\n\n"
                if sd.get('frameworks'):
                    content += f"**Relevant Frameworks:** {', '.join(sd['frameworks'])}\n\n"
                if sd.get('key_tradeoffs'):
                    content += f"**Key Tradeoffs:** {', '.join(sd['key_tradeoffs'])}\n\n"
            
            content += "---\n\n"
    
    return content

def generate_system_design_questions_with_answers_md():
    """Generate system design questions with sample answers"""
    data = load_json_data('system_design_questions_data.json')
    frameworks_data = load_json_data('frameworks_data.json')
    
    # Group by category
    categories = defaultdict(list)
    for question in data:
        category = question.get('category', 'General')
        categories[category].append(question)
    
    content = """# System Design Interview Questions with Sample Answers

This document provides system design interview questions along with comprehensive answers and architectural approaches.

## System Design Framework

1. **Clarify Requirements** - Understand functional and non-functional requirements
2. **Estimate Scale** - Calculate data volume, QPS, storage needs
3. **High-Level Design** - Create overall architecture diagram
4. **Detailed Design** - Deep dive into critical components
5. **Scale the Design** - Address bottlenecks and scaling challenges
6. **Discuss Tradeoffs** - Analyze different approaches and their implications

---

"""
    
    # Add questions by category with sample answers
    for category in sorted(categories.keys()):
        content += f"## {category}\n\n"
        questions = categories[category][:3]  # Limit to top 3 per category for detailed answers
        
        for i, question in enumerate(questions, 1):
            difficulty = question.get('difficulty', 'medium').title()
            is_critical = question.get('is_critical', False)
            company = question.get('companies', {}).get('name', 'General') if question.get('companies') else 'General'
            
            content += f"### {i}. {question['question_text']}\n\n"
            content += f"**Difficulty:** {difficulty}"
            if is_critical:
                content += " [CRITICAL] **Critical**"
            content += f"\n\n**Company:** {company}\n\n"
            
            # Add sample system design answer
            content += "**Sample System Design Answer:**\n\n"
            content += generate_sample_system_design_answer(question, category)
            content += "\n---\n\n"
    
    return content

def generate_sample_system_design_answer(question, category):
    """Generate a sample system design answer"""
    
    return f"""**1. Requirements Clarification:**
- Functional: Core features and user interactions
- Non-functional: Scale (users, data), performance, availability
- Constraints: Budget, timeline, existing systems

**2. Scale Estimation:**
- Daily Active Users: 10M
- Read/Write Ratio: 100:1
- Storage: 1TB per year
- Bandwidth: 1000 QPS peak

**3. High-Level Architecture:**
```
[Client] → [Load Balancer] → [API Gateway] → [Microservices]
                                                    ↓
[Cache Layer] ← [Database Cluster] ← [Message Queue]
```

**4. Detailed Components:**
- **Load Balancer:** Nginx/HAProxy for traffic distribution
- **API Gateway:** Rate limiting, authentication, routing
- **Microservices:** Domain-specific services with clear boundaries
- **Database:** Primary-replica setup with sharding
- **Cache:** Redis/Memcached for frequently accessed data
- **Message Queue:** Kafka/RabbitMQ for async processing

**5. Scaling Strategies:**
- Horizontal scaling of stateless services
- Database sharding by user ID or geographic region
- CDN for static content delivery
- Auto-scaling based on metrics

**6. Key Tradeoffs:**
- Consistency vs Availability (CAP theorem)
- SQL vs NoSQL based on data structure
- Synchronous vs Asynchronous processing
- Cost vs Performance optimization
"""

def generate_company_values_md():
    """Generate company values and strategies markdown"""
    data = load_json_data('companies_data.json')
    companies = data.get('companies', [])
    
    content = """# Company Values and Interview Strategies

This document provides detailed information about company values, evaluation criteria, and interview strategies for top tech companies.

## Table of Contents

"""
    
    # Add table of contents
    for company in sorted(companies, key=lambda x: x['name']):
        content += f"- [{company['name']}](#{company['name'].lower().replace(' ', '-').replace('.', '')})\n"
    
    content += "\n---\n\n"
    
    # Add company details
    for company in sorted(companies, key=lambda x: x['name']):
        content += f"## {company['name']}\n\n"
        
        # Values
        if company.get('values'):
            content += "### Core Values\n\n"
            for value in company['values']:
                content += f"- {value}\n"
            content += "\n"
        
        # Evaluation Criteria
        if company.get('evaluationCriteria'):
            content += "### Evaluation Criteria\n\n"
            for criteria in company['evaluationCriteria']:
                content += f"- {criteria}\n"
            content += "\n"
        
        # Interview Format
        if company.get('interviewFormat'):
            content += f"### Interview Format\n\n{company['interviewFormat']}\n\n"
        
        # Success Tips
        if company.get('successTips'):
            content += "### Success Tips\n\n"
            for tip in company['successTips']:
                content += f"- {tip}\n"
            content += "\n"
        
        # Red Flags
        if company.get('redFlags'):
            content += "### Red Flags to Avoid\n\n"
            for flag in company['redFlags']:
                content += f"- {flag}\n"
            content += "\n"
        
        content += "---\n\n"
    
    return content

def convert_md_to_pdf(md_file, pdf_file):
    """Convert markdown to PDF using pandoc if available"""
    try:
        import subprocess
        result = subprocess.run(['pandoc', md_file, '-o', pdf_file], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"Successfully converted {md_file} to {pdf_file}")
        else:
            print(f"Error converting {md_file} to PDF: {result.stderr}")
    except FileNotFoundError:
        print("Pandoc not found. Skipping PDF conversion.")
    except Exception as e:
        print(f"Error converting to PDF: {e}")

def main():
    """Generate all documentation files"""
    
    print("Generating documentation files...")
    
    # Generate markdown files
    docs = {
        'behavioral-questions.md': generate_behavioral_questions_md(),
        'behavioral-questions-with-answers.md': generate_behavioral_questions_with_answers_md(),
        'system-design-questions.md': generate_system_design_questions_md(),
        'system-design-questions-with-answers.md': generate_system_design_questions_with_answers_md(),
        'company-values-and-strategies.md': generate_company_values_md()
    }
    
    for filename, content in docs.items():
        with open(filename, 'w') as f:
            f.write(content)
        print(f"Generated {filename}")
        
        # Convert to PDF
        pdf_filename = filename.replace('.md', '.pdf')
        convert_md_to_pdf(filename, pdf_filename)
    
    print("\nDocumentation generation complete!")
    print(f"Generated {len(docs)} markdown files")

if __name__ == "__main__":
    main()
