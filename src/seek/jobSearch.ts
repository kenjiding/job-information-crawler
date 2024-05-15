import { wait } from '../utils';
import { ISearchParams, ISearchResult, ISearchResultCallback } from '../types';
import { Page } from 'puppeteer';

type IJobSearch = Pick<ISearchParams, 'keywords' | 'location' | 'pages' | 'titleIncludes' | 'ignores'>;

class JobSearch {
  page: Page;
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
    const articles = await this.page.$$('article[data-testid="job-card"]');
    const length = articles.length;
    const results: ISearchResult[] = [];
    let nums = 0;
    while (length > 0 && nums < length) {
      await articles[nums++].click(),
      await this.page.waitForSelector('h1[data-automation="job-detail-title"]');
      const details: ISearchResult | null = await this.page.evaluate((titleIncludes: string, ignores: string[]) => {
        const jobTitle = (document.querySelector('h1[data-automation="job-detail-title"]') as HTMLElement)?.innerText;
        console.log('jobTitle: ', jobTitle);
        const jobLocation = (document.querySelector('span[data-automation="job-detail-location"]') as HTMLElement)?.innerText;
        const jobInfo = (document.querySelector('span[data-automation="job-detail-salary"]') as HTMLElement)?.innerText;
        const jobType = (document.querySelector('span[data-automation="job-detail-work-type"]') as HTMLElement)?.innerText;
        const companyName = (document.querySelector('span[data-automation="advertiser-name"]') as HTMLElement)?.innerText;
        const jobDescription = (document.querySelector('div[data-automation="jobAdDetails"]') as HTMLElement)?.innerText;
        
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

        if (titleIncludes) {
          if (new RegExp(titleIncludes, 'gi').test(jobTitle)) return data;
          return null;
        } else {
          return data;
        }
      }, this.titleIncludes, this.ignores);
      details && results.push({ ...details, jobUrl: this.page.url()});
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
