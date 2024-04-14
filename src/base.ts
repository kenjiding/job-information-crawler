import puppeteer, { Browser, Page } from "puppeteer";
import { createObjectCsvWriter } from 'csv-writer';
import dayjs from "dayjs";
import { ISearchParams, ISearchResult } from "./types";

export default class Base {
  browser!: Browser;
  page!: Page;
  private csvWriter!: any;

  username: string;
  password: string;
  keywords: string;
  location: string;
  titleIncludes: string;
  ignores: string[];
  pages: number;
  filename: string;

  constructor({
    username,
    password,
    keywords,
    location,
    filename,
    titleIncludes,
    ignores,
    pages = 10,
  }: ISearchParams) {
    this.username = username;
    this.password = password;
    this.keywords = keywords;
    this.location = location;
    this.filename = filename || '';
    this.titleIncludes = titleIncludes || '';
    this.ignores = ignores || [];
    this.pages = pages || 1;
    this.creatCsvWriter();
  }

  creatCsvWriter() {
    const date = dayjs().format("YYYY-MM-DD HH:mm")
    this.csvWriter = createObjectCsvWriter({
      path: `${this.filename}_${date}.csv`,
      append: true,
      header: [
        {id: 'jobTitle', title: 'Job Title'},
        {id: 'companyName', title: 'Company Name'},
        {id: 'jobLocation', title: 'Job Location'},
        {id: 'jobInfo', title: 'job info'},
        {id: 'componyInfo', title: 'compony info'},
        {id: 'jobDescription', title: 'job Description'}
      ]
    });
  }

  async checkParams() {
    if (!this.username) {
      throw new Error('Linkedin / Seek username is required');
    }
    if (!this.password) {
      throw new Error('Linkedin / Seek password is required');
    }
  }

  // start the browser and page
  async start() {
    await this.checkParams();
    this.browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1366, height: 768 });
  }

  // close the browser
  async browserClose() {
    await this.browser.close();
  }

  async saveJobs(jobLists: ISearchResult[]) {
    // write jobs to csv file
    await this.csvWriter.writeRecords(jobLists)
    .then(() => console.log('\x1b[1m\x1b[34m', 'Data has been written into CSV file successfully.', '\x1b[0m'));

  }
}
