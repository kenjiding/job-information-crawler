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
    // login LinkedIn
    await this.page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
    await this.page.type('input[name="session_key"]', this.username);
    await this.page.type('input[name="session_password"]', this.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForNavigation({ waitUntil: 'load' });
  }
}

export default Login;