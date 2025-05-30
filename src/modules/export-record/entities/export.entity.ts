import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExportDetail } from "./export-detail.entity";
import { User } from "../../../modules/user/entities/user.entity";
import { Customer } from "../../../modules/customer/entities/customer.entity";
import BaseEntity from "../../../databases/base.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";

@Entity({ name: "exports" })
export class ExportRecord extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => ExportDetail, (exportDetail) => exportDetail.exportRecord)
    exportDetails: ExportDetail[];

    @ManyToOne(() => User, (user) => user.exportRecords)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Customer, (customer) => customer.exportRecords)
    @JoinColumn({ name: "customer_id" })
    customer: Customer | null;

    @ManyToOne(() => Tenant, (tenant) => tenant.exportRecords)
    @JoinColumn({ name: "tenant_id" })
    tenant: Tenant;
}