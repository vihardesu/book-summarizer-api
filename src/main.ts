import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  createBullBoard,
  BullAdapter,
  ExpressAdapter,
} from '@bull-board/express';
import { Queue } from 'bull';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Set max payload for JSON and URL encoded bodies
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  // Swagger UI
  const config = new DocumentBuilder()
    .setTitle('Book Summaries API')
    .setDescription('endpoints to manage book summaries')
    .setVersion('1.0')
    .addTag('books')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // BullBoard Redis Queue
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
