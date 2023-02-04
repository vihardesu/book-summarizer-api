const axios = require('axios').default;
const h2p = require('html2plaintext');

export const embedlyFetch = async (url: string): Promise<string> => {
  const embedly_url = `https://api.embedly.com/1/extract?key=${process.env.EMBEDLY_API_KEY}&url=${url}`;
  const options = { headers: { accept: 'application/json' } };
  const content = await axios(embedly_url, options)
    .then((response) => h2p(response.data.content))
    .catch((err) => {
      throw new Error(err);
    });
  return content;
};
