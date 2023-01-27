import OrganizationHandler from './organization';
import { organizationRepository, shipmentRepository, transportPackRepository } from '../repositories';
import ShipmentHandler from './shipment';

export const organizationHandler = new OrganizationHandler({ organizationRepository });

export const shipmentHandler = new ShipmentHandler({
  organizationRepository,
  shipmentRepository,
  transportPackRepository,
});
