import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "../../permission/entities/permission.entity";
import { Tenant } from "../../../modules/tenant/entities/tenant.entity";

@Entity('roles_permissions')
export class RolePermission {
    @PrimaryColumn('uuid', { name: 'role_id' })
    roleId: string;

    @PrimaryColumn('int', { name: 'permission_id' })
    permissionId: number;

    @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

    @ManyToOne(() => Tenant, (tenant) => tenant.rolePermissions)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}