import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExportRecord } from "./export.entity";
import { Warehouse } from "../../../modules/warehouse/entities/warehouse.entity";

@Entity({ name: "export_details" })
export class ExportDetail {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'int'})
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'selling_price'})
    sellingPrice: number;

    @ManyToOne(() => ExportRecord, (exportRecord) => exportRecord.exportDetails)
    @JoinColumn({ name: "export_record_id" })
    exportRecord: ExportRecord;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.exportDetails)
    @JoinColumn({ name: "warehouse_id" })
    warehouse: Warehouse;
}