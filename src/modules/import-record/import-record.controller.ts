import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ImportRecordService } from './services/import-record.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ImportRecord } from './entities/import.entity';
import { CreateImportDTO, UpdateImportDTO } from './dtos';

@Controller('imports')
export class ImportRecordController {
    constructor(
        private importService: ImportRecordService,
    ){}

    @Get()
    getAllExportRecords(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<ImportRecord>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/imports', 
        };

        return this.importService.getAllImportRecords(options, query);
    }

    @Get(':id')
    getImportRecordById(@Param('id') id: string) {
        return this.importService.getImportRecordById(id);
    }

    @Post()
    createImportRecord(@Body() createData: CreateImportDTO) {
        return this.importService.createImportRecord(createData);
    }

    @Put(':id')
    updateImportRecord(@Param('id') id: string, @Body() updateData: UpdateImportDTO) {
        return this.importService.updateImportRecord(id, updateData);
    }

    @Delete(':id')
    deleteImportRecord(@Param('id') id: string) {
        return this.importService.deleteImportRecord(id);
    }
}
