import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { UserModule } from '../user/user.module';

@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [UserModule],
})
export class MailModule {}
