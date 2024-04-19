import puppeteer, { Browser, Page } from 'puppeteer';
import { createObjectCsvWriter } from 'csv-writer';
import dayjs from 'dayjs';
import { ISearchParams, ISearchResult } from './types';
import path from 'path';
import { getEmailTemplate } from './template';
import { sendEmail } from './email';

const filePath = (filename: string) => path.join(__dirname, '..', 'jobsData', filename); // 假设 'a.txt' 在项目根目录
export default class Base implements ISearchParams {
  browser!: Browser;
  page!: Page;
  private csvWriter!: any;
  protected tempJobsData: ISearchResult[] = [];

  username;
  password;
  keywords;
  location;
  titleIncludes;
  ignores;
  pages;
  filename;
  filter;
  enableSendEmail;

  constructor({
    username,
    password,
    enableSendEmail,
    keywords = '',
    location = '',
    filename = 'default',
    titleIncludes = '',
    ignores = [],
    filter = {},
    pages = 10,
  }: ISearchParams) {
    this.username = username;
    this.password = password;
    this.keywords = keywords;
    this.location = location;
    this.filename = filename;
    this.enableSendEmail = enableSendEmail;
    this.titleIncludes = titleIncludes;
    this.ignores = ignores;
    this.pages = pages;
    this.filter = filter;
    this.creatCsvWriter();
  }

  creatCsvWriter() {
    const date = dayjs().format('YYYY-MM-DD HH:mm');
    this.csvWriter = createObjectCsvWriter({
      path: filePath(`${this.filename}_${date}.csv`),
      append: true,
      header: [
        {id: 'jobTitle', title: 'Job Title'},
        {id: 'companyName', title: 'Company Name'},
        {id: 'jobLocation', title: 'Job Location'},
        {id: 'jobInfo', title: 'job info'},
        {id: 'componyInfo', title: 'compony info'},
        {id: 'jobUrl', title: 'job apply url'},
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
    // check params
    await this.checkParams();
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--start-maximized', '--disable-web-security'] }
    );
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

  sendJobsEmail({ subject }: { subject: string }) {
    const html = getEmailTemplate({
      data: this.tempJobsData,
      subject
    });
    sendEmail({
      html,
      subject,
      to: 'kenjiding807@gmail.com',
    });
  }
}
