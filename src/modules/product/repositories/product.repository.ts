import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Product } from "../entities/product.entity";

@Injectable()
export default class ProductRepository extends Repository<Product> {
    constructor(
        private dataSource: DataSource
    ){
        super(Product, dataSource.createEntityManager());
    }
}