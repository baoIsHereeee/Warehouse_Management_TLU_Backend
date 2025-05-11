import { Module } from '@nestjs/common';
import { ImportRecordController } from './import_record.controller';
import { ImportRecordService } from './services/import_record.service';

@Module({
  controllers: [ImportRecordController],
  providers: [ImportRecordService]
})
export class ImportRecordModule {}
