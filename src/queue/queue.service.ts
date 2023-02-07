import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, JobStatus, Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('queue') private queue: Queue) { }

  async getQueueStatus() {
    return this.queue.client.status;
  }

  async addJob(url: string): Promise<Job> {
    const result = await this.queue.add(
      'add-url-job',
      {
        url: url,
      },
      {},
    );
    return result;
  }

  async getJob(id: string) {
    return await this.queue.getJob(id).catch((e) => e);
  }

  /* get all completed jobs where return value is a summary string */
  async getCompletedJobs() {
    const completed_jobs = await this.queue.getCompleted();
    return completed_jobs;
  }

  /* get all failed jobs where return value is an error */
  async getFailedJobs() {
    const failed_jobs = await this.queue.getFailed();
    return failed_jobs;
  }

  /* get all  jobs where return value is an error or completed */
  async getAllJobs() {
    const job_types: JobStatus[] = [
      'completed',
      'waiting',
      'active',
      'delayed',
      'failed',
      'paused',
    ];
    const all_jobs = await this.queue.getJobs(job_types);
    return all_jobs;
  }

  /* trigger a manual processing of a failed job with raw_text as input */
  async addManualFixJob(
    url: string,
    id: number,
    raw_text: string,
  ): Promise<Job> {
    const result = await this.queue.add(
      'manually-fix-job',
      {
        url: url,
        id: id,
        raw_text: raw_text,
      },
      {},
    );
    return result;
  }
}
