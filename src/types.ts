import { Repository } from 'typeorm';
import { Organization } from './entities/organization';
import { Shipment } from './entities/shipment';
import { TransportPack } from './entities/transportPack';

export interface OrganizationRepositoryDependencies {
  organizationRepository: Repository<Organization>;
}

export interface ShipmentRepositoryDependencies {
  shipmentRepository: Repository<Shipment>;
}

export interface TransportPackRepositoryDependencies {
  transportPackRepository: Repository<TransportPack>;
}

export interface OrganizationPayload {
  id: string;
  code: string;
}

export interface IOrganizationRepository {
  upsertOrganization(payload: OrganizationPayload): Promise<Organization>
  getOrganizationById(id: string): Promise<Organization | null>
  getOrganizationsByCodes(codes: string[]): Promise<Organization[]>
}

export interface OrganizationHandlerDependencies {
  organizationRepository: IOrganizationRepository
}

export interface TransportPackTotalWeight {
  weight: string
  unit: string
}

export interface TransportPackPayload {
  weight: number
  unit: string
}

export interface ShipmentPayload {
  referenceId: string
  organizations: Organization[]
  estimatedTimeArrival?: string
  transportPacks: TransportPackPayload[]
}

export interface IShipmentRepository {
  upsertShipment(payload: ShipmentPayload): Promise<Shipment>
  getShipmentByReferenceId(referenceId: string): Promise<Shipment | null>
}

export interface ITransportPackRepository {
  getAggregateWeightByUnit(): Promise<TransportPackPayload[]>
}

export interface ShipmentHandlerDependencies {
  shipmentRepository: IShipmentRepository
  organizationRepository: IOrganizationRepository
  transportPackRepository: ITransportPackRepository
}

export interface KeyValuePair {
  [key: string]: string
}

export interface TransportPackNodeTotalWeight {
  totalWeight: TransportPackTotalWeight
}

export interface TransportPackNode {
  node: TransportPackNodeTotalWeight[]
}

export interface OrganizationResponse extends Partial<Organization> {
  type: string
}

export interface ShipmentResponse {
  type: string
  referenceId: string
  organizations: OrganizationResponse[]
  estimatedTimeArrival?: string
  transportPacks: TransportPackNode
}
