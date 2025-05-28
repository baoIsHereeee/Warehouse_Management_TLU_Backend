import { Injectable } from '@nestjs/common';
import ProductRepository from '../../product/repositories/product.repository';  
import ImportDetailRepository from '../../../modules/import-record/repositories/import-detail.repository';
import ExportDetailRepository from '../../../modules/export-record/repositories/export-detail.repository';
import WarehouseDetailRepository from 'src/modules/warehouse/repositories/warehouse-detail.repository';

@Injectable()
export class ReportService {
    constructor(
        private productRepository: ProductRepository,
        private importDetailRepository: ImportDetailRepository, 
        private exportDetailRepository: ExportDetailRepository,
        private warehouseDetailRepository: WarehouseDetailRepository
    ){}

    async getTotalNumberOfInventory(){
        const products = await this.productRepository.find();
        return products.length;
    }

    async getTotalValueOfInventory(){
        const products = await this.productRepository.find();   
        const totalValue = products.reduce((acc, product) => acc + product.sellingPrice * product.currentStock, 0);
        return Number(totalValue.toFixed(2));
    }

    async getTotalValueOfImports(){
        const imports = await this.importDetailRepository.find();
        const totalValue = imports.reduce((acc, importDetail) => acc + importDetail.importPrice * importDetail.quantity, 0);
        return Number(totalValue.toFixed(2));
    }

    async getTotalValueOfExports(){
        const exports = await this.exportDetailRepository.find();
        const totalValue = exports.reduce((acc, exportDetail) => acc + exportDetail.sellingPrice * exportDetail.quantity, 0);
        return Number(totalValue.toFixed(2));
    }

    async getInventoryValuePerWarehouse() {
        const result = await this.warehouseDetailRepository
        .createQueryBuilder("wd")
        .select("wd.warehouseId", "warehouseId")
        .addSelect("w.name", "warehouseName")
        .addSelect("SUM(wd.quantity * p.sellingPrice)", "totalValue")
        .innerJoin("wd.warehouse", "w")
        .innerJoin("wd.product", "p")
        .groupBy("wd.warehouseId")
        .addGroupBy("w.name")
        .getRawMany();

        return result.map((r) => ({
        warehouseId: r.warehouseId,
        warehouseName: r.warehouseName,
        totalValue: Number(r.totalValue),
        }));
    }

    async getTotalInventoryPerWarehouse() {
        const result = await this.warehouseDetailRepository
            .createQueryBuilder("wd")
            .select("wd.warehouseId", "warehouseId")
            .addSelect("w.name", "warehouseName")
            .addSelect("SUM(wd.quantity)", "totalQuantity")
            .innerJoin("wd.warehouse", "w")
            .groupBy("wd.warehouseId")
            .addGroupBy("w.name")
            .getRawMany();

        return result.map((r) => ({
            warehouseId: r.warehouseId,
            warehouseName: r.warehouseName,
            totalQuantity: Number(r.totalQuantity),
        }));
    }

    async getLowStockProducts() {
        return await this.productRepository
          .createQueryBuilder("product")
          .where("product.minimumStock IS NOT NULL")
          .andWhere("product.currentStock <= product.minimumStock")
          .getMany();
    }

    async getInventoryDistributionByCategory() {
        const warehouseDetails = await this.warehouseDetailRepository
            .createQueryBuilder('wd')
            .select('w.id', 'warehouseId')
            .addSelect('w.name', 'warehouseName')
            .addSelect('c.id', 'categoryId')
            .addSelect('c.name', 'categoryName')
            .addSelect('SUM(wd.quantity)', 'totalQuantity')
            .innerJoin('wd.warehouse', 'w')
            .innerJoin('wd.product', 'p')
            .innerJoin('p.category', 'c')
            .groupBy('w.id')
            .addGroupBy('w.name')
            .addGroupBy('c.id')
            .addGroupBy('c.name')
            .getRawMany();

        const warehouseTotals = warehouseDetails.reduce((acc, curr) => {
            if (!acc[curr.warehouseId]) {
                acc[curr.warehouseId] = 0;
            }
            acc[curr.warehouseId] += Number(curr.totalQuantity);
            return acc;
        }, {});

        const result = warehouseDetails.reduce((acc, curr) => {
            const warehouseId = curr.warehouseId;
            const existingWarehouse = acc.find((w: any) => w.warehouseId === warehouseId);

            const category = {
                categoryId: curr.categoryId,
                categoryName: curr.categoryName,
                percentage: Number(((Number(curr.totalQuantity) / warehouseTotals[warehouseId]) * 100).toFixed(2))
            };

            if (existingWarehouse) {
                existingWarehouse.categories.push(category);
            } else {
                acc.push({
                    warehouseId: curr.warehouseId,
                    warehouseName: curr.warehouseName,
                    categories: [category]
                });
            }

            return acc;
        }, []);

        return result;
    }
}
