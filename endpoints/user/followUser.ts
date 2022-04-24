import { AxiosResponse } from "axios";

import resolve from "../resolver";

interface IResponse extends AxiosResponse {}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function followUser(
  uid: string,
  authToken: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      headers: {
        Authorization: authToken,
      },
      method: "POST",
      url: `/user/follow/${uid}`,
    },
    true
  );
}
