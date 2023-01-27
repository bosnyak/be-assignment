import { Router } from 'express';
import { organizationHandler, shipmentHandler } from '../handlers';

const router = Router();

router.get('/organizations/:id', organizationHandler.getOrganizationById.bind(organizationHandler));

router.post('/organization', organizationHandler.upsertOrganization.bind(organizationHandler));

router.get('/shipments/:referenceId', shipmentHandler.getShipmentById.bind(shipmentHandler));

router.post('/shipment', shipmentHandler.upsertShipment.bind(shipmentHandler));

router.get('/aggregate/shipments', shipmentHandler.aggregate.bind(shipmentHandler));

export default router;
