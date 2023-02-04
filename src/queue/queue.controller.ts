import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { Job } from 'bull';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  /* Check if redis connection is live */
  @Get('redis-connection-status')
  async status() {
    const result = await this.queueService.getQueueStatus();
    return result;
  }

  /* Add a url to the job queue for processing */
  @Post('url')
  async addUrlToQueue(@Body() body): Promise<Job> {
    try {
      const url = body.url;
      return await this.queueService.addJob(url);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Nest could not add: ${body.url} to the job queue ${error}`,
      });
    }
  }

  /* Get the status of a job by id */
  @Get('job')
  async getJobById(@Body() body): Promise<Job> {
    try {
      const id = body.id;
      return await this.queueService.getJob(id);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Nest could not get job: ${body.id} from the job queue ${error}`,
      });
    }
  }

  /* Get data of all historic jobs */
  @Get('completed_jobs')
  async getCompletedJobs(@Body() body): Promise<Array<Job>> {
    return await this.queueService.getCompletedJobs();
  }

  /* Get data of all failed jobs */
  @Get('failed_jobs')
  async getFailedJobs(@Body() body): Promise<Array<Job>> {
    return await this.queueService.getFailedJobs();
  }

  /* Get data of all jobs */
  @Get('all_jobs')
  async getAllJobs(@Body() body): Promise<Array<Job>> {
    return await this.queueService.getAllJobs();
  }

  /* manually fix a failed job with text input */
  @Post('fix_job')
  async fixJob(@Body() body): Promise<Job> {
    try {
      const id = body.id;
      const url = body.url;
      const text = body.text;
      return await this.queueService.addManualFixJob(url, id, text);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Nest could not get job: ${body.id} from the job queue ${error}`,
      });
    }
  }
}
