import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ImportRecord } from "../entities/import.entity";

@Injectable()
export default class ImportRepository extends Repository<ImportRecord> {
    constructor(
        private dataSource: DataSource
    ){
        super(ImportRecord, dataSource.createEntityManager());
    }
}