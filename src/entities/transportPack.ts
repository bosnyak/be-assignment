/* eslint-disable import/no-cycle */
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Shipment } from './shipment';

@Entity()
export class TransportPack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('real')
  weight: number;

  @Column()
  unit: string;

  @ManyToOne(
    () => Shipment,
    (shipment) => shipment.transportPacks,
    { orphanedRowAction: 'delete' },
  )
  shipment: Shipment;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
