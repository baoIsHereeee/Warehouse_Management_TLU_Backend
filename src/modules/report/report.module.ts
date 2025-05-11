import { Module } from '@nestjs/common';
import { ReportService } from './services/report.service';
import { ReportController } from './report.controller';

@Module({
  providers: [ReportService],
  controllers: [ReportController]
})
export class ReportModule {}
