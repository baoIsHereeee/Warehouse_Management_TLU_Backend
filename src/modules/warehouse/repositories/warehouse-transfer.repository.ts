import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WarehouseTransfer } from "../entities/warehouse-transfer.entity";

@Injectable()
export default class WarehouseTransferRepository extends Repository<WarehouseTransfer> {
    constructor(
        private dataSource: DataSource
    ){
        super(WarehouseTransfer, dataSource.createEntityManager());
    }
}