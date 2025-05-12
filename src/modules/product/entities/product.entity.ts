import { Category } from "../../../modules/category/entities/category.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../../modules/user/entities/user.entity";

@Entity({ name: "products" })
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: 'text' })
    image: string;

    @Column()
    current_stock: number;

    @Column()
    minimum_stock: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    selling_price: number;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "category_id" })
    categories: Category;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: "user_id" })
    user: User;
}