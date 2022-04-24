import { AxiosResponse } from "axios";

import { MovieDocument } from "../../models/firestore";
import resolve from "../resolver";

interface IResponse extends AxiosResponse {
  data: {
    _id: string;
    email: string;
    uiid: string;
    backdropPath?: string;
    following: string[];
    followingReviews: MovieDocument[];
  };
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function followerFeed(
  authToken: string,
  limit: number
): Promise<IResolvedPopular> {
  return resolve(
    {
      headers: {
        Authorization: authToken,
      },
      method: "GET",
      url: `/user/follow/feed?limit=${limit}`,
    },
    true
  );
}
