import { wait } from '../utils';
import { ISearchParams, ISearchResult, ISearchResultCallback } from '../types';
import { Page } from 'puppeteer';

type IJobSearch = Pick<ISearchParams, 'keywords' | 'location' | 'pages' | 'titleIncludes' | 'ignores'>;

class JobSearch {
  page: any;
  keywords: string;
  location: string;
  titleIncludes: string;
  ignores: string[];
  pages: number;

  constructor({
    page,
    keywords,
    location,
    titleIncludes,
    ignores,
    pages
  }: IJobSearch & { page: Page }) {
    this.page = page;
    this.keywords = keywords;
    this.location = location;
    this.titleIncludes = titleIncludes || '';
    this.ignores = ignores || [];
    this.pages = pages || 1;
  }

  // grabJobInfo function to get the job details
  async grabJobInfo(): Promise<ISearchResult[]> {
    await this.page.waitForSelector('div[data-automation="searchResults"]', { visible: true });
    const articles = await this.page.$$(`a[data-automation="jobTitle"]`);
    const length = articles.length;
    const results: ISearchResult[] = [];
    let nums = 0;
    while (nums < length) {
      const articles = await this.page.$$(`a[data-automation="jobTitle"]`);
      if (articles.length === 0) break;
      const article = articles[nums++];
      await Promise.all([
        article.click(),
        this.page.waitForNavigation({ waitUntil: 'networkidle0' })
      ]);
      const details: ISearchResult | null = await this.page.evaluate((titleIncludes: string, ignores: string[]) => {
        const jobTitle = (document.querySelector(`h1[data-automation="job-detail-title"]`) as HTMLElement)?.innerText;
        const jobLocation = (document.querySelector(`span[data-automation="job-detail-location"]`) as HTMLElement)?.innerText;
        const jobInfo = (document.querySelector(`span[data-automation="job-detail-salary"]`) as HTMLElement)?.innerText;
        const jobType = (document.querySelector(`span[data-automation="job-detail-work-type"]`) as HTMLElement)?.innerText;
        const companyName = (document.querySelector(`span[data-automation="advertiser-name"]`) as HTMLElement)?.innerText;
        const jobDescription = (document.querySelector(`div[data-automation="jobAdDetails"]`) as HTMLElement)?.innerText;
        
        if (ignores.length > 0) {
          const regex = new RegExp(ignores.join('|'), 'gi');
          // if the job description contains any of the ignore words, skip this job
          const skipThisJob = regex.test(jobDescription);
          if (skipThisJob) return null;
        }

        const data = {
          jobTitle,
          jobLocation,
          companyName,
          jobInfo: `${jobType}-${jobInfo}`,
          jobDescription,
          jobUrl: window.location.href,
          componyInfo: ''
        };
        console.log('data: ', data);

        if (titleIncludes) {
          if (new RegExp(titleIncludes, 'gi').test(jobTitle)) return data;
        } else {
          return data;
        }
      }, this.titleIncludes, this.ignores);
      details && results.push({ ...details, jobUrl: this.page.url()});
      await this.page.goBack();
      await this.page.waitForSelector('div[data-automation="searchResults"]', { visible: true });
    }

    return results;
  }

  // search function to get the first page of job list
  async search(cb: ISearchResultCallback): Promise<void> {
    await this.page.type('#keywords-input', this.keywords);
    await wait();
    await this.page.type('#SearchBar__Where', this.location);
    await this.page.click('button[type="submit"]');
    await this.nextpage(cb);
  }

  // nextpage function to get all the job details
  async nextpage(cb: ISearchResultCallback) {
    let curPage = 1;
    while(curPage <= this.pages) {
      const res = await this.grabJobInfo();
      cb && cb(res);
      const nextLink = await this.page.$('a[title="Next"][aria-label="Next"]');
      if (!nextLink) break;
      await nextLink.click();
      await wait(1000);
      curPage++;
    }
  }
}

export default JobSearch;
