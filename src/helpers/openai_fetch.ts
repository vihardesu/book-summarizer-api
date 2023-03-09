import { encode, decode } from 'gpt-3-encoder';
import { Configuration, OpenAIApi } from 'openai';
import { text } from 'stream/consumers';

export const enum ARTICLE_LENGTH {
  SMALL,
  LARGE,
  EXTRA_LARGE,
}

export const MAX_TOTAL_TOKENS_PER_REQUEST = 4000;

export const MAX_TOKEN_LIMIT_PER_OPENAI_INPUT_REQUEST = 3500;

export const MAX_CHARACTER_LIMIT_PER_OPENAI_INPUT_REQUEST = 18750;

export const MIN_CHARS_FOR_SUMMARY = 500;

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openaiClient = new OpenAIApi(configuration);

/* Splits array of tokens into array of token arrays each with a max length */
export const partitionArray = (tokens_array, size) => {
  return Array.from(new Array(Math.ceil(tokens_array.length / size)), (_, i) =>
    tokens_array.slice(i * size, i * size + size),
  );
};

/* Splits article text into multiple strings based on GPT3 token constraint */
export const splitArticleTokens = (article_extract: string) => {
  const encoded = encode(article_extract);
  const groups = partitionArray(
    encoded,
    MAX_TOKEN_LIMIT_PER_OPENAI_INPUT_REQUEST,
  );
  const decoded = groups.map((_, i) => decode(_));
  return decoded;
};

/* Get a one-line title given some text */
export const generateTitle = async (text: string, openaiClient) => {
  const shorter_text = text.length > 500 ? text.slice(0, 500) : text;
  console.log(shorter_text);

  const response = await openaiClient
    .createCompletion({
      model: 'text-davinci-003',
      prompt: `${shorter_text}\n\nGive me a title that summarizes this text`,
      temperature: 0.7,
      max_tokens: 50,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    })
    .then((res) => res.data.choices[0].text)
    .catch((e) => {
      throw new Error(e);
    });

  return response.trim();
};

/* For small articles, send one API request */
export const sendOneRequest = async (text: string, openaiClient) => {
  // const response = await openaiClient
  //   .createCompletion({
  //     model: 'text-davinci-003', //gpt-3.5-turbo	or text-davinci-003
  //     prompt: `${text}\n\nTl;dr`,
  //     temperature: 0.7,
  //     max_tokens: 500,
  //     top_p: 1.0,
  //     frequency_penalty: 0.0,
  //     presence_penalty: 1,
  //   })
  //   .then((res) => {
  //     console.log(res)
  //     return res
  //   })
  //   .then((res) => res.data.choices[0].text)
  //   .catch((e) => {
  //     throw new Error(e);
  //   });
  const response = await openaiClient
    .createChatCompletion({
      model: 'gpt-3.5-turbo', //gpt-3.5-turbo	or text-davinci-003
      //prompt: `${text}\n\nTl;dr`,
      messages: [{ role: "user", content: `"${text}"\n\nTl;dr` }],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    })
    .then((res) => res.data.choices[0].message.content)
    .catch((e) => {
      throw new Error(e);
    });
  return response;
};

/* Send a custom prompt to chat-gpt */
export const sendPrompt = async (prompt: string, openaiClient) => {
  const response = await openaiClient
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    })
    .then((res) => res.data.choices[0].message.content)
    .catch((e) => {
      throw new Error(e);
    });
  return response;
};

/* For large articles, send multiple API requests -> combine results -> send a final summary request */
export const sendMultipleRequests = async (
  text_splits: Array<string>,
  openaiClient,
) => {
  const promises = text_splits.map(async (text) => {
    const response = await openaiClient.createCompletion({
      model: 'text-davinci-003',
      prompt: `${text}\n\nTl;dr`,
      temperature: 0.7,
      max_tokens: 300,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    });
    return response.data;
  });

  const openai_summaries = await Promise.all(promises);
  const text_only = openai_summaries.map((_, i) => _.choices[0].text);
  const final_text_input_for_openai = text_only.join('');
  const final_summary = await openaiClient
    .createCompletion({
      model: 'text-davinci-003',
      prompt: `${final_text_input_for_openai}\n\nTl;dr`,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    })
    .then((res) => res.data.choices[0].text)
    .catch((e) => {
      throw new Error(e);
    });
  return final_summary;
};

