#!/usr/bin/env python3
"""
Comprehensive Documentation Generator
Creates all required documentation files from JSON exports
"""

import json
import os
from datetime import datetime

def load_json_data(filename):
    """Load data from JSON file"""
    if not os.path.exists(filename):
        print(f"JSON file not found: {filename}")
        return []
    
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_docs_directory():
    """Create docs directory if it doesn't exist"""
    if not os.path.exists('./docs'):
        os.makedirs('./docs')

def generate_system_design_questions_no_answers():
    """Generate system design questions without answers"""
    questions_data = load_json_data('./system_design_questions_export.json')
    if not questions_data:
        return
    
    # Group by category
    categories = {}
    for q in questions_data:
        category = q.get('category', 'General')
        if category not in categories:
            categories[category] = []
        categories[category].append({
            'question': q.get('question', ''),
            'difficulty': q.get('difficulty', 'Medium'),
            'tags': q.get('tags', '')
        })
    
    # Generate markdown
    content = """# System Design Questions (No Answers)

This document contains all system design questions organized by category for interview preparation.

Generated on: {}

## Overview

Total Questions: {}
Categories: {}

""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), len(questions_data), len(categories))
    
    for category, cat_questions in categories.items():
        content += f"\n## {category}\n\n"
        content += f"**Total Questions in Category: {len(cat_questions)}**\n\n"
        
        for i, q in enumerate(cat_questions, 1):
            content += f"### {i}. {q['question']}\n\n"
            content += f"**Difficulty:** {q['difficulty']}\n\n"
            if q['tags']:
                content += f"**Tags:** {q['tags']}\n\n"
            content += "---\n\n"
    
    with open('./docs/system-design-questions-no-answers.md', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Generated system-design-questions-no-answers.md ({len(questions_data)} questions)")

def generate_behavioral_questions_no_answers():
    """Generate behavioral questions without answers"""
    questions_data = load_json_data('./behavioral_questions_export.json')
    if not questions_data:
        return
    
    # Group by category
    categories = {}
    for q in questions_data:
        category = q.get('category', 'General')
        if category not in categories:
            categories[category] = []
        categories[category].append({
            'question': q.get('question', ''),
            'difficulty': q.get('difficulty', 'Medium'),
            'company': q.get('company', {}).get('name', 'General') if q.get('company') else 'General'
        })
    
    # Generate markdown
    content = """# Behavioral Questions (No Answers)

This document contains all behavioral questions organized by category for interview preparation.

Generated on: {}

## Overview

Total Questions: {}
Categories: {}

