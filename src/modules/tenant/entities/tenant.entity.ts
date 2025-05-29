import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tenants')
export class Tenant extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    name: string;
}