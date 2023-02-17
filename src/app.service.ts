import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import YoutubeTranscript from 'youtube-transcript';
import { embedlyFetch } from './helpers/embedly_fetch';
import {
  ARTICLE_LENGTH,
  cleanSummary,
  MAX_CHARACTER_LIMIT_PER_OPENAI_INPUT_REQUEST,
  MIN_CHARS_FOR_SUMMARY,
  sendMultipleRequests,
  sendMultipleRequestsAndGetBulletPoints,
  sendOneRequest,
  sendOneRequestForBulletPoints,
  splitArticleTokens,
} from './helpers/openai_fetch';
import { setTinqHeaders, tinqFetch } from './helpers/tinq_fetch';
import {
  combineTranscriptData,
  getTitleFromYoutubeUrl,
} from './helpers/youtube_fetch';
const h2p = require('html2plaintext');

@Injectable()
export class AppService {
  private readonly openaiConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  private readonly openaiClient = new OpenAIApi(this.openaiConfiguration);
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Extract any article in seconds.';
  }

  async tinq(url: string): Promise<string> {
    const body = new URLSearchParams({ extract_url: url });
    const headers = setTinqHeaders();
    const response = await axios
      .post('https://tinq.ai/api/v1/extract-article', body, headers)
      .then((res) => res.data.article.article)
      .catch((e) => {
        throw new Error('Tinq could not extract article');
      });
    return response;
  }

  async tinq_title(url: string): Promise<string> {
    const body = new URLSearchParams({ extract_url: url });
    const headers = setTinqHeaders();
    const response = await axios
      .post('https://tinq.ai/api/v1/extract-article', body, headers)
      .then((res) => res.data.article.title)
      .catch((e) => {
        throw new Error('Tinq could not get title from article');
      });
    return response;
  }

  async youtube_title(url: string): Promise<string> {
    const response = await getTitleFromYoutubeUrl(url);
    return response;
  }

  async embedly(url: string) {
    const embedly_url = `https://api.embedly.com/1/extract?key=${process.env.EMBEDLY_API_KEY}&url=${url}`;
    const options = { headers: { accept: 'application/json' } };
    const content = await axios(embedly_url, options)
      .then((response) => h2p(response.data.content))
      .catch((err) => {
        throw new Error('Embedly could not extract article');
      });
    return content;
  }

  async youtube_to_text(url: string): Promise<string> {
    const response = await YoutubeTranscript.fetchTranscript(url)
      .then((r) => combineTranscriptData(r))
      .catch((e) => {
        throw new Error('Could could not extract text from youtube video');
      });
    return response;
  }

  async openai_single(short_text: string) {
    let response = await sendOneRequest(short_text, this.openaiClient).catch(
      (err) => {
        throw new Error('OpenAI failed to get a summary of the article');
      },
    );
    response = cleanSummary(response);
    return response;
  }

  async openai_parallel_single_with_concatenation(chunks: Array<any>) {
    const get_summary = async (chunk: string) => {
      let response = await sendOneRequest(chunk, this.openaiClient).catch(
        (err) => {
          throw new Error('OpenAI failed to get a summary of the article');
        },
      );
      response = cleanSummary(response);
      return response;
    };
    const unresolvedPromises = chunks.map(get_summary);
    const summaries = await Promise.all(unresolvedPromises)
    const summary = summaries.join('\r\n');
    return summary;
  }

  async openai_single_bullets(short_text: string) {
    const response = await sendOneRequestForBulletPoints(
      short_text,
      this.openaiClient,
    ).catch((err) => {
      throw new Error('OpenAI failed to get a bullet points for the article');
    });
    return response;
  }

  async openai_multiple(long_text: string) {
    const textSplits = splitArticleTokens(long_text);
    let response = await sendMultipleRequests(
      textSplits,
      this.openaiClient,
    ).catch((err) => {
      throw new Error(
        'OpenAI failed to get summaries for 1 or more parts of the article',
      );
    });
    response = cleanSummary(response);
    return response;
  }

  async openai_multiple_bullet_points(long_text: string) {
    const textSplits = splitArticleTokens(long_text);
    const response = await sendMultipleRequestsAndGetBulletPoints(
      textSplits,
      this.openaiClient,
    ).catch((err) => {
      throw new Error(
        'OpenAI failed to get bullet points for 1 or more parts of the article',
      );
    });
    return response;
  }

  async summarize_article(url: string) {
    const content = await embedlyFetch(url)
      .catch(async (err) => {
        this.logger.error(
          JSON.stringify({
            message: 'Embedly could not extract text for url',
            url: url,
            error: err,
            timestamp: Date.now(),
          }),
        );
        return await tinqFetch(url);
      })
      .catch((err) => {
        this.logger.error(
          JSON.stringify({
            message: 'Tinq could not extract text for url',
            url: url,
            error: err,
            timestamp: Date.now(),
          }),
        );
        throw new Error('Article could not be extracted by Embedly or Tinq');
      });
    const strategy =
      content.length > MAX_CHARACTER_LIMIT_PER_OPENAI_INPUT_REQUEST
        ? ARTICLE_LENGTH.LARGE
        : ARTICLE_LENGTH.SMALL;
    let response;
    switch (strategy) {
      case ARTICLE_LENGTH.LARGE:
        const textSplits = splitArticleTokens(content);
        response = await sendMultipleRequests(
          textSplits,
          this.openaiClient,
        ).catch((err) => {
          this.logger.error(
            JSON.stringify({
              message: 'Long summary failed to perform',
              url: url,
              error: err,
              timestamp: Date.now(),
            }),
          );
          throw new Error(err);
        });
        break;
      default:
        if (content.length < MIN_CHARS_FOR_SUMMARY) {
          this.logger.error(
            JSON.stringify({
              message:
                'Article did not extract properly (not enough text for summary)',
              url: url,
              error:
                'Article did not extract properly (not enough text for summary)',
              timestamp: Date.now(),
            }),
          );
          throw new Error('Article did not extract properly');
        }
        response = await sendOneRequest(content, this.openaiClient).catch(
          (err) => {
            this.logger.error(
              JSON.stringify({
                message: 'Short summary failed to perform',
                url: url,
                error: err,
                timestamp: Date.now(),
              }),
            );
            throw new Error('OpenAI request failed to summarize article');
          },
        );
        break;
    }
    response = cleanSummary(response);
    return response;
  }

  async bullet_points_article(url: string) {
    const content = await embedlyFetch(url)
      .catch(async (err) => {
        this.logger.error(
          JSON.stringify({
            message: 'Embedly could not extract text for url',
            url: url,
            error: err,
            timestamp: Date.now(),
          }),
        );
        return await tinqFetch(url);
      })
      .catch((err) => {
        this.logger.error(
          JSON.stringify({
            message: 'Tinq could not extract text for url',
            url: url,
            error: err,
            timestamp: Date.now(),
          }),
        );
        throw new Error('Article could not be extracted by Embedly or Tinq');
      });
    const strategy =
      content.length > MAX_CHARACTER_LIMIT_PER_OPENAI_INPUT_REQUEST
        ? ARTICLE_LENGTH.LARGE
        : ARTICLE_LENGTH.SMALL;
    let response;
    switch (strategy) {
      case ARTICLE_LENGTH.LARGE:
        const textSplits = splitArticleTokens(content);
        response = await sendMultipleRequestsAndGetBulletPoints(
          textSplits,
          this.openaiClient,
        ).catch((err) => {
          this.logger.error(
            JSON.stringify({
              message: 'Long bullet point summary failed to perform',
              url: url,
              error: err,
              timestamp: Date.now(),
            }),
          );
          throw new Error(err);
        });
        break;
      default:
        if (content.length < MIN_CHARS_FOR_SUMMARY) {
          this.logger.error(
            JSON.stringify({
              message:
                'Article did not extract properly so summary failed to perform',
              url: url,
              error:
                'Article did not extract properly so minimum words for summary was not met.',
              timestamp: Date.now(),
            }),
          );
          throw new Error('Article did not extract properly');
        }
        response = await sendOneRequestForBulletPoints(
          content,
          this.openaiClient,
        ).catch((err) => {
          this.logger.error(
            JSON.stringify({
              message: 'Short bullet point summary failed to perform',
              url: url,
              error: err,
              timestamp: Date.now(),
            }),
          );
          throw new Error('OpenAI request failed to summarize article');
        });
        break;
    }
    return response;
  }
}
