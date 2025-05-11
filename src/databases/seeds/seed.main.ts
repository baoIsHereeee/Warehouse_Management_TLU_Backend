import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';
import { SeedService } from './services/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedsModule);
  const seedService = app.get(SeedService);
  await seedService.run();
  await app.close();
  console.log("Seeding Successful!");
}

bootstrap()
