import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImportRecord } from "./import.entity";
import { Product } from "../../../modules/product/entities/product.entity";
import { Warehouse } from "../../../modules/warehouse/entities/warehouse.entity";
import BaseEntity from "../../../databases/base.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";
@Entity({ name: 'import_details' })
export class ImportDetail extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 , name: "import_price"})
    importPrice: number;

    @ManyToOne(() => ImportRecord, (importRecord) => importRecord.importDetails)
    @JoinColumn({ name: 'import_record_id' })
    importRecord: ImportRecord;

    @ManyToOne(() => Product, (product) => product.importDetails)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.importDetails)
    @JoinColumn({ name: 'warehouse_id' })
    warehouse: Warehouse;

    @ManyToOne(() => Tenant, (tenant) => tenant.importDetails)
    @JoinColumn({ name: "tenant_id" })
    tenant: Tenant;
}
