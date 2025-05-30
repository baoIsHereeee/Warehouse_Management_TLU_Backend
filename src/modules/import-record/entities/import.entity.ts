import { Supplier } from "../../../modules/supplier/entities/supplier.entity";
import { User } from "../../../modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ImportDetail } from "./import-detail.entity";
import BaseEntity from "../../../databases/base.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";

@Entity({ name: 'imports' })
export class ImportRecord extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => User, (user) => user.importRecords)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Supplier, (supplier) => supplier.importRecords)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier | null;

    @OneToMany(() => ImportDetail, (importDetail) => importDetail.importRecord)
    importDetails: ImportDetail[];

    @ManyToOne(() => Tenant, (tenant) => tenant.importRecords)
    @JoinColumn({ name: "tenant_id" })
    tenant: Tenant;
}