import { Product } from "../../../modules/product/entities/product.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "categories" })
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255, unique: true })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}