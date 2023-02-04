import { response } from 'express';
import { url } from 'inspector';
import YoutubeTranscript from 'youtube-transcript';
import { embedlyFetch } from './embedly_fetch';
import {
  ARTICLE_LENGTH,
  generateTitle,
  MAX_CHARACTER_LIMIT_PER_OPENAI_INPUT_REQUEST,
  MIN_CHARS_FOR_SUMMARY,
  sendMultipleRequests,
  sendMultipleRequestsExtraLargeScenario,
  sendOneRequest,
  splitArticleTokens,
} from './openai_fetch';
import { getTitleFromTinq, tinqFetch } from './tinq_fetch';
import { combineTranscriptData } from './youtube_fetch';

export const enum URL_TYPE {
  YOUTUBE_VIDEO,
  ARTICLE,
}

export interface Completed_Job {
  url: string;
  read_length: string;
  completed_summary: string;
  summary_status: string;
  title: string;
  user?: string;
  transcript?: string;
}

// url -> youtube video, bad url, article
export const determineUrlType = (url: string) => {
  if (url.includes('youtube.com/watch')) {
    return URL_TYPE.YOUTUBE_VIDEO;
  } else {
    return URL_TYPE.ARTICLE;
  }
};

// url type -> extract text
export const extractText = async (url_type: URL_TYPE, url: string) => {
  let text;
  switch (url_type) {
    case URL_TYPE.YOUTUBE_VIDEO:
      text = await YoutubeTranscript.fetchTranscript(url)
        .then((r) => combineTranscriptData(r))
        .catch((e) => {
          throw new Error('Could could not extract text from youtube video');
        });
      return text;
    default:
      text = await embedlyFetch(url)
        .catch(async (err) => {
          return await tinqFetch(url);
        })
        .catch((err) => {
          throw new Error('Article could not be extracted by Embedly or Tinq');
        });
      return text;
  }
};

//get title from article
export const getTitle = async (
  url: string,
  url_type: URL_TYPE,
  openaiClient: any,
  text?: string,
) => {
  if (url_type == URL_TYPE.YOUTUBE_VIDEO) {
    return await fetch(`https://noembed.com/embed?dataType=json&url=${url}`)
      .then((res) => res.json())
      .then((data) => data.title)
      .catch((e) => {
        throw new Error(e);
      });
  } else {
    return await getTitleFromTinq(url)
      .catch(async (err) => {
        console.log(text);
        return await generateTitle(text, openaiClient);
      })
      .catch((e) => {
        return 'Untitled';
      });
  }
};

//text -> strategy
export const determineTextLength = (text: string) => {
  if (text.length < MAX_CHARACTER_LIMIT_PER_OPENAI_INPUT_REQUEST) {
    return ARTICLE_LENGTH.SMALL;
  } else if (
    MAX_CHARACTER_LIMIT_PER_OPENAI_INPUT_REQUEST < text.length &&
    text.length < MAX_CHARACTER_LIMIT_PER_OPENAI_INPUT_REQUEST * 5
  ) {
    return ARTICLE_LENGTH.LARGE;
  }

  return ARTICLE_LENGTH.EXTRA_LARGE;
};

// Quick and dirty way to find the number of minutes to read an article
export const determineReadLength = (text: string) => {
  return Math.ceil(text.length / 2500);
};

//perform summary
export const performSummary = async (
  text_length: ARTICLE_LENGTH,
  text: string,
  openaiClient,
) => {
  let response;
  let textSplits;
  switch (text_length) {
    case ARTICLE_LENGTH.EXTRA_LARGE:
      textSplits = splitArticleTokens(text);
      response = await sendMultipleRequestsExtraLargeScenario(
        textSplits,
        openaiClient,
      ).catch((err) => {
        throw new Error(err);
      });
      break;
    case ARTICLE_LENGTH.LARGE:
      textSplits = splitArticleTokens(text);
      response = await sendMultipleRequests(textSplits, openaiClient).catch(
        (err) => {
          throw new Error(err);
        },
      );
      break;
    default:
      if (text.length < MIN_CHARS_FOR_SUMMARY) {
        throw new Error('Article did not extract properly');
      }
      response = await sendOneRequest(text, openaiClient).catch((err) => {
        throw new Error('OpenAI request failed to summarize article');
      });
      break;
  }
  return await response;
};
