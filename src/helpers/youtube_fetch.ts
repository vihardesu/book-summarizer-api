import { TranscriptResponse } from 'youtube-transcript';

export const combineTranscriptData = async (
  transcript: TranscriptResponse[],
) => {
  let text_only = transcript.map((i) => i.text);
  text_only = text_only.filter((i) => i != undefined);
  text_only = text_only.map((i) => i.replace(/\s+/g, ' ').trim());
  text_only = text_only.filter((i) => i[0] != '[');
  const raw_text = text_only.join();
  return raw_text;
};

export const getTitleFromYoutubeUrl = async (url: string) => {
  return await fetch(`https://noembed.com/embed?dataType=json&url=${url}`)
    .then((res) => res.json())
    .then((data) => data.title)
    .catch((e) => {
      throw new Error(e);
    });
};
