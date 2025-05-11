import { Exclude } from "class-transformer";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ type: 'int'})
    age: number;
}