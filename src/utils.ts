import { ISearchParams, OptionalSearchParams } from './types';


export const wait = async (times = 1000) => await new Promise(resolve => setTimeout(resolve, times));


export function mergeOptions(opts: OptionalSearchParams<ISearchParams>) {
  return {
    username: process.env.SEEK_EMAIL!,
    password: process.env.SEEK_PASSWORD!,
    ...opts,
  } as ISearchParams;
}

