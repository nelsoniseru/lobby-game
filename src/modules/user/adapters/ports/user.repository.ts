export interface User {
  id: string;
  username: string;
  password: string;
  wins: number;
  loses: number;
}

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  find(id: string): Promise<User | null>;  
  incrementWins(userId: string): Promise<void>;
  incrementloses(userId: string): Promise<void>;
  findByIds(ids: string[]): Promise<User[]>;
  findById(id: string): Promise<User | null>;

}