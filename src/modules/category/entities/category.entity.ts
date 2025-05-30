import { Product } from "../../../modules/product/entities/product.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Tenant } from "../../tenant/entities/tenant.entity";

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

    @ManyToOne(() => Tenant, (tenant) => tenant.categories)
    @JoinColumn({ name: "tenant_id" })
    tenant: Tenant;
}