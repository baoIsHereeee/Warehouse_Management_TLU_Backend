import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { WarehouseTransfer } from "./warehouse-transfer.entity";
import { Product } from "../../product/entities/product.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";

@Entity('warehouse_transfer_details')
export class WarehouseTransferDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WarehouseTransfer, (warehouseTransfer) => warehouseTransfer.warehouseTransferDetails)
    @JoinColumn({ name: 'warehouse_transfer_id' })
    warehouseTransfer: WarehouseTransfer;

    @ManyToOne(() => Product, (product) => product.warehouseTransferDetails)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    quantity: number;

    @ManyToOne(() => Tenant, (tenant) => tenant.warehouseTransferDetails)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}