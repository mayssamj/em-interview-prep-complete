# API Documentation

## Overview

The EM Interview Prep API provides RESTful endpoints for managing companies, questions, stories, interviews, and user data.

## Authentication

All API endpoints require authentication except for public company and question listings.

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

## Endpoints

### Companies

#### GET /api/companies
List all companies with optional filtering.

**Query Parameters:**
- `industry` - Filter by industry
- `size` - Filter by company size
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset

**Response:**
```json
{
  "companies": [
    {
      "id": 1,
      "name": "Google",
      "industry": "Technology",
      "size": "Large",
      "description": "Search and advertising company",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "hasMore": true
}
```

#### GET /api/companies/[id]
Get detailed company information.

**Response:**
```json
{
  "id": 1,
  "name": "Google",
  "industry": "Technology",
  "size": "Large",
  "description": "Search and advertising company",
  "questions": [
    {
      "id": 1,
      "text": "Tell me about a time you led a team",
      "category": "Leadership",
      "difficulty": "Medium"
    }
  ],
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### Questions

#### GET /api/questions
List questions with filtering options.

**Query Parameters:**
- `category` - Filter by question category
- `difficulty` - Filter by difficulty level
- `companyId` - Filter by company
- `limit` - Number of results
- `offset` - Pagination offset

#### POST /api/questions
Create a new question.

**Request Body:**
```json
{
  "text": "Describe a challenging project you managed",
  "category": "Project Management",
  "difficulty": "Hard",
  "companyId": 1
}
```

### Stories

#### GET /api/stories
List user's STAR stories.

#### POST /api/stories
Create a new STAR story.

**Request Body:**
```json
{
  "title": "Led team through crisis",
  "situation": "Our main server went down during peak hours",
  "task": "Restore service and prevent future outages",
  "action": "Coordinated with team, implemented backup plan",
  "result": "Service restored in 30 minutes, 99.9% uptime achieved",
  "tags": ["leadership", "crisis management"]
}
```

### Interviews

#### GET /api/interviews
List interview sessions.

#### POST /api/interviews
Create new interview session.

**Request Body:**
```json
{
  "companyId": 1,
  "position": "Engineering Manager",
  "date": "2023-12-01T10:00:00Z",
  "type": "behavioral",
  "status": "scheduled"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user
- Rate limit headers included in responses

## Webhooks

Configure webhooks for real-time updates:

- `interview.created`
- `interview.updated`
- `story.created`
- `question.answered`
