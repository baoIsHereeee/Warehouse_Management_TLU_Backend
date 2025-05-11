import { Module } from '@nestjs/common';
import { ExportRecordController } from './export_record.controller';

@Module({
  controllers: [ExportRecordController]
})
export class ExportRecordModule {}
