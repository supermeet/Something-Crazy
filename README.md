# KartConnect API

A Strava-like motorsport tracking application backend built with Node.js, Express, TypeScript, and Firebase.

## Features

- 🔐 **Firebase Authentication** - Secure user authentication with Firebase ID tokens
- 🏎️ **Session Tracking** - Track and manage racing sessions with lap times
- 🏆 **Leaderboards** - View top 100 unique users by fastest lap time per track
- ⭐ **Gamification** - XP calculation based on lap time performance vs track par time
- 📊 **Track Management** - CRUD operations for racing tracks
- 🔒 **Secure Endpoints** - Protected routes with JWT verification

## Project Structure

```
src/
├── server.ts                    # Express app entry point
├── config/
│   └── firebase.ts             # Firebase Admin SDK initialization
├── middleware/
│   └── auth.ts                 # Firebase ID token verification
├── services/
│   └── gamification.ts         # XP calculation logic
├── controllers/
│   ├── sessionController.ts    # Session CRUD operations
│   └── trackController.ts      # Track operations & leaderboard
├── models/
│   └── dataStore.ts           # In-memory data storage (replace with DB)
├── routes/
│   ├── index.ts               # Main router
│   ├── sessions.ts            # Session routes
│   └── tracks.ts              # Track routes
└── types/
    └── index.ts               # TypeScript type definitions
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Admin SDK credentials

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Something-Crazy
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:
```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check API health status

### Tracks

#### Public Endpoints
- **GET** `/api/tracks` - Get all tracks
- **GET** `/api/tracks/:id` - Get track by ID
- **GET** `/api/tracks/:id/leaderboard` - Get leaderboard for track (top 100 unique users)
  - Query params: `limit` (default: 100, max: 100)

#### Protected Endpoints (Requires Authentication)
- **POST** `/api/tracks` - Create new track
- **PUT** `/api/tracks/:id` - Update track

### Sessions (All require authentication)
- **POST** `/api/sessions` - Create new session
- **GET** `/api/sessions` - Get user's sessions
- **GET** `/api/sessions/:id` - Get specific session
- **PUT** `/api/sessions/:id` - Update session
- **DELETE** `/api/sessions/:id` - Delete session

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Example Requests

### Create a Session
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Authorization: Bearer <your-firebase-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "trackId": "track-1",
    "lapTime": 72.5,
    "vehicleType": "Formula Kart",
    "weather": "sunny"
  }'
```

### Get Leaderboard
```bash
curl http://localhost:3000/api/tracks/track-1/leaderboard
```

### Get All Tracks
```bash
curl http://localhost:3000/api/tracks
```

## Gamification System

The XP calculation is based on lap time performance compared to track par time:

- **Base XP**: 100 points for completing a lap
- **Performance Bonuses**:
  - 20%+ faster than par: +500 XP (Exceptional)
  - 10-20% faster: +300 XP (Excellent)
  - 5-10% faster: +200 XP (Great)
  - 0-5% faster: +100 XP (Good)
  - Within 5% of par: +50 XP (Decent)
  - Within 10% of par: +25 XP (Average)
  - Slower than 10% of par: 0 bonus

### Level System
- Level is calculated from total XP using: `floor(sqrt(totalXP / 100)) + 1`
- Progressive difficulty (each level requires more XP)

## Sample Data

The application comes pre-loaded with sample tracks:

1. **Monaco Grand Prix** (Hard)
   - Par Time: 75.5s
   - Length: 3337m

2. **Silverstone Circuit** (Medium)
   - Par Time: 90.2s
   - Length: 5891m

3. **Karting Arena Pro** (Easy)
   - Par Time: 45.8s
   - Length: 1200m

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: Firebase Admin SDK
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Development

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## Production Considerations

⚠️ **Important**: This implementation uses in-memory storage for demonstration purposes. For production, replace the `dataStore` with:

- PostgreSQL/MySQL with Prisma or TypeORM
- MongoDB with Mongoose
- Firebase Firestore
- Any other database solution

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request