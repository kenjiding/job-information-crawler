import setEnv from './setEnv';
import Linkedin from './linkedin';
import Seek from './seek';
import { ISearchParams, OptionalSearchParams } from './types';
import { mergeOptions } from './utils';
class Start {
  promiseChain: Promise<any>;

  constructor() {
    this.promiseChain = Promise.resolve();
  }

  run() {
    // set environment variables
    this.promiseChain = this.promiseChain.then(async () => {
      await setEnv();
    });
    return this;
  }

  // start the scraper to search in seek
  seak(opts: OptionalSearchParams<ISearchParams>) {
    this.promiseChain = this.promiseChain.then(async () => {
      const seekOptions = mergeOptions(opts);
      await new Seek(seekOptions).run();
    });
    return this;
  }

  // start the scraper to search in linkedin
  linkedin(opts: OptionalSearchParams<ISearchParams>) {
    this.promiseChain = this.promiseChain.then(async () => {
      const linkedinOptions = mergeOptions(opts);
      await new Linkedin(linkedinOptions).run();
    });
    return this;
  }
}

export default new Start().run();