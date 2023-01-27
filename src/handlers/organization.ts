import { Request, Response } from 'express';
import { OrganizationHandlerDependencies, OrganizationPayload, OrganizationResponse } from '../types';
import { Organization } from '../entities/organization';

export default class OrganizationHandler {
  organizationRepository;

  constructor({ organizationRepository }: OrganizationHandlerDependencies) {
    this.organizationRepository = organizationRepository;
  }

  private createOrganizationResponse(org: Organization): OrganizationResponse {
    return {
      type: 'ORGANIZATION',
      code: org.code,
      id: org.id,
    };
  }

  async upsertOrganization(req: Request, res: Response) {
    try {
      const { id, code } = req.body;

      if (!id) {
        return res.status(400).json({ message: '`id` field is required' });
      }

      if (!code) {
        return res.status(400).json({ message: '`code` field is required' });
      }

      const orgPayload: OrganizationPayload = {
        id,
        code,
      };

      const organization = await this.organizationRepository.upsertOrganization(orgPayload);
      const response = this.createOrganizationResponse(organization);

      return res.status(200).json(response);
    } catch (err) {
      console.log(`Failed to upsert organization (${err})`);
      return res.status(500).json({ message: 'Unexpected error' });
    }
  }

  async getOrganizationById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const organization = await this.organizationRepository.getOrganizationById(id);

      if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
      }

      const response = this.createOrganizationResponse(organization);

      return res.status(200).json(response);
    } catch (err) {
      console.log(`Failed to get organization (${err})`);
      return res.status(500).json({ message: 'Unexpected error' });
    }
  }
}