""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), len(questions_data), len(categories))
    
    for category, cat_questions in categories.items():
        content += f"\n## {category}\n\n"
        content += f"**Total Questions in Category: {len(cat_questions)}**\n\n"
        
        for i, q in enumerate(cat_questions, 1):
            content += f"### {i}. {q['question']}\n\n"
            content += f"**Company:** {q['company']}\n\n"
            content += f"**Difficulty:** {q['difficulty']}\n\n"
            content += "---\n\n"
    
    with open('./docs/behavioral-questions-no-answers.md', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Generated behavioral-questions-no-answers.md ({len(questions_data)} questions)")

def generate_system_design_questions_with_answers():
    """Generate system design questions with detailed answers"""
    questions_data = load_json_data('./system_design_questions_export.json')
    if not questions_data:
        return
    
    # Generate markdown
    content = """# System Design Questions (With Answers)

This document contains all system design questions with detailed answers, tradeoffs, technologies, and strategies.

Generated on: {}

## Overview

Total Questions: {}

""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), len(questions_data))
    
    for i, q in enumerate(questions_data, 1):
        question = q.get('question', '')
        category = q.get('category', 'General')
        difficulty = q.get('difficulty', 'Medium')
        tags = q.get('tags', '')
        answer = q.get('answer', '')
        tradeoffs = q.get('tradeoffs', '')
        technologies = q.get('technologies', '')
        strategies = q.get('strategies', '')
        
        content += f"\n## {i}. {question}\n\n"
        content += f"**Category:** {category}\n\n"
        content += f"**Difficulty:** {difficulty}\n\n"
        
        if tags:
            content += f"**Tags:** {tags}\n\n"
        
        content += "### Answer\n\n"
        content += f"{answer or 'No detailed answer provided.'}\n\n"
        
        if tradeoffs:
            content += "### Tradeoffs\n\n"
            content += f"{tradeoffs}\n\n"
        
        if technologies:
            content += "### Technologies\n\n"
            content += f"{technologies}\n\n"
        
        if strategies:
            content += "### Strategies\n\n"
            content += f"{strategies}\n\n"
        
        content += "---\n\n"
    
    with open('./docs/system-design-questions-with-answers.md', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Generated system-design-questions-with-answers.md ({len(questions_data)} questions)")

def generate_behavioral_questions_with_answers():
    """Generate behavioral questions with sample answers"""
    questions_data = load_json_data('./behavioral_questions_export.json')
    if not questions_data:
        return
    
    # Generate markdown
    content = """# Behavioral Questions (With Answers)

This document contains all behavioral questions with sample answers using the STAR framework.

Generated on: {}

## Overview

Total Questions: {}

## STAR Framework Reference

**S**ituation - Set the scene and give context
**T**ask - Describe what you needed to accomplish
**A**ction - Explain what you did
**R**esult - Share the outcome

""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), len(questions_data))
    
    for i, q in enumerate(questions_data, 1):
        question = q.get('question', '')
        category = q.get('category', 'General')
        difficulty = q.get('difficulty', 'Medium')
        sample_answer = q.get('sampleAnswer', '')
        company = q.get('company', {}).get('name', 'General') if q.get('company') else 'General'
        
        content += f"\n## {i}. {question}\n\n"
        content += f"**Category:** {category}\n\n"
        content += f"**Company:** {company}\n\n"
        content += f"**Difficulty:** {difficulty}\n\n"
        
        content += "### Sample Answer\n\n"
        if sample_answer:
            content += f"{sample_answer}\n\n"
        else:
            content += """**Structure your answer using STAR:**

**Situation:** Describe the context and background
**Task:** Explain what needed to be accomplished
**Action:** Detail the specific actions you took
**Result:** Share the positive outcome and what you learned

*Tip: Use specific metrics and examples where possible.*

"""
        
        content += "---\n\n"
    
    with open('./docs/behavioral-questions-with-answers.md', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Generated behavioral-questions-with-answers.md ({len(questions_data)} questions)")

def generate_company_values_and_strategies():
    """Generate company values and interview strategies"""
    # For now, we'll create a comprehensive guide with general strategies
    # since we don't have separate company/strategy JSON exports
    behavioral_data = load_json_data('./behavioral_questions_export.json')
    
    # Extract unique companies from behavioral questions
    companies = set()
    for q in behavioral_data:
        if q.get('company') and q.get('company').get('name'):
            companies.add(q.get('company').get('name'))
    
    companies = sorted(list(companies))
    
    # Generate markdown
    content = """# Company Values & Interview Strategies

This comprehensive guide contains company values, culture insights, and proven interview strategies.

Generated on: {}

## Table of Contents

1. [Company Values & Culture](#company-values--culture)
2. [Interview Strategies](#interview-strategies)
3. [Persuasion Frameworks](#persuasion-frameworks)

""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    
    # Company Values Section
    content += "\n## Company Values & Culture\n\n"
    
    for company in companies:
        content += f"### {company}\n\n"
        content += f"**Focus Areas:** Research this company's specific values, culture, and interview process.\n\n"
        content += f"**Key Tips:**\n"
        content += f"- Study the company's mission and values\n"
        content += f"- Research recent news and developments\n"
        content += f"- Understand their products and services\n"
        content += f"- Prepare specific examples that align with their culture\n\n"
        content += "---\n\n"
    
    # Interview Strategies Section
    content += "\n## Interview Strategies\n\n"
    
    content += """### Technical Interview Strategies

**System Design Approach:**
- Start with requirements gathering
- Design high-level architecture
- Deep dive into components
- Discuss scalability and trade-offs
- Address reliability and monitoring

**Behavioral Interview Approach:**
- Use the STAR framework consistently
- Prepare 5-7 core stories that can be adapted
- Focus on leadership, problem-solving, and collaboration
- Quantify your impact with specific metrics
- Practice storytelling and timing

### Communication Strategies

**Active Listening:**
- Ask clarifying questions
- Summarize what you heard
- Engage with follow-up questions

**Clear Articulation:**
- Structure your thoughts before speaking
- Use simple, clear language
- Provide context and background
- Walk through your reasoning step-by-step

"""
    
    # Persuasion Frameworks Section
    content += "\n## Persuasion Frameworks\n\n"
    
    content += """### STAR Framework (Behavioral Questions)
- **S**ituation: Set the context
- **T**ask: Describe the challenge
- **A**ction: Explain your actions
- **R**esult: Share the outcome

### SOAR Framework (System Design)
- **S**cale: Consider scalability requirements
- **O**ptimize: Identify optimization opportunities
- **A**rchitecture: Design the system architecture
- **R**eliability: Ensure system reliability

### CAR Framework (Problem Solving)
- **C**ontext: Understand the problem context
- **A**ction: Take systematic action
- **R**esult: Measure and communicate results

### PREP Framework (Communication)
- **P**oint: Make your main point
- **R**eason: Provide reasoning
- **E**xample: Give concrete examples
- **P**oint: Restate your main point

"""
    
    with open('./docs/company-values-and-strategies.md', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Generated company-values-and-strategies.md ({len(companies)} companies)")

def main():
    """Main function to generate all documentation"""
    print("🚀 Starting comprehensive documentation generation...")
    
    create_docs_directory()
    
    # Generate all documentation files
    generate_system_design_questions_no_answers()
    generate_behavioral_questions_no_answers()
    generate_system_design_questions_with_answers()
    generate_behavioral_questions_with_answers()
    generate_company_values_and_strategies()
    
    print("\n✅ All documentation files generated successfully!")
    print("\nFiles created in ./docs/:")
    print("- system-design-questions-no-answers.md")
    print("- behavioral-questions-no-answers.md")
    print("- system-design-questions-with-answers.md")
    print("- behavioral-questions-with-answers.md")
    print("- company-values-and-strategies.md")

if __name__ == "__main__":
    main()
