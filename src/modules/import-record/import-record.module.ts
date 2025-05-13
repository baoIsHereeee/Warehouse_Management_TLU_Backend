import { Module } from '@nestjs/common';
import { ImportRecordController } from './import-record.controller';
import { ImportRecordService } from './services/import-record.service';

@Module({
  controllers: [ImportRecordController],
  providers: [ImportRecordService]
})
export class ImportRecordModule {}