/* For large articles, send multiple API requests -> combine results -> send multiple requests -> combine results -> send a final summary request */
export const sendMultipleRequestsExtraLargeScenario = async (
  text_splits: Array<string>,
  openaiClient,
) => {
  const promises = text_splits.map(async (text) => {
    const response = await openaiClient.createCompletion({
      model: 'text-davinci-003',
      prompt: `${text}\n\nTl;dr`,
      temperature: 0.7,
      max_tokens: 300,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    });
    return response.data;
  });

  const openai_summaries = await Promise.all(promises);
  const text_only = openai_summaries.map((_, i) => _.choices[0].text);

  // join text array in mods of 5
  const perChunk = 5; // items per chunk
  const round_two_summary_text_splits = text_only.reduce(
    (resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    },
    [],
  );
  // re-use above logic
  const round_two_summaries = round_two_summary_text_splits.map(
    async (text) => {
      const response = await openaiClient.createCompletion({
        model: 'text-davinci-003',
        prompt: `${text}\n\nTl;dr`,
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 1,
      });
      return response.data;
    },
  );
  const completed_round_two_summaries = await Promise.all(round_two_summaries);
  const completed_round_two_summaries_text_only =
    completed_round_two_summaries.map((_, i) => _.choices[0].text);
  const cleaned_completed_round_two_summaries_text_only =
    completed_round_two_summaries_text_only.map((_, i) => {
      const step_one = removePartialSentence(_);
      const step_two = cleanSummary(step_one);
      return step_two;
    });

  const final_summary =
    cleaned_completed_round_two_summaries_text_only.join('\n\t');

  return final_summary;
};

/* Remove partial sentence at end (if it exists) */
export const removePartialSentence = (text: string) => {
  const cleaned_text = text.slice(0, text.lastIndexOf('.') + 1);
  return cleaned_text;
};

/* Clean summary */
export const cleanSummary = (text: string) => {
  let cleaned_text = text.replace(/[\r\n]/gm, '');
  if (text.startsWith(': ')) {
    cleaned_text = text.slice(2);
  } else if (text.startsWith(':')) {
    cleaned_text = text.slice(1);
  } else if (text.startsWith(' - ')) {
    cleaned_text = text.slice(3);
  }
  return cleaned_text;
};

/* Get bullet points from short text from openai */
export const sendOneRequestForBulletPoints = async (
  text: string,
  openaiClient,
) => {
  const response = await openaiClient
    .createCompletion({
      model: 'text-davinci-003',
      prompt: `${text}\n\ngive me the main bullet points of the above text.`,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    })
    .then((res) => res.data.choices[0].text)
    .catch((e) => {
      throw new Error(e);
    });
  return response;
};

/* Get bullet points from long text from openai */
export const sendMultipleRequestsAndGetBulletPoints = async (
  text_splits: Array<string>,
  openaiClient,
) => {
  const promises = text_splits.map(async (text) => {
    const response = await openaiClient.createCompletion({
      model: 'text-davinci-003',
      prompt: `give me the bullet points of this article. \n\n Text: ''' ${text} ''' `,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    });
    return response.data;
  });
  const openai_summaries = await Promise.all(promises);
  let text_only = openai_summaries.map((_, i) => _.choices[0].text);
  text_only = text_only.map((_, i) => normalizeBullets(_));
  text_only = text_only.map((_, i) => drop_last_bullet(_));
  const final = text_only.join('\n');
  return final;
};

/* Standardize the bullet point output format from openai */
export const normalizeBullets = (text_with_bullets: any) => {
  const search = '\n- ';
  const searchOne = '\n-';
  const ntemp = '\n***';
  const searchTwo = 'Bullet Points:';
  const searchThree = '• ';
  const searchFour = ' • ';
  const searchFive = '•';
  const searchSix = 'Key Points:';
  const temp = '***';
  const perm = ' \u2022 ';
  let result = text_with_bullets.replaceAll(search, ntemp);
  result = result.replaceAll(searchOne, ntemp);
  result = result.replaceAll(searchThree, temp);
  result = result.replaceAll(searchFour, temp);
  result = result.replaceAll(searchFive, temp);
  result = result.replaceAll(searchTwo, '');
  result = result.replaceAll(searchSix, '');
  result = result.replaceAll(temp, perm);
  result = result.trim();
  return result;
};

/* Drops the last bullet point from openai because sometimes its partially complete */
export const drop_last_bullet = (text_with_bullets: any) => {
  const result = text_with_bullets.substring(
    0,
    text_with_bullets.lastIndexOf('• '),
  );
  return result.trim();
};
