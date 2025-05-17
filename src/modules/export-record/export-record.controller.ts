import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExportService } from './services/export-record.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ExportRecord } from './entities/export.entity';
import { CreateExportDTO, UpdateExportDTO } from './dtos';
import { Auth } from '../../decorators/permission.decorator';

@Controller('exports')
export class ExportRecordController {
    constructor(
        private exportService: ExportService
    ){}

    @Get()
    @Auth("get_all_exports")
    getAllExportRecords(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<ExportRecord>>{
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/exports', 
        };

        return this.exportService.getAllExportRecords(options, query);
    }

    @Get(':id')
    @Auth("get_export_by_id")
    getExportRecordById(@Param('id') id: string) {
        return this.exportService.getExportRecordById(id);
    }

    @Post()
    @Auth("create_export")
    @UsePipes(new ValidationPipe())
    createExportRecord(@Body() createData: CreateExportDTO) {
        return this.exportService.createExportRecord(createData);
    }

    @Put(':id')
    @Auth("update_export")
    @UsePipes(new ValidationPipe())
    updateExportRecord(@Param('id') id: string, @Body() updateData: UpdateExportDTO) {
        return this.exportService.updateExportRecord(id, updateData);
    }

    @Delete(':id')
    @Auth("delete_export")
    deleteExportRecord(@Param('id') id: string) {
        return this.exportService.deleteExportRecord(id);
    }

}
