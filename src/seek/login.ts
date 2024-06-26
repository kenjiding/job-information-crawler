import { Page } from 'puppeteer';
import fs from 'fs';

// cookie path
const COOKIES_PATH = 'seek_cookies.json';
const STORAGE_PATH = 'seek_storage.json';
class Login {
  page: Page;
  username: string;
  password: string;
  constructor({
    page,
    username,
    password,
  }: {
    page: Page;
    username: string;
    password: string;
  }) {
    this.page = page;
    this.username = username;
    this.password = password;
  }

  async run() {
    await this.page.goto('https://www.seek.com.au');
    // check cookies are exist, and go to index page immediately
    if (fs.existsSync(COOKIES_PATH)) {
      const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf8'));
      for (const cookie of cookies) {
        await this.page.setCookie(cookie);
      }
    }
    // check localStorage are exist, and set them
    if (fs.existsSync(STORAGE_PATH)) {
      const localStorageData = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf8'));
      await this.page.evaluate((data) => {
        for (const key in data) {
          localStorage.setItem(key, data[key]);
        }
      }, localStorageData);
    }
    // reload page after set cookie and localStorage
    await this.page.reload({ waitUntil: 'load' });
    const isLoginPage = await this.page.$('a[data-automation="sign in"]');
    if (isLoginPage) {
      // if cookies are expired, perform login
      // await this.login();
    }
  }

  async login() {
    await this.page.goto('https://www.seek.com.au/login', { waitUntil: 'networkidle2' });
    await this.page.type('#emailAddress', this.username);
    await this.page.type('#password', this.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    await this.saveAuthData();
  }

  async saveAuthData() {
    // save cookies again
    const cookies = await this.page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));

    // save localStorage again
    const localStorageData = await this.page.evaluate(() => {
      const json: { [key: string]: string } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
          json[key] = localStorage.getItem(key) || '';
        }
      }
      return json;
    });
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(localStorageData, null, 2));
  }
}

export default Login;