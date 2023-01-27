import { expect } from 'chai';
import * as sinon from 'sinon';
import { Request, Response } from 'express';
import ShipmentHandler from '../../../handlers/shipment';
import {
  IOrganizationRepository, IShipmentRepository, ITransportPackRepository, ShipmentResponse,
} from '../../../types';
import { createResponseObj } from '../helpers';

describe('Shipment handler', () => {
  let sut: ShipmentHandler;
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  context('upsertShipment function', () => {
    it('should create a shipment successfully and return status 200', async () => {
      const org = {
        type: 'ORGANIZATION',
        id: '99f2535b-3f90-4758-8549-5b13c43a8504',
        code: 'BOG',
      };
      const shipment = {
        type: 'SHIPMENT',
        referenceId: 'S00001071',
        organizations: [org],
        estimatedTimeArrival: new Date('2020-03-13T00:00:00'),
        transportPacks: [{
          weight: '5',
          unit: 'KILOGRAMS',
        }],
      };

      const upsertShipmentMock = sandbox.stub().returns(shipment);
      const getOrganizationsByCodesMock = sandbox.stub().returns([org]);
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      organizationRepository.getOrganizationsByCodes = getOrganizationsByCodesMock;
      const transportPackRepository = <ITransportPackRepository>{};
      shipmentRepository.upsertShipment = upsertShipmentMock;

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });

      const shipmentBody = {
        type: 'SHIPMENT',
        referenceId: 'S00001071',
        organizations: ['BOG'],
        estimatedTimeArrival: '2020-03-13T00:00:00',
        transportPacks: {
          nodes: [
            {
              totalWeight: {
                weight: '5',
                unit: 'KILOGRAMS',
              },
            },
          ],
        },
      };

      const expectedResponse = {
        type: 'SHIPMENT',
        organizations: [{
          type: 'ORGANIZATION',
          code: 'BOG',
          id: '99f2535b-3f90-4758-8549-5b13c43a8504',
        }],
        referenceId: 'S00001071',
        estimatedTimeArrival: '2020-03-13T03:00:00.000Z',
        transportPacks: {
          node: [{
            totalWeight: {
              unit: 'KILOGRAMS',
              weight: '5',
            },
          }],
        },
      };

      const req = {
        body: shipmentBody,
      } as Request;

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.upsertShipment(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(200);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
      expect(upsertShipmentMock.calledOnce).to.be.equals(true);
    });

    it('should return status code 400 when not sending referenceId field', async () => {
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });

      const shipmentBody = {};

      const req = {
        body: shipmentBody,
      } as Request;

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      const expectedResponse = { message: '`referenceId` field is required' };

      await sut.upsertShipment(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(400);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
    });

    it('should return status code 500 when repository fails to create a shipment', async () => {
      const upsertShipmentMock = sandbox.stub().throws(new Error('Unexpected error'));
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};
      shipmentRepository.upsertShipment = upsertShipmentMock;

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });

      const shipmentBody = {
        type: 'SHIPMENT',
        referenceId: 'S00001071',
        estimatedTimeArrival: '2020-03-13T00:00:00',
        transportPacks: {
          nodes: [
            {
              totalWeight: {
                weight: '5',
                unit: 'KILOGRAMS',
              },
            },
          ],
        },
      };

      const expectedResponse = { message: 'Unexpected error' };

      const req = {
        body: shipmentBody,
      } as Request;

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.upsertShipment(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(500);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
      expect(upsertShipmentMock.calledOnce).to.be.equals(true);
    });
  });

  context('getShipmentById function', () => {
    it('should get a shipment successfully and return status 200', async () => {
      const org = {
        type: 'ORGANIZATION',
        id: '99f2535b-3f90-4758-8549-5b13c43a8504',
        code: 'BOG',
      };
      const shipment = {
        type: 'SHIPMENT',
        referenceId: 'S00001071',
        organizations: [org],
        estimatedTimeArrival: new Date('2020-03-13T00:00:00'),
        transportPacks: [{
          weight: '5',
          unit: 'KILOGRAMS',
        }],
      };

      const getShipmentByReferenceIdMock = sandbox.stub().returns(shipment);
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};
      shipmentRepository.getShipmentByReferenceId = getShipmentByReferenceIdMock;

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });
      const req = {
      } as Request;

      req.params = {
        referenceId: shipment.referenceId,
      };

      const expectedResponse = {
        type: 'SHIPMENT',
        organizations: [{
          type: 'ORGANIZATION',
          code: 'BOG',
          id: '99f2535b-3f90-4758-8549-5b13c43a8504',
        }],
        referenceId: 'S00001071',
        estimatedTimeArrival: '2020-03-13T03:00:00.000Z',
        transportPacks: {
          node: [{
            totalWeight: {
              unit: 'KILOGRAMS',
              weight: '5',
            },
          }],
        },
      };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.getShipmentById(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(200);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
      expect(getShipmentByReferenceIdMock.calledOnce).to.be.equals(true);
    });

    it('should return status code 404 when an shipment is not found', async () => {
      const getShipmentByReferenceIdMock = sandbox.stub().returns(null);
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};
      shipmentRepository.getShipmentByReferenceId = getShipmentByReferenceIdMock;

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });
      const req = {
      } as Request;

      req.params = {
        referenceId: 'valid_id',
      };

      const expectedResponse = { message: 'Shipment not found' };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.getShipmentById(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(404);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
      expect(getShipmentByReferenceIdMock.calledOnce).to.be.equals(true);
    });

    it('should return status code 500 when repository fails to get a shipment', async () => {
      const getShipmentByReferenceIdMock = sandbox.stub().throws(new Error('Unexpected error'));
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};
      shipmentRepository.getShipmentByReferenceId = getShipmentByReferenceIdMock;

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });
      const req = {
      } as Request;

      req.params = {
        referenceId: 'valid_id',
      };

      const expectedResponse = { message: 'Unexpected error' };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.getShipmentById(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(500);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
      expect(getShipmentByReferenceIdMock.calledOnce).to.be.equals(true);
    });
  });

  context('aggregate function', () => {
    it('should get shipment total weight successfully and return status 200 - [unit:KILOGRAMS]', async () => {
      const transportPacksAggregated = [
        {
          weight: 5,
          unit: 'KILOGRAMS',
        },
        {
          weight: 5,
          unit: 'POUNDS',
        },
        {
          weight: 5,
          unit: 'OUNCES',
        },
      ];

      const getAggregateWeightByUnit = sandbox.stub().returns(transportPacksAggregated);
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};
      transportPackRepository.getAggregateWeightByUnit = getAggregateWeightByUnit;

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });
      const req = {
      } as Request;

      req.query = {
        unit: 'KILOGRAMS',
      };

      const expectedResponse = {
        totalWeight: '7.4097',
        unit: 'KILOGRAMS',
      };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.aggregate(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(200);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
      expect(getAggregateWeightByUnit.calledOnce).to.be.equals(true);
    });

    it('should get shipment total weight successfully and return status 200 - [unit:POUNDS]', async () => {
      const transportPacksAggregated = [
        {
          weight: 5,
          unit: 'KILOGRAMS',
        },
        {
          weight: 5,
          unit: 'POUNDS',
        },
        {
          weight: 5,
          unit: 'OUNCES',
        },
      ];

      const getAggregateWeightByUnit = sandbox.stub().returns(transportPacksAggregated);
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};
      transportPackRepository.getAggregateWeightByUnit = getAggregateWeightByUnit;

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });
      const req = {
      } as Request;

      req.query = {
        unit: 'POUNDS',
      };

      const expectedResponse = {
        totalWeight: '16.3356',
        unit: 'POUNDS',
      };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.aggregate(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(200);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
      expect(getAggregateWeightByUnit.calledOnce).to.be.equals(true);
    });

    it('should get shipment total weight successfully and return status 200 - [unit:OUNCES]', async () => {
      const transportPacksAggregated = [
        {
          weight: 5,
          unit: 'KILOGRAMS',
        },
        {
          weight: 5,
          unit: 'POUNDS',
        },
        {
          weight: 5,
          unit: 'OUNCES',
        },
      ];

      const getAggregateWeightByUnit = sandbox.stub().returns(transportPacksAggregated);
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};
      transportPackRepository.getAggregateWeightByUnit = getAggregateWeightByUnit;

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });
      const req = {
      } as Request;

      req.query = {
        unit: 'OUNCES',
      };

      const expectedResponse = {
        totalWeight: '261.3700',
        unit: 'OUNCES',
      };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.aggregate(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(200);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
      expect(getAggregateWeightByUnit.calledOnce).to.be.equals(true);
    });

    it('should return status code 400 when not sending unit query param', async () => {
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });
      const req = {
      } as Request;

      req.query = {
      };

      const expectedResponse = { message: '`unit` query param is required' };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.aggregate(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(400);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
    });

    it('should return status code 500 when repository fails to aggregate transport packs', async () => {
      const getAggregateWeightByUnit = sandbox.stub().throws(new Error('Unexpected error'));
      const shipmentRepository = <IShipmentRepository>{};
      const organizationRepository = <IOrganizationRepository>{};
      const transportPackRepository = <ITransportPackRepository>{};
      transportPackRepository.getAggregateWeightByUnit = getAggregateWeightByUnit;

      sut = new ShipmentHandler({
        shipmentRepository,
        organizationRepository,
        transportPackRepository,
      });
      const req = {
      } as Request;

      req.query = {
        unit: 'OUNCES',
      };

      const expectedResponse = { message: 'Unexpected error' };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<ShipmentResponse>();

      await sut.aggregate(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(500);
      expect(handlerResult.response).to.be.deep.equal(expectedResponse);
      expect(getAggregateWeightByUnit.calledOnce).to.be.equals(true);
    });
  });
});
