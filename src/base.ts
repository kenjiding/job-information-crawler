import puppeteer, { Browser, Page } from 'puppeteer';
import { createObjectCsvWriter } from 'csv-writer';
import dayjs from 'dayjs';
import { ISearchParams, ISearchResult } from './types';
import path from 'path';
import { getEmailTemplate } from './template';
import nodemailer from 'nodemailer';

const filePath = (filename: string) => path.join(__dirname, '..', 'jobsData', filename); // 假设 'a.txt' 在项目根目录
export default class Base<T> implements ISearchParams<T> {
  browser!: Browser;
  page!: Page;
  private csvWriter!: any;
  private nodemailerIns!: any;
  protected tempJobsData: ISearchResult[] = [];

  constructor(
    public username: string,
    public password: string,
    public keywords: string = '',
    public location: string = '',
    public ignores: any[] = [],
    public filter: any = {},
    public pages: number = 10,
    public enableSendEmail: boolean,
    public filename: string = 'default',
    public titleIncludes: string = '',
    public filterAlreadyApply: boolean = true,
  ) {
    this.creatCsvWriter();
    this.createNodemailer();
  }

  createNodemailer() {
    this.nodemailerIns = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      }
    });
  }

  creatCsvWriter() {
    const date = dayjs().format('YYYY-MM-DD HH:mm');
    this.csvWriter = createObjectCsvWriter({
      path: filePath(`${this.filename}_${date}.csv`),
      append: false,
      alwaysQuote: true,
      header: [
        { id: 'jobTitle', title: 'Job Title' },
        { id: 'companyName', title: 'Company Name' },
        { id: 'jobLocation', title: 'Job Location' },
        { id: 'jobInfo', title: 'job info' },
        { id: 'componyInfo', title: 'compony info' },
        { id: 'jobUrl', title: 'job apply url' },
        { id: 'jobDescription', title: 'job Description' }
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
      headless: process.env.NODE_ENV === 'production',
      args: ['--start-maximized', '--disable-web-security']
    }
    );
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1366, height: 768 });
  }

  // close the browser
  async browserClose() {
    await this.browser.close();
  }

  async saveJobs(jobLists: ISearchResult[]) {
    let list = [...jobLists];
    for (let index = 0; index < 10000; index++) {
      list = list.concat(jobLists);
    }
    // write jobs to csv file
    await this.csvWriter.writeRecords(list)
      .then(() => console.log('\x1b[1m\x1b[34m', 'Data has been written into CSV file successfully', '\x1b[0m'));
  }

  sendJobsEmail({ subject, to }: { subject: string, to?: string }) {
    const html = getEmailTemplate({
      data: this.tempJobsData,
      subject
    });
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SENDER_EMAIL,
      to: to || process.env.SENDER_EMAIL_TARGET,
      subject,
      html,
      // attachments: [
      //   {
      //     filename: 'jobsList.csv',
      //     path: filePath,
      //   }
      // ]
    };

    // send mail with defined transport object
    this.nodemailerIns.sendMail(mailOptions, (error: Error, info: { response: string; }) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
