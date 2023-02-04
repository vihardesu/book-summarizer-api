import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Configuration, OpenAIApi } from 'openai';
import { cleanSummary, generateTitle } from 'src/helpers/openai_fetch';
import {
  determineReadLength,
  determineTextLength,
  determineUrlType,
  extractText,
  performSummary,
  Completed_Job,
  getTitle,
} from 'src/helpers/queue_processor';

@Processor('queue')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);
  private readonly openaiConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  private readonly openaiClient = new OpenAIApi(this.openaiConfiguration);

  @Process('add-url-job')
  async processJob(job: Job): Promise<Completed_Job> {
    const url = job.data.url;
    const url_type = determineUrlType(url);
    const text = await extractText(url_type, url);
    const title = await getTitle(url, url_type, this.openaiClient, text);
    const text_length = determineTextLength(text);
    const read_length = `${determineReadLength(text).toString()} minute(s)`;
    const summary = await performSummary(text_length, text, this.openaiClient);
    const completed_summary = cleanSummary(summary);
    return {
      completed_summary: completed_summary,
      read_length: read_length,
      url: url,
      summary_status: 'Summarized by GPT-3',
      user: 'vihardesu@gmail.com',
      transcript: text,
      title: title,
    };
  }

  @Process('manually-fix-job')
  async processJobManually(job: Job) {
    const url = job.data.url;
    const id = job.data.id;
    const raw_text = job.data.raw_text;
    const text_length = determineTextLength(raw_text);
    const title = await generateTitle(raw_text, this.openaiClient);
    const read_length = `${determineReadLength(raw_text).toString()} minute(s)`;
    const summary = await performSummary(
      text_length,
      raw_text,
      this.openaiClient,
    );
    const completed_summary = cleanSummary(summary);
    const result = {
      old_job_id: id,
      url: url,
      completed_summary: completed_summary,
      summary_status: 'Summarized by GPT-3',
      user: 'vihardesu@gmail.com',
      read_length: read_length,
      transcript: raw_text,
      title: title,
    };
    return result;
  }
}
