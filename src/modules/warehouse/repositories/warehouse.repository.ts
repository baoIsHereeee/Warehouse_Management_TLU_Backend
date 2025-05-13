import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Warehouse } from "../entities/warehouse.entity";

@Injectable()
export default class WarehouseRepository extends Repository<Warehouse> {
    constructor(
        private dataSource: DataSource
    ){
        super(Warehouse, dataSource.createEntityManager());
    }
}