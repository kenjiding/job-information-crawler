import { Page } from 'puppeteer';
import fs from 'fs';

// cookie path
const COOKIES_PATH = 'linkedin_cookies.json';
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
    // check cookies are exist, and go to index page immediately
    if (fs.existsSync(COOKIES_PATH)) {
      const cookiesString = fs.readFileSync(COOKIES_PATH).toString();
      const cookies = JSON.parse(cookiesString);
      for (const cookie of cookies) {
        await this.page.setCookie(cookie);
      }
      await this.page.goto('https://www.linkedin.com');
      const isLoginPage = await this.page.evaluate(() => document.title.includes('Sign In'));
      if (isLoginPage) {
        // if cookies are expired, perform login
        await this.login();
      }
    } else {
      // if cookies are not exist, perform login
      await this.login();
    }
  }

  async login() {
    // login LinkedIn
    await this.page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
    await this.page.type('input[name="session_key"]', this.username);
    await this.page.type('input[name="session_password"]', this.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForNavigation({ waitUntil: 'load' });
    // save cookies again
    const cookies = await this.page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
  }
}

export default Login;