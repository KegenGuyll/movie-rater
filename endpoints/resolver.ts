import { AxiosRequestConfig, AxiosResponse } from "axios";

import fetch from "../utils/fetch";

interface IResolve {
  res: AxiosResponse | null;
  err: Error | null;
}

export default async function resolve(
  config: AxiosRequestConfig,
  internalURL = false
): Promise<IResolve> {
  const resolved = {
    err: null,
    res: null,
  } as any;

  try {
    const res = await fetch(config, internalURL);

    resolved.res = res;
  } catch (err) {
    resolved.err = err;
  }

  return resolved;
}
