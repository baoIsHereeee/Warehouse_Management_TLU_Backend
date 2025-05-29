import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Permission } from "../../permission/entities/permission.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";

@Entity({ name: "roles"})
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToMany(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
    users: User[];

    @ManyToMany(() => Permission, (permission) => permission.roles, { onDelete: 'CASCADE' })    
    @JoinTable({ 
        name: "roles_permissions",
        joinColumn: { name: 'role_id', referencedColumnName: 'id' }, 
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
     })
    permissions: Permission[];

    @ManyToOne(() => Tenant, (tenant) => tenant.roles)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}