import { User } from "../../../modules/user/entities/user.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { RolePermission } from "../../role/entities/role-permission.entity";

@Entity('tenants')
export class Tenant extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    name: string;

    @OneToMany(() => User, (user) => user.tenant)
    users: User[];

    @OneToMany(() => Role, (role) => role.tenant)
    roles: Role[];

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.tenant)
    rolePermissions: RolePermission[];
}