import Base from "../base";
import { ISearchParams } from "../types";
import Login from "./login";
import JobSearch from "./jobSearch";

export default class Seek extends Base {
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
    await new Login({
      page: this.page,
      username: this.username,
      password: this.password,
    }).run();

    const jobLists = await new JobSearch({
      page: this.page,
      position: this.position,
      location: this.location,
      titleIncludes: this.titleIncludes,
      ignores: this.ignores,
      pages: this.pages,
    }).search();
    // write jobs to csv file
    this.saveJobs('seek', jobLists);

    await this.browserClose();
  }
}

