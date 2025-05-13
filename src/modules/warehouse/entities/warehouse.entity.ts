import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WarehouseDetail } from "./warehouse-detail.entity";
import { ExportDetail } from "../../../modules/export-record/entities/export-detail.entity";

@Entity({ name: "warehouses" })
export class Warehouse extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    address: string;

    @Column({ type: "text", nullable: true })
    phone: string;

    @OneToMany(() =>  WarehouseDetail, (warehouseDetail) => warehouseDetail.warehouse)
    warehouseDetails: WarehouseDetail[];

    @OneToMany(() => ExportDetail, (exportDetail) => exportDetail.warehouse)
    exportDetails: ExportDetail[];
}