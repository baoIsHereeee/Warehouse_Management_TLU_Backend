import { Module } from '@nestjs/common';
import { ImportRecordController } from './import-record.controller';
import { ImportRecordService } from './services/import-record.service';
import ImportRepository from './repositories/import.repository';
import ImportDetailRepository from './repositories/import-detail.repository';

@Module({
  controllers: [ImportRecordController],
  providers: [ImportRecordService, ImportRepository, ImportDetailRepository],
  exports: [ImportRepository, ImportDetailRepository]
})
export class ImportRecordModule {}
