import { Category } from "../../../modules/category/entities/category.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../../modules/user/entities/user.entity";
import { WarehouseDetail } from "../../../modules/warehouse/entities/warehouse-detail.entity";

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

    @Column()
    current_stock: number;

    @Column({ nullable: true, default: null })
    minimum_stock: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    selling_price: number;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "category_id" })
    category: Category | null;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: "user_id" })
    user: User | string;

    @OneToMany(() => WarehouseDetail, (warehouseDetail) => warehouseDetail.product)
    warehouseDetails: WarehouseDetail[];
}