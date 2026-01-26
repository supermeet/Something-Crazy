import { Session, Track, User, LeaderboardEntry } from '../types';

// In-memory storage (replace with actual database in production)
class DataStore {
  private sessions: Map<string, Session> = new Map();
  private tracks: Map<string, Track> = new Map();
  private users: Map<string, User> = new Map();

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample tracks
    const sampleTracks: Track[] = [
      {
        id: 'track-1',
        name: 'Monaco Grand Prix',
        location: 'Monaco',
        parTime: 75.5,
        length: 3337,
        difficulty: 'hard',
      },
      {
        id: 'track-2',
        name: 'Silverstone Circuit',
        location: 'United Kingdom',
        parTime: 90.2,
        length: 5891,
        difficulty: 'medium',
      },
      {
        id: 'track-3',
        name: 'Karting Arena Pro',
        location: 'California, USA',
        parTime: 45.8,
        length: 1200,
        difficulty: 'easy',
      },
    ];

    sampleTracks.forEach(track => this.tracks.set(track.id, track));
  }

  // Session methods
  createSession(session: Session): Session {
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  getSessionsByUser(userId: string): Session[] {
    return Array.from(this.sessions.values()).filter(s => s.userId === userId);
  }

  getSessionsByTrack(trackId: string): Session[] {
    return Array.from(this.sessions.values()).filter(s => s.trackId === trackId);
  }

  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  updateSession(id: string, updates: Partial<Session>): Session | undefined {
    const session = this.sessions.get(id);
    if (session) {
      const updatedSession = { ...session, ...updates };
      this.sessions.set(id, updatedSession);
      return updatedSession;
    }
    return undefined;
  }

  deleteSession(id: string): boolean {
    return this.sessions.delete(id);
  }

  // Track methods
  createTrack(track: Track): Track {
    this.tracks.set(track.id, track);
    return track;
  }

  getTrack(id: string): Track | undefined {
    return this.tracks.get(id);
  }

  getAllTracks(): Track[] {
    return Array.from(this.tracks.values());
  }

  updateTrack(id: string, updates: Partial<Track>): Track | undefined {
    const track = this.tracks.get(id);
    if (track) {
      const updatedTrack = { ...track, ...updates };
      this.tracks.set(id, updatedTrack);
      return updatedTrack;
    }
    return undefined;
  }

  // User methods
  createUser(user: User): User {
    this.users.set(user.uid, user);
    return user;
  }

  getUser(uid: string): User | undefined {
    return this.users.get(uid);
  }

  updateUser(uid: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(uid);
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.users.set(uid, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Leaderboard methods
  getLeaderboard(trackId: string, limit: number = 100): LeaderboardEntry[] {
    // Get all sessions for the track
    const trackSessions = this.getSessionsByTrack(trackId);

    // Group by userId and find fastest time for each user
    const userBestTimes = new Map<string, { session: Session; time: number }>();

    trackSessions.forEach(session => {
      const current = userBestTimes.get(session.userId);
      if (!current || session.lapTime < current.time) {
        userBestTimes.set(session.userId, {
          session,
          time: session.lapTime,
        });
      }
    });

    // Convert to leaderboard entries and sort by time
    const leaderboard: LeaderboardEntry[] = Array.from(userBestTimes.values())
      .map(({ session }) => {
        const user = this.getUser(session.userId);
        return {
          userId: session.userId,
          userName: user?.name || 'Unknown User',
          fastestTime: session.lapTime,
          trackId: session.trackId,
          sessionId: session.id,
          timestamp: session.timestamp,
        };
      })
      .sort((a, b) => a.fastestTime - b.fastestTime)
      .slice(0, limit);

    return leaderboard;
  }
}

// Export singleton instance
export const dataStore = new DataStore();
