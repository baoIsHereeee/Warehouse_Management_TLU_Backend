import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ExportRecord } from "../entities/export.entity";

@Injectable()
export default class ExportRepository extends Repository<ExportRecord> {
    constructor(
        private dataSource: DataSource
    ){
        super(ExportRecord, dataSource.createEntityManager());
    }
}