import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExportRecord } from "./export.entity";
import { Warehouse } from "../../../modules/warehouse/entities/warehouse.entity";
import { Product } from "../../../modules/product/entities/product.entity";
import BaseEntity from "../../../databases/base.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";

@Entity({ name: "export_details" })
export class ExportDetail extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'int'})
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'selling_price'})
    sellingPrice: number;

    @ManyToOne(() => Product, (product) => product.exportDetails)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => ExportRecord, (exportRecord) => exportRecord.exportDetails)
    @JoinColumn({ name: "export_record_id" })
    exportRecord: ExportRecord;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.exportDetails)
    @JoinColumn({ name: "warehouse_id" })
    warehouse: Warehouse;

    @ManyToOne(() => Tenant, (tenant) => tenant.exportDetails)
    @JoinColumn({ name: "tenant_id" })
    tenant: Tenant;
}