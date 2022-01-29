import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const { q } = req.query;
      const response = await axios.get(
        `https://www.themoviedb.org/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${q}`
      );

      res.status(200).send(response.data);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
