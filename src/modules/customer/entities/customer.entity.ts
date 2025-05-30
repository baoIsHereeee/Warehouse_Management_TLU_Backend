import { ExportRecord } from "../../../modules/export-record/entities/export.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Tenant } from "../../tenant/entities/tenant.entity";

@Entity({ name: "customers" })
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ type: 'text'})
    fullname: string;
    
    @Column({ type: 'text', unique: true, nullable: true })
    email: string | null;
    
    @Column({ type: 'text' })
    phone: string;

    @Column({ type: 'text' })
    address: string;

    @OneToMany(() => ExportRecord, (exportRecord) => exportRecord.customer)
    exportRecords: ExportRecord[];

    @ManyToOne(() => Tenant, (tenant) => tenant.customers)
    @JoinColumn({ name: "tenant_id" })
    tenant: Tenant; 
}