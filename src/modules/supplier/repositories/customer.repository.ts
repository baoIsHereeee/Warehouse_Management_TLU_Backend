import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Supplier } from "../entities/supplier.entity";

@Injectable()
export default class SupplierRepository extends Repository<Supplier> {
    constructor(
        private dataSource: DataSource
    ){
        super(Supplier, dataSource.createEntityManager());
    }
}