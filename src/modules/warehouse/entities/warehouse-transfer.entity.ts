import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "../../../databases/base.entity";
import { Warehouse } from "./warehouse.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";
import { User } from "../../user/entities/user.entity";
import { WarehouseTransferDetail } from "./warehouse-transfer-detail.entity";

@Entity('warehouse_transfers')
export class WarehouseTransfer extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @ManyToOne(() => User, (user) => user.warehouseTransfers)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.fromWarehouseTransfers)
    @JoinColumn({ name: 'from_warehouse_id' })
    fromWarehouse: Warehouse;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.toWarehouseTransfers)
    @JoinColumn({ name: 'to_warehouse_id' })
    toWarehouse: Warehouse; 

    @ManyToOne(() => Tenant, (tenant) => tenant.warehouseTransfers)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @OneToMany(() => WarehouseTransferDetail, (warehouseTransferDetail) => warehouseTransferDetail.warehouseTransfer)
    warehouseTransferDetails: WarehouseTransferDetail[];
}