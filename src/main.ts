import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';
import {
  createBullBoard,
  BullAdapter,
  ExpressAdapter,
} from '@bull-board/express';
import { Queue } from 'bull';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useLogger(
    WinstonModule.createLogger({
      format: winston.format.uncolorize(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        new WinstonCloudWatch({
          name: 'Cloudwatch Logs',
          logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
          logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
          awsAccessKeyId: process.env.AWS_ACCESS_KEY,
          awsSecretKey: process.env.AWS_KEY_SECRET,
          awsRegion: process.env.CLOUDWATCH_REGION,
          messageFormatter: function (item) {
            return (
              item.level + ': ' + item.message + ' ' + JSON.stringify(item.meta)
            );
          },
        }),
      ],
    }),
  );

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
