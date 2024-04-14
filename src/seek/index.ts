import Base from "../base";
import { ISearchParams } from "../types";
import Login from "./login";
import JobSearch from "./jobSearch";

export default class Seek extends Base {
  constructor({
    username,
    password,
    keywords,
    location,
    filename = 'seek',
    titleIncludes,
    ignores,
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
      pages: this.pages,
    }).search((data) => {
      // write jobs to csv file
      this.saveJobs(data);
    });

    await this.browserClose();
  }
}

