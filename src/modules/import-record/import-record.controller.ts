import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ImportRecordService } from './services/import-record.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ImportRecord } from './entities/import.entity';
import { CreateImportDTO, UpdateImportDTO } from './dtos';
import { Auth } from '../../decorators/permission.decorator';
import { CurrentTenant } from 'src/decorators/current-tenant.decorator';

@Controller('imports')
export class ImportRecordController {
    constructor(
        private importService: ImportRecordService,
    ){}

    @Get()
    @Auth("get_all_imports")
    getAllImportRecords(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
        @CurrentTenant() tenantId: string
    ): Promise<Pagination<ImportRecord>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/imports', 
        };

        return this.importService.getAllImportRecords(options, tenantId, query);
    }

    @Get(':id')
    @Auth("get_import_by_id")
    getImportRecordById(@Param('id') id: string) {
        return this.importService.getImportRecordById(id);
    }

    @Post()
    @Auth("create_import")
    createImportRecord(@Body() createData: CreateImportDTO, @CurrentTenant() tenantId: string) {
        return this.importService.createImportRecord(createData, tenantId);
    }

    @Put(':id')
    @Auth("update_import")
    updateImportRecord(@Param('id') id: string, @Body() updateData: UpdateImportDTO, @CurrentTenant() tenantId: string) {
        return this.importService.updateImportRecord(id, updateData, tenantId);
    }

    @Delete(':id')
    @Auth("delete_import")
    deleteImportRecord(@Param('id') id: string) {
        return this.importService.deleteImportRecord(id);
    }
}
