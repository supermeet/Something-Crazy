# KartConnect API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

## Overview

KartConnect is a RESTful API for a motorsport tracking application similar to Strava but for karting and motorsports. The API allows users to:

- Track racing sessions with lap times
- View leaderboards for different tracks
- Earn XP based on performance vs par time
- Manage tracks and sessions

**Base URL**: `http://localhost:3000`

## Authentication

Most endpoints require authentication using Firebase ID tokens.

### Authentication Header

```
Authorization: Bearer <firebase-id-token>
```

### Protected Endpoints
- All `/api/sessions/*` endpoints
- `POST /api/tracks`
- `PUT /api/tracks/:id`

### Public Endpoints
- `GET /api/health`
- `GET /api/tracks`
- `GET /api/tracks/:id`
- `GET /api/tracks/:id/leaderboard`

## API Endpoints

### Health Check

#### GET /api/health
Check if the API is running.

**Response**
```json
{
  "status": "OK",
  "timestamp": "2024-01-26T12:00:00.000Z",
  "service": "KartConnect API"
}
```

---

### Tracks

#### GET /api/tracks
Get all available tracks.

**Response**
```json
{
  "count": 3,
  "tracks": [
    {
      "id": "track-1",
      "name": "Monaco Grand Prix",
      "location": "Monaco",
      "parTime": 75.5,
      "length": 3337,
      "difficulty": "hard"
    }
  ]
}
```

#### GET /api/tracks/:id
Get a specific track by ID.

**Parameters**
- `id` (path) - Track ID

**Response**
```json
{
  "id": "track-1",
  "name": "Monaco Grand Prix",
  "location": "Monaco",
  "parTime": 75.5,
  "length": 3337,
  "difficulty": "hard"
}
```

**Error Responses**
- `404` - Track not found

#### GET /api/tracks/:id/leaderboard
Get the leaderboard for a specific track (top 100 unique users by fastest time).

**Parameters**
- `id` (path) - Track ID
- `limit` (query, optional) - Number of results (1-100, default: 100)

**Response**
```json
{
  "trackId": "track-1",
  "trackName": "Monaco Grand Prix",
  "parTime": 75.5,
  "count": 2,
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user123",
      "userName": "John Racer",
      "fastestTime": 72.3,
      "trackId": "track-1",
      "sessionId": "session-xyz",
      "timestamp": "2024-01-26T10:00:00.000Z"
    }
  ]
}
```

**Error Responses**
- `404` - Track not found
- `400` - Invalid limit parameter

#### POST /api/tracks
Create a new track (requires authentication).

**Request Body**
```json
{
  "name": "New Circuit",
  "location": "Italy",
  "parTime": 85.0,
  "length": 4200,
  "difficulty": "medium"
}
```

**Response**
```json
{
  "id": "track-4",
  "name": "New Circuit",
  "location": "Italy",
  "parTime": 85.0,
  "length": 4200,
  "difficulty": "medium"
}
```

**Error Responses**
- `401` - Unauthorized (no token or invalid token)
- `400` - Missing required fields or invalid difficulty

#### PUT /api/tracks/:id
Update a track (requires authentication).

**Parameters**
- `id` (path) - Track ID

**Request Body** (all fields optional)
```json
{
  "name": "Updated Circuit Name",
  "parTime": 84.5
}
```

**Response**
```json
{
  "id": "track-4",
  "name": "Updated Circuit Name",
  "location": "Italy",
  "parTime": 84.5,
  "length": 4200,
  "difficulty": "medium"
}
```

**Error Responses**
- `401` - Unauthorized
- `404` - Track not found

---

### Sessions

#### POST /api/sessions
Create a new racing session (requires authentication).

**Request Body**
```json
{
  "trackId": "track-1",
  "lapTime": 72.5,
  "vehicleType": "Formula Kart",
  "weather": "sunny"
}
```

