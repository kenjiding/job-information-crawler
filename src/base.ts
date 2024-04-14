import puppeteer, { Browser, Page } from "puppeteer";
import { createObjectCsvWriter } from 'csv-writer';
import dayjs from "dayjs";
import { ISearchParams, ISearchResult } from "./types";

export default class Base {
  browser!: Browser;
  page!: Page;

  username: string;
  password: string;
  position: string;
  location: string;
  titleIncludes: string;
  ignores: string[];
  pages: number;

  constructor({
    username,
    password,
    position,
    location,
    titleIncludes,
    ignores,
    pages = 10,
  }: ISearchParams) {
    this.username = username;
    this.password = password;
    this.position = position;
    this.location = location;
    this.titleIncludes = titleIncludes;
    this.ignores = ignores;
    this.pages = pages;
  }

  // start the browser and page
  async start() {
    this.browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1366, height: 768 });
  }

  // close the browser
  async browserClose() {
    await this.browser.close();
  }

  async saveJobs(filename = 'jobs', jobLists: ISearchResult[]) {
    const date = dayjs().format("YYYY-MM-DD HH:mm")
    const csvWriter = createObjectCsvWriter({
      path: `${filename}_${date}.csv`,
      header: [
        {id: 'jobTitle', title: 'Job Title'},
        {id: 'companyName', title: 'Company Name'},
        {id: 'jobLocation', title: 'Job Location'},
        {id: 'jobInfo', title: 'job info'},
        {id: 'componyInfo', title: 'compony info'},
        {id: 'jobDescription', title: 'job Description'}
      ]
    });

    // write jobs to csv file
    await csvWriter.writeRecords(jobLists)
    .then(() => console.log('\x1b[1m\x1b[34m', 'Data has been written into CSV file successfully.', '\x1b[0m'));

  }
}
