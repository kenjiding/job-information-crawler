import { Page } from "puppeteer";


class Login {
  page: any;
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
    await this.page.goto('https://www.seek.com.au/login', { waitUntil: 'networkidle2' });
    await this.page.type('#emailAddress', this.username);
    await this.page.type('#password', this.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
  }
}

export default Login;