**Response**
```json
{
  "session": {
    "id": "session-1234567890",
    "userId": "user123",
    "trackId": "track-1",
    "lapTime": 72.5,
    "timestamp": "2024-01-26T12:00:00.000Z",
    "vehicleType": "Formula Kart",
    "weather": "sunny",
    "xpEarned": 600
  },
  "xpEarned": {
    "baseXP": 100,
    "performanceBonus": 500,
    "totalXP": 600
  },
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "name": "John Racer",
    "totalXP": 2400,
    "level": 5,
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Error Responses**
- `401` - Unauthorized
- `400` - Missing trackId or lapTime, or invalid lapTime
- `404` - Track not found

#### GET /api/sessions
Get all sessions for the authenticated user.

**Response**
```json
{
  "count": 5,
  "sessions": [
    {
      "id": "session-1234567890",
      "userId": "user123",
      "trackId": "track-1",
      "lapTime": 72.5,
      "timestamp": "2024-01-26T12:00:00.000Z",
      "vehicleType": "Formula Kart",
      "weather": "sunny",
      "xpEarned": 600
    }
  ]
}
```

**Error Responses**
- `401` - Unauthorized

#### GET /api/sessions/:id
Get a specific session by ID (requires authentication, user must own the session).

**Parameters**
- `id` (path) - Session ID

**Response**
```json
{
  "id": "session-1234567890",
  "userId": "user123",
  "trackId": "track-1",
  "lapTime": 72.5,
  "timestamp": "2024-01-26T12:00:00.000Z",
  "vehicleType": "Formula Kart",
  "weather": "sunny",
  "xpEarned": 600
}
```

**Error Responses**
- `401` - Unauthorized
- `403` - Forbidden (session belongs to another user)
- `404` - Session not found

#### PUT /api/sessions/:id
Update a session (requires authentication, user must own the session).

**Parameters**
- `id` (path) - Session ID

**Request Body** (all fields optional, cannot update id or userId)
```json
{
  "vehicleType": "Pro Kart",
  "weather": "cloudy"
}
```

**Response**
```json
{
  "id": "session-1234567890",
  "userId": "user123",
  "trackId": "track-1",
  "lapTime": 72.5,
  "timestamp": "2024-01-26T12:00:00.000Z",
  "vehicleType": "Pro Kart",
  "weather": "cloudy",
  "xpEarned": 600
}
```

**Error Responses**
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Session not found

#### DELETE /api/sessions/:id
Delete a session (requires authentication, user must own the session).

**Parameters**
- `id` (path) - Session ID

**Response**
- `204 No Content`

**Error Responses**
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Session not found

---

## Data Models

### Track
```typescript
{
  id: string;
  name: string;
  location: string;
  parTime: number;        // in seconds
  length: number;         // in meters
  difficulty: 'easy' | 'medium' | 'hard';
}
```

### Session
```typescript
{
  id: string;
  userId: string;
  trackId: string;
  lapTime: number;        // in seconds
  timestamp: Date;
  vehicleType?: string;
  weather?: string;
  xpEarned?: number;
}
```

### LeaderboardEntry
```typescript
{
  rank: number;
  userId: string;
  userName: string;
  fastestTime: number;    // in seconds
  trackId: string;
  sessionId: string;
  timestamp: Date;
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": "Additional details (development only)"
}
```

### Common HTTP Status Codes
- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Examples

### Example 1: Create a Session with cURL

```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Authorization: Bearer your-firebase-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "trackId": "track-1",
    "lapTime": 72.5,
    "vehicleType": "Formula Kart",
    "weather": "sunny"
  }'
```

### Example 2: Get Leaderboard with cURL

```bash
curl http://localhost:3000/api/tracks/track-1/leaderboard?limit=10
```

### Example 3: Create a Session with JavaScript (fetch)

```javascript
const createSession = async (token, sessionData) => {
  const response = await fetch('http://localhost:3000/api/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionData),
  });
  
  return response.json();
};

// Usage
const token = 'your-firebase-token';
const sessionData = {
  trackId: 'track-1',
  lapTime: 72.5,
  vehicleType: 'Formula Kart',
  weather: 'sunny'
};

createSession(token, sessionData)
  .then(data => console.log('Session created:', data))
  .catch(error => console.error('Error:', error));
```

### Example 4: Get All Tracks with JavaScript

```javascript
const getTracks = async () => {
  const response = await fetch('http://localhost:3000/api/tracks');
  return response.json();
};

getTracks()
  .then(data => console.log('Tracks:', data))
  .catch(error => console.error('Error:', error));
```

---

## XP and Gamification System

### XP Calculation Formula

XP is calculated based on lap time performance vs track par time:

**Base XP**: 100 points (awarded for completing any lap)

**Performance Bonus**:
- **20%+ faster**: +500 XP (Exceptional)
- **10-20% faster**: +300 XP (Excellent)  
- **5-10% faster**: +200 XP (Great)
- **0-5% faster**: +100 XP (Good)
- **Within 5% of par**: +50 XP (Decent)
- **Within 10% of par**: +25 XP (Average)
- **Slower than 10% of par**: 0 bonus

**Total XP** = Base XP + Performance Bonus

### Level Calculation

User level is calculated from total XP using:

```
Level = floor(sqrt(totalXP / 100)) + 1
```

**Level Progression**:
- Level 1: 0-99 XP
- Level 2: 100-399 XP
- Level 3: 400-899 XP
- Level 4: 900-1599 XP
- Level 5: 1600-2499 XP
- Level 6: 2500-3599 XP
- And so on...

---

## Rate Limiting

Currently, there are no rate limits implemented. For production deployment, consider implementing rate limiting using packages like `express-rate-limit`.

## CORS

CORS is enabled for all origins in development. For production, configure allowed origins in the CORS middleware.

## Support

For issues or questions, please open an issue on the GitHub repository.
