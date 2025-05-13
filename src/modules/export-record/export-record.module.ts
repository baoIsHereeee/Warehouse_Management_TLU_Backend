import { Module } from '@nestjs/common';
import { ExportRecordController } from './export-record.controller';

@Module({
  controllers: [ExportRecordController]
})
export class ExportRecordModule {}
