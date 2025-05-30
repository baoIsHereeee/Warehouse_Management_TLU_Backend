import { Category } from "../../../modules/category/entities/category.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../../modules/user/entities/user.entity";
import { WarehouseDetail } from "../../../modules/warehouse/entities/warehouse-detail.entity";
import { ExportDetail } from "../../../modules/export-record/entities/export-detail.entity";
import { ImportDetail } from "../../../modules/import-record/entities/import-detail.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";

@Entity({ name: "products" })
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: 'text', nullable: true })
    image: string | null;

    @Column({ name: "current_stock", default: 0 })
    currentStock: number;

    @Column({ type: "integer", nullable: true, default: null, name: "minimum_stock" })
    minimumStock: number | null;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "selling_price" })
    sellingPrice: number;

    @Column({ type: "integer", nullable: true, default: null, name: "order_stock" })
    orderStock: number | null;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "category_id" })
    category: Category | null;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: "user_id" })
    user: User | null;

    @OneToMany(() => WarehouseDetail, (warehouseDetail) => warehouseDetail.product)
    warehouseDetails: WarehouseDetail[];

    @OneToMany(() => ExportDetail, (exportDetail) => exportDetail.product)
    exportDetails: ExportDetail[];

    @OneToMany(() => ImportDetail, (importDetail) => importDetail.product)
    importDetails: ImportDetail[];

    @ManyToOne(() => Tenant, (tenant) => tenant.products)
    @JoinColumn({ name: "tenant_id" })
    tenant: Tenant;
}