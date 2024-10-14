import Base from '../base';
import { ISearchParams, SeekSearchTimeFilter } from '../types';
import Login from './login';
import JobSearch from './jobSearch';

export default class Seek extends Base<SeekSearchTimeFilter> {
  constructor({
    username,
    password,
    keywords,
    location,
    filename = 'seek',
    titleIncludes,
    ignores,
    enableSendEmail,
    filterAlreadyApply,
    filter,
    pages = 10,
  }: ISearchParams<SeekSearchTimeFilter>) {
    super({
      username,
      password,
      keywords,
      location,
      titleIncludes,
      enableSendEmail,
      ignores,
      filename,
      filterAlreadyApply,
      filter,
      pages
    });
  }

  async run(cb?: (res: any) => void) {
    await this.start();
    await new Login({
      page: this.page,
      username: this.username,
      password: this.password,
    }).run();

    await new JobSearch({
      page: this.page,
      keywords: this.keywords,
      location: this.location,
      titleIncludes: this.titleIncludes,
      ignores: this.ignores,
      filter: this.filter,
      pages: this.pages,
      filterAlreadyApply: this.filterAlreadyApply,
    }).search((res) => {
      cb && cb(res);
      this.tempJobsData.push(...res);
      // write jobs to csv file
      this.saveJobs(res);
    });

    this.enableSendEmail && this.sendJobsEmail({ subject: 'Seek Jobs' });

    await this.browserClose();
  }
}

