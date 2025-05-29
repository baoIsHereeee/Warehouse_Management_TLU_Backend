import { Exclude } from "class-transformer";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { Product } from "../../../modules/product/entities/product.entity";
import { ExportRecord } from "../../../modules/export-record/entities/export.entity";
import { ImportRecord } from "../../../modules/import-record/entities/import.entity";
import { Tenant } from "../../../modules/tenant/entities/tenant.entity";
import { UserRole } from "./user-role.entity";
@Entity({ name: "users" })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'text'})
    fullname: string;

    @Column({ type: 'text', unique: true, nullable: true })
    email: string | null;
    
    @Column({ type: 'text'})
    @Exclude()
    password: string

    @Column({ type: 'int', nullable: true })
    age: number | null;

    // @ManyToMany(() => Role, (role) => role.users)
    // @JoinTable({
    //     name: "users_roles",
    //     joinColumn: { name: "user_id", referencedColumnName: "id" },
    //     inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
    // })
    // roles: Role[];

    @OneToMany(() => UserRole, (userRole) => userRole.user)
    userRoles: UserRole[];

    @OneToMany(() => Product, (product) => product.user)
    products: Product[];

    @OneToMany(() => ExportRecord, (exportRecord) => exportRecord.user)
    exportRecords: ExportRecord[];

    @OneToMany(() => ImportRecord, (importRecord) => importRecord.user)
    importRecords: ImportRecord[];

    @ManyToOne(() => Tenant, (tenant) => tenant.users)
    @JoinColumn({ name: "tenant_id" })
    tenant: Tenant;
}