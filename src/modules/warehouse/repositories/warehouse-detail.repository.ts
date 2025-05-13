import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WarehouseDetail } from "../entities/warehouse-detail.entity";

@Injectable()
export default class WarehouseDetailRepository extends Repository<WarehouseDetail> {
    constructor(
        private dataSource: DataSource
    ){
        super(WarehouseDetail, dataSource.createEntityManager());
    }
}