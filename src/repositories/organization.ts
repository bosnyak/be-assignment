import { In, Repository } from 'typeorm';
import { IOrganizationRepository, OrganizationPayload, OrganizationRepositoryDependencies } from '../types';
import { Organization } from '../entities/organization';

export default class OrganizationRepository implements IOrganizationRepository {
  private repository: Repository<Organization>;

  constructor({ organizationRepository }: OrganizationRepositoryDependencies) {
    this.repository = organizationRepository;
  }

  async upsertOrganization(payload: OrganizationPayload) {
    try {
      const organization = new Organization();
      organization.id = payload.id;
      organization.code = payload.code;

      const result = await this.repository.save(organization);

      return result;
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Failed to upsert organization data into database (${err.message})`);
      }
      throw err;
    }
  }

  async getOrganizationById(id: string) {
    try {
      const result = await this.repository.findOneBy({ id });

      return result;
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Failed to get organization data from database (${err.message})`);
      }
      throw err;
    }
  }

  async getOrganizationsByCodes(codes: string[]) {
    try {
      const result = await this.repository.find({
        where: {
          code: In(codes),
        },
      });

      return result;
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Failed to get organizations data by codes from database (${err.message})`);
      }
      throw err;
    }
  }
}
