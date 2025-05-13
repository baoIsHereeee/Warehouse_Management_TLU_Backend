import { Category } from "../../../modules/category/entities/category.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../../modules/user/entities/user.entity";
import { WarehouseDetail } from "../../../modules/warehouse/entities/warehouse-detail.entity";
import { ExportDetail } from "../../../modules/export-record/entities/export-detail.entity";

@Entity({ name: "products" })
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: 'text', nullable: true })
    image: string;

    @Column({ name: "current_stock" })
    currentStock: number;

    @Column({ nullable: true, default: null, name: "minimum_stock" })
    minimumStock: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "selling_price" })
    sellingPrice: number;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "category_id" })
    category: Category | null;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: "user_id" })
    user: User | string;

    @OneToMany(() => WarehouseDetail, (warehouseDetail) => warehouseDetail.product)
    warehouseDetails: WarehouseDetail[];

    @OneToMany(() => ExportDetail, (exportDetail) => exportDetail.product)
    exportDetails: ExportDetail[];
}