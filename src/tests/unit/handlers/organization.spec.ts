import { expect } from 'chai';
import * as sinon from 'sinon';
import { Request, Response } from 'express';
import OrganizationHandler from '../../../handlers/organization';
import { IOrganizationRepository, OrganizationResponse } from '../../../types';
import { createResponseObj } from '../helpers';

describe('Organization handler', () => {
  let sut: OrganizationHandler;
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  context('upsertOrganization function', () => {
    it('should create an organization successfully and return status 200', async () => {
      const org = {
        type: 'ORGANIZATION',
        id: '99f2535b-3f90-4758-8549-5b13c43a8504',
        code: 'BOG',
      };
      const upsertOrganizationMock = sandbox.stub().returns(org);
      const organizationRepository = <IOrganizationRepository>{};
      organizationRepository.upsertOrganization = upsertOrganizationMock;

      sut = new OrganizationHandler({ organizationRepository });
      const req = {
        body: org,
      } as Request;

      const {
        respObj,
        handlerResult,
      } = createResponseObj<OrganizationResponse>();

      await sut.upsertOrganization(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(200);
      expect(handlerResult.response).to.be.deep.equal(org);
      expect(upsertOrganizationMock.calledOnce).to.be.equals(true);
    });

    it('should return status code 400 when not sending id field', async () => {
      const org = {
        type: 'ORGANIZATION',
        code: 'BOG',
      };
      const organizationRepository = <IOrganizationRepository>{};

      sut = new OrganizationHandler({ organizationRepository });
      const req = {
        body: org,
      } as Request;

      const {
        respObj,
        handlerResult,
      } = createResponseObj<OrganizationResponse>();

      const expected = { message: '`id` field is required' };

      await sut.upsertOrganization(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(400);
      expect(handlerResult.response).to.be.deep.equal(expected);
    });

    it('should return status code 400 when not sending code field', async () => {
      const org = {
        type: 'ORGANIZATION',
        id: '99f2535b-3f90-4758-8549-5b13c43a8504',
      };
      const organizationRepository = <IOrganizationRepository>{};

      sut = new OrganizationHandler({ organizationRepository });
      const req = {
        body: org,
      } as Request;

      const {
        respObj,
        handlerResult,
      } = createResponseObj<OrganizationResponse>();

      const expected = { message: '`code` field is required' };

      await sut.upsertOrganization(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(400);
      expect(handlerResult.response).to.be.deep.equal(expected);
    });

    it('should return status code 500 when repository fails to create an organization', async () => {
      const org = {
        type: 'ORGANIZATION',
        id: '99f2535b-3f90-4758-8549-5b13c43a8504',
        code: 'BOG',
      };
      const upsertOrganizationMock = sandbox.stub().throws(new Error('Unexpected error'));
      const organizationRepository = <IOrganizationRepository>{};
      organizationRepository.upsertOrganization = upsertOrganizationMock;

      sut = new OrganizationHandler({ organizationRepository });
      const req = {
        body: org,
      } as Request;

      const {
        respObj,
        handlerResult,
      } = createResponseObj<OrganizationResponse>();

      await sut.upsertOrganization(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(500);
      expect(handlerResult.response).to.be.deep.equal({ message: 'Unexpected error' });
      expect(upsertOrganizationMock.calledOnce).to.be.equals(true);
    });
  });

  context('getOrganizationById function', () => {
    it('should get an organization successfully and return status 200', async () => {
      const org = {
        type: 'ORGANIZATION',
        id: '99f2535b-3f90-4758-8549-5b13c43a8504',
        code: 'BOG',
      };
      const getOrganizationByIdMock = sandbox.stub().returns(org);
      const organizationRepository = <IOrganizationRepository>{};
      organizationRepository.getOrganizationById = getOrganizationByIdMock;

      sut = new OrganizationHandler({ organizationRepository });
      const req = {
      } as Request;

      req.params = {
        id: org.id,
      };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<OrganizationResponse>();

      await sut.getOrganizationById(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(200);
      expect(handlerResult.response).to.be.deep.equal(org);
      expect(getOrganizationByIdMock.calledOnce).to.be.equals(true);
    });

    it('should return status code 404 when an organization is not found', async () => {
      const org = {
        type: 'ORGANIZATION',
        id: '99f2535b-3f90-4758-8549-5b13c43a8504',
        code: 'BOG',
      };
      const getOrganizationByIdMock = sandbox.stub().returns(null);
      const organizationRepository = <IOrganizationRepository>{};
      organizationRepository.getOrganizationById = getOrganizationByIdMock;

      sut = new OrganizationHandler({ organizationRepository });
      const req = {
      } as Request;

      req.params = {
        id: org.id,
      };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<OrganizationResponse>();

      await sut.getOrganizationById(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(404);
      expect(handlerResult.response).to.be.deep.equal({ message: 'Organization not found' });
      expect(getOrganizationByIdMock.calledOnce).to.be.equals(true);
    });

    it('should return status code 500 when repository fails to get an organization', async () => {
      const org = {
        type: 'ORGANIZATION',
        id: '99f2535b-3f90-4758-8549-5b13c43a8504',
        code: 'BOG',
      };
      const getOrganizationByIdMock = sandbox.stub().throws(new Error('Unexpected error'));
      const organizationRepository = <IOrganizationRepository>{};
      organizationRepository.getOrganizationById = getOrganizationByIdMock;

      sut = new OrganizationHandler({ organizationRepository });
      const req = {
      } as Request;

      req.params = {
        id: org.id,
      };

      const {
        respObj,
        handlerResult,
      } = createResponseObj<OrganizationResponse>();

      await sut.getOrganizationById(req, respObj as Response);
      expect(handlerResult.status).to.be.equal(500);
      expect(handlerResult.response).to.be.deep.equal({ message: 'Unexpected error' });
      expect(getOrganizationByIdMock.calledOnce).to.be.equals(true);
    });
  });
});
