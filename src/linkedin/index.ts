import Login from './login';
import JobSearch from './jobSearch';
import { ISearchParams, ISearchResult } from '../types';
import Base from '../base';

export default class LinkedinSearch extends Base {
  constructor({
    username,
    password,
    keywords,
    location,
    titleIncludes,
    ignores,
    filename = 'linkdidn',
    pages = 10,
  }: ISearchParams) {
    super({
      username,
      password,
      keywords,
      location,
      titleIncludes,
      ignores,
      filename,
      pages
    });
  }

  async run() {
    await this.start();
    await this.eventListener();
    // login to linkedin
    await new Login({
      page: this.page,
      username: this.username,
      password: this.password,
    }).run();
    // search for jobs
    await new JobSearch({
      page: this.page,
      keywords: this.keywords,
      location: this.location,
      pages: this.pages,
      titleIncludes: this.titleIncludes,
      ignores: this.ignores,
    }).search((res: ISearchResult[]) => {
      // write jobs to csv file
      this.saveJobs(res);
    });


    // close browser
    await this.browserClose();
  }

  async eventListener() {
    this.browser.on('targetcreated', async (target) => {
      if (target.type() === 'page') {
        const newPage = await target.page();
        if (!newPage) return;
        await newPage.waitForNavigation({ waitUntil: 'domcontentloaded' });
        console.log('New page URL:', await newPage.url());
      }
    });
  }
}

