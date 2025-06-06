import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WarehouseTransferDetail } from "../entities/warehouse-transfer-detail.entity";

@Injectable()
export default class WarehouseTransferDetailRepository extends Repository<WarehouseTransferDetail> {
    constructor(
        private dataSource: DataSource
    ){
        super(WarehouseTransferDetail, dataSource.createEntityManager());
    }
}