import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  createBullBoard,
  BullAdapter,
  ExpressAdapter,
} from '@bull-board/express';
import { Queue } from 'bull';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/bull-board');
  const aQueue = app.get<Queue>(`BullQueue_queue`);
  createBullBoard({
    queues: [new BullAdapter(aQueue)],
    serverAdapter,
  });
  app.use('/bull-board', serverAdapter.getRouter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
