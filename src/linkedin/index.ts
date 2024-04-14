import Login from './login';
import JobSearch from './jobSearch';
import { ISearchParams } from '../types';
import Base from '../base';

export default class LinkedinSearch extends Base {
  constructor({
    username,
    password,
    position,
    location,
    titleIncludes,
    ignores,
    pages = 10,
  }: ISearchParams) {
    super({
      username,
      password,
      position,
      location,
      titleIncludes,
      ignores,
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
    const jobLists = await new JobSearch({
      page: this.page,
      position: this.position,
      location: this.location,
      pages: this.pages,
      titleIncludes: this.titleIncludes,
      ignores: this.ignores,
    }).search();

    // write jobs to csv file
    this.saveJobs('linkedin', jobLists);

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

