import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export default class UserRepository extends Repository<User> {
    constructor(
        private dataSource: DataSource
    ){
        super(User, dataSource.createEntityManager());
    }
}