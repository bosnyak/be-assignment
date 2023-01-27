import { AppDataSource } from '../database';
import { Organization } from '../entities/organization';
import { Shipment } from '../entities/shipment';
import { TransportPack } from '../entities/transportPack';
import OrganizationRepository from './organization';
import ShipmentRepository from './shipment';
import TransportPackRepository from './transportPack';

export const organizationRepository = new OrganizationRepository({
  organizationRepository: AppDataSource.getRepository(Organization),
});

export const shipmentRepository = new ShipmentRepository({
  shipmentRepository: AppDataSource.getRepository(Shipment),
});

export const transportPackRepository = new TransportPackRepository({
  transportPackRepository: AppDataSource.getRepository(TransportPack),
});
