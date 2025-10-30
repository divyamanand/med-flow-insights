import { BaseRepository } from './BaseRepository';
import { RevokedToken } from '../entities/RevokedToken';

export class RevokedTokenRepository extends BaseRepository<RevokedToken> {
  constructor() { super(RevokedToken); }
}
