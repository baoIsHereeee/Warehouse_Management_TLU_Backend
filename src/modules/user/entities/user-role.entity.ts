import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Role } from "../../role/entities/role.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";

@Entity('users_roles')
export class UserRole {
    @PrimaryColumn('uuid', { name: 'user_id' })
    userId: string;

    @PrimaryColumn('uuid', { name: 'role_id' })
    roleId: string;

    @ManyToOne(() => User, (user) => user.userRoles)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Role, (role) => role.userRoles)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Tenant, (tenant) => tenant.userRoles)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}

