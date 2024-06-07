import { wait } from '../utils';
import { ISearchParams, ISearchResultCallback, ISearchResult, LinkedinSearchTimeFilter } from '../types';
import { Page } from 'puppeteer';
import { TimeRangeMap } from './constant';

type IJobSearch = Pick<ISearchParams<LinkedinSearchTimeFilter>, 'keywords' | 'location' | 'pages' | 'titleIncludes' | 'ignores' | 'filter'>
& { page: Page, thereAreMore?: boolean };

class JobSearch implements IJobSearch {
  page;
  keywords;
  location;
  titleIncludes;
  ignores;
  pages;
  filter;
  thereAreMore = true;

  constructor({
    page,
    keywords,
    location,
    titleIncludes = '',
    ignores = [],
    filter,
    pages = 1
  }: IJobSearch & { page: Page }) {
    this.page = page;
    this.keywords = keywords;
    this.location = location;
    this.filter = filter || { timeRange: ''};
    this.titleIncludes = titleIncludes;
    this.ignores = ignores;
    this.pages = pages;
  }
  // game_children_challenge
  async search(cb: ISearchResultCallback) {
    await this.page.goto('https://www.linkedin.com/jobs/', { waitUntil: 'load' });
    await this.page.waitForSelector('input.jobs-search-box__text-input', { timeout: 1000000 });
    await this.page.type('input.jobs-search-box__text-input', this.keywords);
    await wait();
    await this.page.type('input.jobs-search-box__text-input[autocomplete="address-level2"]', this.location);
    await wait();
    await this.page.keyboard.press('Enter');
    await this.page.waitForSelector('#searchFilter_timePostedRange', { timeout: 10000 });
    await this.page.click('#searchFilter_timePostedRange');
    await wait();
    const timePostedElements = await this.page.$$('[id^="timePostedRange-"]');
    if (timePostedElements.length > 0 && this.filter?.timeRange) {
      await timePostedElements[TimeRangeMap[this.filter?.timeRange || '']].click();
      // 等待返回结果
      await wait(2000);
      const comfirmButtonWrapper = await this.page.$('.reusable-search-filters-buttons');
      const button = await comfirmButtonWrapper?.$('button[aria-live="polite"]');
      try {
        await button?.click();
      } catch (error) {
        console.warn('error: linkdin timePostedRange click failed');
      }
    }

    // search job result
    return await this.loadJobList(cb);
  }

  async loadJobList(cb: ISearchResultCallback): Promise<boolean> {
    let pageNum = 1;
    while (this.thereAreMore && pageNum <= this.pages) {
      try {
        // wait for the job list to load
        await wait(3000);
        // const oldContent = await this.page.evaluate(() => document.querySelector('.scaffold-layout__list-container')?.textContent);
        // await this.page.waitForFunction(
        //   oldContent => document.querySelector('.scaffold-layout__list-container')?.textContent !== oldContent,
        //   {},
        //   oldContent
        // );
        // get job list
        const jobs = await this.page.evaluate(async (titleIncludes: string, ignores: string[]) => {
          const listContainer = document.querySelector('.jobs-search-results-list');
          if (listContainer) listContainer.scrollTop = listContainer.scrollHeight;
          const jobElements = document.querySelectorAll('.jobs-search-results__list-item');
          const jobList: ISearchResult[] = [];
          for (let i = 0; i < jobElements.length; i++) {
            const job = jobElements[i];
            const jonDom = job.querySelector('.job-card-list__title strong') as HTMLElement;
            const jobTitle = jonDom?.innerText;
            const companyName = (job.querySelector('.job-card-container__primary-description') as HTMLElement)?.innerText;
            const jobLocation = (job.querySelector('.job-card-container__metadata-item') as HTMLElement)?.innerText;
            if (jobTitle && companyName && jobLocation) {
              await jonDom?.click();
              await new Promise(resolve => setTimeout(resolve, 3000));
              // job Description
              const jobDescription = (document.querySelector('.jobs-description-content__text') as HTMLElement)?.innerText || '';
              // Company name, number of applicants, release time
              const jobInfo = (document.querySelector('.job-details-jobs-unified-top-card__primary-description-without-tagline') as HTMLElement)?.innerText;
              const elements = Array.from(document.querySelectorAll('li.job-details-jobs-unified-top-card__job-insight')) || [];
              // Company size, keywords type
              const componyInfo = elements.slice(0, 2).map(el => (el as HTMLElement).innerText)?.join(',');
              const data = {
                jobTitle,
                companyName,
                jobLocation,
                jobDescription,
                jobInfo,
                componyInfo,
                jobUrl: window.location.href
              };
              
              const regex = new RegExp(ignores.join('|'), 'i');
              // if the job description contains any of the ignore words, skip this job
              const skipThisJob = ignores.length > 0 ? regex.test(jobDescription) : false;
              if (!skipThisJob) {
                if (titleIncludes) {
                  new RegExp(titleIncludes, 'gi').test(jobTitle) && jobList.push(data);
                } else {
                  jobList.push(data);
                }
              } else {
                console.log('需要pr的jobDescription: ', jobDescription);
              }
            }
          }
          return jobList;
        }, this.titleIncludes, this.ignores);
        cb && cb(jobs);
        // next page
        await this.nextpage(++pageNum);
      } catch (error: any) {
        throw new Error(error);
      }
    }

    return true;
  }

  async nextpage(pageNum: number) {
    const paginationList = await this.page.$$('.artdeco-pagination__pages li');
    for (let i = 0; i < paginationList.length; i++) {
      const li = paginationList[i];
      const value = await li.evaluate((
        node: { getAttribute: (arg0: string) => any; }
      ) => node.getAttribute('data-test-pagination-page-btn'));
      if (Number(value) == pageNum) {
        await li.click();
        break;
      }
      // if the page number is greater than the number of pages, click the last page button
      if ((i + 1) >= pageNum && !value) {
        await li.click();
        break;
      }
      const lastItem = paginationList[paginationList.length - 1];
      const lastItemValue = await lastItem.evaluate((
        node: { getAttribute: (arg0: string) => any; }
      ) => node.getAttribute('data-test-pagination-page-btn'));
      if (Number(lastItemValue) < pageNum) {
        this.thereAreMore = false;
        break;
      }
    }
  }
}

export default JobSearch;
