import { Repository } from 'typeorm';
import {
  ITransportPackRepository,
  TransportPackPayload,
  TransportPackRepositoryDependencies,
} from '../types';
import { TransportPack } from '../entities/transportPack';

export default class TransportPackRepository implements ITransportPackRepository {
  private repository: Repository<TransportPack>;

  constructor({ transportPackRepository }: TransportPackRepositoryDependencies) {
    this.repository = transportPackRepository;
  }

  async getAggregateWeightByUnit() {
    try {
      const result = await this.repository
        .createQueryBuilder('tp')
        .select(['sum(tp.weight) as weight', 'unit'])
        .groupBy('tp.unit')
        .getRawMany();

      return result as TransportPackPayload[];
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Failed to get transport data into database (${err.message})`);
      }
      throw err;
    }
  }
}
