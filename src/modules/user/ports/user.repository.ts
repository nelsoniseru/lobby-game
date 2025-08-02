export interface User {
  id: string;
  username: string;
  password: string;
  wins: number;
}

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  incrementWins(userId: string): Promise<void>;
}