import setEnv from './setEnv';
import Linkedin from './linkedin';
import Seek from './seek';
import { ISearchParams, LinkedinSearchTimeFilter, OptionalSearchParams, SeekSearchTimeFilter } from './types';
import { mergeOptions, createJobsDataDir } from './utils';
class Start {
  promiseChain: Promise<void>;

  constructor() {
    this.promiseChain = Promise.resolve();
  }

  run() {
    // set environment variables
    this.promiseChain = this.promiseChain.then(async () => {
      createJobsDataDir();
      await setEnv();
    });
    return this;
  }

  // start the scraper to search in seek
  seak(opts: OptionalSearchParams<ISearchParams<SeekSearchTimeFilter>>) {
    this.promiseChain = this.promiseChain.then(async () => {
      const seekOptions = mergeOptions<SeekSearchTimeFilter>({
        username: process.env.SEEK_EMAIL!,
        password: process.env.SEEK_PASSWORD!,
        ...opts
      });
      await new Seek(seekOptions).run();
    });
    return this;
  }

  // start the scraper to search in linkedin
  linkedin(opts: OptionalSearchParams<ISearchParams<LinkedinSearchTimeFilter>>) {
    this.promiseChain = this.promiseChain.then(async () => {
      const linkedinOptions = mergeOptions<LinkedinSearchTimeFilter>({
        username: process.env.LINKEDIN_EMAIL!,
        password: process.env.LINKEDIN_PASSWORD!,
        ...opts
      });
      await new Linkedin(linkedinOptions).run();
    });
    return this;
  }
}

export default new Start().run();