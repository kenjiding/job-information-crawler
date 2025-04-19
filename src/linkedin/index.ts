import Login from './login';
import JobSearch from './jobSearch';
import { ISearchParams, LinkedinSearchTimeFilter } from '../types';
import Base from '../base';
export default class LinkedinSearch extends Base<LinkedinSearchTimeFilter> {
  constructor({
    username,
    password,
    keywords,
    location,
    titleIncludes,
    ignores,
    filter,
    enableSendEmail = false,
    filename = 'linkdidn',
    pages = 10,
    filterAlreadyApply,
  }: ISearchParams<LinkedinSearchTimeFilter>) {
    super(
      username,
      password,
      keywords,
      location,
      ignores,
      filter,
      pages,
      enableSendEmail,
      filename,
      titleIncludes,
      filterAlreadyApply,
    );
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
      filter: this.filter,
    }).search((res) => {
      this.tempJobsData.push(...res);
      // write jobs to csv file
      this.saveJobs(res);
    });

    this.enableSendEmail && this.sendJobsEmail({ subject: 'LinkedIn Jobs' });

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

