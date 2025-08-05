export interface Player {
  userId: string;
  number: number | null;
}

export interface GameSession {
  id: string;
  sessionId: string;
  creatorId: string;
  status: 'active' | 'ended';
  startTime: Date;
  duration: number;
  winningNumber?: number;
}

export interface GameRepository {
  create(session: Partial<GameSession>): Promise<GameSession>;
  findById(sessionId: string): Promise<GameSession | null>;
  update(sessionId: string, updateFields: Partial<GameSession>): Promise<GameSession | null>;
  findActiveSession(): Promise<GameSession | null>;
  getTopPlayers(limit: number): Promise<any[]>;
  getSessionsByDate(): Promise<any[]>;
}