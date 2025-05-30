import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Warehouse } from "./warehouse.entity";
import { Product } from "../../../modules/product/entities/product.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";

@Entity({ name: "warehouse_details" })
export class WarehouseDetail extends BaseEntity {
    @PrimaryColumn({ name: "warehouse_id" })
    warehouseId: string;

    @PrimaryColumn({ name: "product_id" })
    productId: string;

    @Column({ type: 'int', default: 0 })
    quantity: number;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.warehouseDetails)
    @JoinColumn({ name: "warehouse_id" })
    warehouse: Warehouse;

    @ManyToOne(() => Product, (product) => product.warehouseDetails)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => Tenant, (tenant) => tenant.warehouseDetails)
    @JoinColumn({ name: "tenant_id" })
    tenant: Tenant;
}