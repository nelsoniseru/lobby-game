
import { Player } from '../../entity/player.schema';   

export interface PlayerRepository {
  findOne(filter: Record<string, any>): Promise<Player | null>;
  findById(id: string): Promise<Player | null>;
  findByIds(ids: string[]): Promise<Player[]>;
  find(filter: Record<string, any>): Promise<Player[]>;
  findSession(sessionId: string): Promise<Player[]>;
  count(filter: Record<string, any>): Promise<number>;
  create(data: Partial<Player>): Promise<Player>;
  update(filter: Record<string, any>, updateData: Partial<Player>): Promise<void>;
  softDelete(filter: Record<string, any>): Promise<void>;
}