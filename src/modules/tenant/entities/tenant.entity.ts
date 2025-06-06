import { User } from "../../../modules/user/entities/user.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { RolePermission } from "../../role/entities/role-permission.entity";
import { UserRole } from "../../user/entities/user-role.entity";
import { Category } from "../../category/entities/category.entity";
import { Customer } from "../../customer/entities/customer.entity";
import { Product } from "../../product/entities/product.entity";
import { Supplier } from "../../supplier/entities/supplier.entity";
import { ExportRecord } from "../../export-record/entities/export.entity";
import { ExportDetail } from "../../export-record/entities/export-detail.entity";
import { ImportRecord } from "../../import-record/entities/import.entity";
import { ImportDetail } from "../../import-record/entities/import-detail.entity";
import { Warehouse } from "../../warehouse/entities/warehouse.entity";
import { WarehouseDetail } from "../../warehouse/entities/warehouse-detail.entity";
import { WarehouseTransfer } from "../../warehouse/entities/warehouse-transfer.entity";
import { WarehouseTransferDetail } from "../../../modules/warehouse/entities/warehouse-transfer-detail.entity";

@Entity('tenants')
export class Tenant extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    name: string;

    @OneToMany(() => User, (user) => user.tenant)
    users: User[];

    @OneToMany(() => Role, (role) => role.tenant)
    roles: Role[];

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.tenant)
    rolePermissions: RolePermission[];

    @OneToMany(() => UserRole, (userRole) => userRole.tenant)
    userRoles: UserRole[];

    @OneToMany(() => Category, (category) => category.tenant)
    categories: Category[];

    @OneToMany(() => Customer, (customer) => customer.tenant)
    customers: Customer[];

    @OneToMany(() => Product, (product) => product.tenant)
    products: Product[];

    @OneToMany(() => Supplier, (supplier) => supplier.tenant)
    suppliers: Supplier[];

    @OneToMany(() => ExportRecord, (exportRecord) => exportRecord.tenant)
    exportRecords: ExportRecord[];

    @OneToMany(() => ExportDetail, (exportDetail) => exportDetail.tenant)
    exportDetails: ExportDetail[];

    @OneToMany(() => ImportRecord, (importRecord) => importRecord.tenant)
    importRecords: ImportRecord[];

    @OneToMany(() => ImportDetail, (importDetail) => importDetail.tenant)
    importDetails: ImportDetail[];

    @OneToMany(() => Warehouse, (warehouse) => warehouse.tenant)
    warehouses: Warehouse[];

    @OneToMany(() => WarehouseDetail, (warehouseDetail) => warehouseDetail.tenant)
    warehouseDetails: WarehouseDetail[];

    @OneToMany(() => WarehouseTransfer, (warehouseTransfer) => warehouseTransfer.tenant)
    warehouseTransfers: WarehouseTransfer[];

    @OneToMany(() => WarehouseTransferDetail, (warehouseTransferDetail) => warehouseTransferDetail.tenant)
    warehouseTransferDetails: WarehouseTransferDetail[];
}