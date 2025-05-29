import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Permission } from "../../permission/entities/permission.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";
import { RolePermission } from "./role-permission.entity";
import { UserRole } from "../../user/entities/user-role.entity";

@Entity({ name: "roles"})
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    // @ManyToMany(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
    // users: User[];

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[];

    @OneToMany(() => UserRole, (userRole) => userRole.role)
    userRoles: UserRole[];

    @ManyToOne(() => Tenant, (tenant) => tenant.roles)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}