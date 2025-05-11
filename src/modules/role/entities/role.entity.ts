import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity({ name: "roles"})
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @ManyToMany(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
    users: User[];
}