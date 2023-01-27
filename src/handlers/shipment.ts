import { Request, Response } from 'express';
import {
  ShipmentHandlerDependencies,
  ShipmentPayload,
  ShipmentResponse,
  TransportPackPayload,
  TransportPackTotalWeight,
} from '../types';
import { Organization } from '../entities/organization';
import { convertWeight } from '../helpers/convertWeight';
import { Shipment } from '../entities/shipment';

export default class ShipmentHandler {
  shipmentRepository;

  organizationRepository;

  transportPackRepository;

  constructor({
    shipmentRepository,
    organizationRepository,
    transportPackRepository,
  }: ShipmentHandlerDependencies) {
    this.shipmentRepository = shipmentRepository;
    this.organizationRepository = organizationRepository;
    this.transportPackRepository = transportPackRepository;
  }

  private createShipmentResponse(shipment: Shipment): ShipmentResponse {
    return {
      type: 'SHIPMENT',
      organizations: shipment.organizations.map((org) => ({
        type: 'ORGANIZATION',
        code: org.code,
        id: org.id,
      })),
      referenceId: shipment.referenceId,
      estimatedTimeArrival: shipment.estimatedTimeArrival?.toISOString(),
      transportPacks: {
        node: shipment.transportPacks.map((tp) => ({
          totalWeight: {
            unit: tp.unit,
            weight: String(tp.weight),
          },
        })),
      },
    };
  }

  async upsertShipment(req: Request, res: Response) {
    try {
      const {
        referenceId,
        organizations: organizationsCodes,
        estimatedTimeArrival,
        transportPacks,
      } = req.body;

      if (!referenceId) {
        return res.status(400).json({ message: '`referenceId` field is required' });
      }

      let organizations: Organization[] = [];
      if (organizationsCodes?.length > 0) {
        organizations = await this.organizationRepository.getOrganizationsByCodes(
          organizationsCodes,
        );
      }

      const transportPacksNodes: TransportPackPayload[] = transportPacks
        .nodes.map((node: { totalWeight: TransportPackTotalWeight }) => ({
          weight: Number(node.totalWeight.weight),
          unit: node.totalWeight.unit,
        }));

      const shipmentPayload: ShipmentPayload = {
        referenceId,
        organizations,
        transportPacks: transportPacksNodes,
        estimatedTimeArrival,
      };

      const shipment = await this.shipmentRepository.upsertShipment(shipmentPayload);
      const response = this.createShipmentResponse(shipment);

      return res.status(200).json(response);
    } catch (err) {
      console.log(`Failed to upsert shipment (${err})`);
      return res.status(500).json({ message: 'Unexpected error' });
    }
  }

  async getShipmentById(req: Request, res: Response) {
    try {
      const { referenceId } = req.params;

      const shipment = await this.shipmentRepository.getShipmentByReferenceId(referenceId);

      if (!shipment) {
        return res.status(404).json({ message: 'Shipment not found' });
      }

      const response = this.createShipmentResponse(shipment);

      return res.status(200).json(response);
    } catch (err) {
      console.log(`Failed to upsert shipment (${err})`);
      return res.status(500).json({ message: 'Unexpected error' });
    }
  }

  async aggregate(req: Request, res: Response) {
    try {
      const unit = req.query.unit as string;

      if (!unit) {
        return res.status(400).json({ message: '`unit` query param is required' });
      }

      const weights = await this.transportPackRepository.getAggregateWeightByUnit();

      const totalWeight = weights.reduce((total, curr) => {
        if (curr.unit === unit) {
          return total + curr.weight;
        }

        return total + convertWeight(curr.weight, curr.unit, unit);
      }, 0)
        .toFixed(4);

      return res.status(200).json({
        totalWeight,
        unit,
      });
    } catch (err) {
      console.log(`Failed to aggregate shipment (${err})`);
      return res.status(500).json({ message: 'Unexpected error' });
    }
  }
}
