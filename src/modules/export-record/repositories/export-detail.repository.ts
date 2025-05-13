import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ExportDetail } from "../entities/export-detail.entity";

@Injectable()
export default class ExportDetailRepository extends Repository<ExportDetail> {
    constructor(
        private dataSource: DataSource
    ){
        super(ExportDetail, dataSource.createEntityManager());
    }
}