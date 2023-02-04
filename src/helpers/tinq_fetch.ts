const axios = require('axios').default;

export const setTinqBody = (url: string) => {
  return new URLSearchParams({ extract_url: url });
};

export const setTinqHeaders = () => {
  return {
    headers: {
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      authorization: `Bearer ${process.env.TINQ_API_KEY}`,
      'Accept-Encoding': 'gzip,deflate,compress',
    },
  };
};

export const tinqFetch = async (url: string): Promise<string> => {
  const body = new URLSearchParams({ extract_url: url });
  const headers = setTinqHeaders();
  const response = await axios
    .post('https://tinq.ai/api/v1/extract-article', body, headers)
    .then((res) => res.data.article.article)
    .catch((e) => {
      throw new Error(e);
    });
  return response;
};

export const getTitleFromTinq = async (url: string): Promise<any> => {
  const body = new URLSearchParams({ extract_url: url });
  const headers = setTinqHeaders();
  const response = await axios
    .post('https://tinq.ai/api/v1/extract-article', body, headers)
    .then((res) => res.data.article.title)
    .catch((e) => {
      throw new Error(e);
    });
  return response;
};

export default setTinqBody;
