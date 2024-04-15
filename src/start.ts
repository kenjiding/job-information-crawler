import setEnv from './setEnv';
import Linkedin from './linkedin';
import Seek from './seek';
import { ValidOptions, ISearchParams } from './types';

export default async function start(options: ValidOptions) {
  // set environment variables
  await setEnv();

  // start the scraper to search in seek
  if (options.seek) {
    const seekOptions = {
      username: process.env.SEEK_EMAIL!,
      password: process.env.SEEK_PASSWORD!,
      ...options.seek,
    } as ISearchParams;
    await new Seek(seekOptions).run();
  }

  if (options.linkedin) {
    const linkedinOptions = {
      username: process.env.LINKEDIN_EMAIL!,
      password: process.env.LINKEDIN_PASSWORD!,
      ...options.seek,
    } as ISearchParams;
    // start the scraper to search in linkedin
    await new Linkedin(linkedinOptions).run();
  }
}
