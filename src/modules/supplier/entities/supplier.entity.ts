import { ImportRecord } from "../../../modules/import-record/entities/import.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "suppliers" })
export class Supplier extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ type: 'text'})
    fullname: string;
    
    @Column({ type: 'text', unique: true, nullable: true })
    email: string | null;
    
    @Column({ type: 'text' })
    phone: string;

    @Column({ type: 'text' })
    address: string;

    @OneToMany(() => ImportRecord, (importRecord) => importRecord.supplier)
    importRecords: ImportRecord[];
}