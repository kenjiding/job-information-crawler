import fs from 'fs';
import path from 'path';

import { ISearchParams, OptionalSearchParams } from './types';

export const wait = async (times = 1000) => await new Promise(resolve => setTimeout(resolve, times));


export function mergeOptions<T>(opts: OptionalSearchParams<ISearchParams<T>>) {
  return {
    username: process.env.SEEK_EMAIL!,
    password: process.env.SEEK_PASSWORD!,
    ...opts,
  } as ISearchParams<T>;
}


export function createJobsDataDir() {
  // 获取当前根目录
  const rootDir = path.resolve(__dirname, '..');
    const jobsDataDir = path.join(rootDir, 'jobsData');

  // 检查目录是否存在，如果不存在则创建它
  if (!fs.existsSync(jobsDataDir)) {
    fs.mkdirSync(jobsDataDir);
  }
}
