import { AppDataSource } from '../config/data-source';
import { DeepPartial, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
  protected repo: Repository<T>;
  constructor(target: EntityTarget<T>) {
    this.repo = AppDataSource.getRepository<T>(target);
  }

  create(data: DeepPartial<T>) {
    return this.repo.create(data);
  }

  save(entity: T) {
    return this.repo.save(entity);
  }

  find(options?: Parameters<Repository<T>['find']>[0]) {
    return this.repo.find(options);
  }

  findOne(options: Parameters<Repository<T>['findOne']>[0]) {
    return this.repo.findOne(options);
  }

  findById(id: any) {
    return this.repo.findOne({ where: { id } as any });
  }

  remove(entity: T) {
    return this.repo.remove(entity);
  }

  count(options?: Parameters<Repository<T>['count']>[0]) {
    return this.repo.count(options as any);
  }
}
