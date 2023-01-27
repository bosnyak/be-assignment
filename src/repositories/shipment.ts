import { Repository } from 'typeorm';
import { IShipmentRepository, ShipmentPayload, ShipmentRepositoryDependencies } from '../types';
import { Shipment } from '../entities/shipment';
import { TransportPack } from '../entities/transportPack';

export default class ShipmentRepository implements IShipmentRepository {
  private repository: Repository<Shipment>;

  constructor({ shipmentRepository }: ShipmentRepositoryDependencies) {
    this.repository = shipmentRepository;
  }

  async upsertShipment(payload: ShipmentPayload) {
    try {
      const shipment = new Shipment();

      shipment.estimatedTimeArrival = payload.estimatedTimeArrival
        ? new Date(payload.estimatedTimeArrival) : null;

      shipment.referenceId = payload.referenceId;
      shipment.organizations = payload.organizations;

      shipment.transportPacks = payload.transportPacks.map((tpack) => {
        const transportPack = new TransportPack();
        transportPack.weight = tpack.weight;
        transportPack.unit = tpack.unit;

        return transportPack;
      });

      const result = await this.repository.save(shipment);

      return result;
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Failed to store shipment data into database (${err.message})`);
      }
      throw err;
    }
  }

  async getShipmentByReferenceId(referenceId: string) {
    try {
      const result = await this.repository.findOne({
        where: { referenceId },
        relations: { organizations: true, transportPacks: true },
      });

      return result;
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Failed to get shipment data into database (${err.message})`);
      }
      throw err;
    }
  }
}
