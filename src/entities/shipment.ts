/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryColumn,
  ManyToMany,
  OneToMany,
  Column,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization';
import { TransportPack } from './transportPack';

@Entity()
export class Shipment {
  @PrimaryColumn()
  referenceId: string;

  @ManyToMany(() => Organization)
  @JoinTable()
  organizations: Organization[];

  @Column({ type: 'timestamptz', nullable: true })
  estimatedTimeArrival: Date | null;

  @OneToMany(() => TransportPack, (tpack) => tpack.shipment, {
    cascade: true,
  })
  transportPacks: TransportPack[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
