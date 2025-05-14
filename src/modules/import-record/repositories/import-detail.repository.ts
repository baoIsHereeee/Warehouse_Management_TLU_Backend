import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ImportDetail } from "../entities/import-detail.entity";

@Injectable()
export default class ImportDetailRepository extends Repository<ImportDetail> {
    constructor(
        private dataSource: DataSource
    ){
        super(ImportDetail, dataSource.createEntityManager());
    }
}