import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Customer } from "../entities/customer.entity";

@Injectable()
export default class CustomerRepository extends Repository<Customer> {
    constructor(
        private dataSource: DataSource
    ){
        super(Customer, dataSource.createEntityManager());
    }
}