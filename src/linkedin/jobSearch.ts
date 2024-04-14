import { wait } from '../utils';
import { ISearchParams, ISearchResult } from '../types';
import { Page } from 'puppeteer';

type IJobSearch = Pick<ISearchParams, 'position' | 'location' | 'pages' | 'titleIncludes' | 'ignores'>;

class JobSearch {
  page: any;
  position: string;
  location: string;
  titleIncludes: string;
  ignores: string[];
  pages: number;

  constructor({
    page,
    position,
    location,
    titleIncludes,
    ignores,
    pages
  }: IJobSearch & { page: Page }) {
    this.page = page;
    this.position = position;
    this.location = location;
    this.titleIncludes = titleIncludes;
    this.ignores = ignores;
    this.pages = pages;
  }
  // game_children_challenge
  async search() {
    await this.page.goto('https://www.linkedin.com/jobs/', { waitUntil: 'load' });
    await this.page.waitForSelector('input.jobs-search-box__text-input', { timeout: 1000000 });
    await this.page.type('input.jobs-search-box__text-input', this.position);
    await wait();
    await this.page.type('input.jobs-search-box__text-input[autocomplete="address-level2"]', this.location);
    await wait();
    await this.page.keyboard.press('Enter');
    await this.page.waitForNavigation({ waitUntil: 'load' });

    // search job result
    return await this.loadJobList();
  }

  async loadJobList(): Promise<ISearchResult[]> {
    let pageNum = 1;
    const jobLists: ISearchResult[] = [];
    while (pageNum <= this.pages) {
      try {
        await wait(3000);
        const jobs = await this.page.evaluate(async (titleIncludes: string, ignores: string[]) => {
          const listContainer = document.querySelector('.jobs-search-results-list');
          if (listContainer) listContainer.scrollTop = listContainer.scrollHeight;
          const jobElements = document.querySelectorAll('.jobs-search-results__list-item');
          const jobList = [];
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
              // Company size, position type
              const componyInfo = elements.slice(0, 2).map(el => (el as HTMLElement).innerText);
              const data = {
                jobTitle,
                companyName,
                jobLocation,
                jobDescription,
                jobInfo,
                componyInfo,
              };

              const regex = new RegExp(ignores.join('|'), 'i');
              // if the job description contains any of the ignore words, skip this job
              const skipThisJob = regex.test(jobDescription);
              if (!skipThisJob) {
                if (titleIncludes) {
                  new RegExp(titleIncludes, 'gi').test(jobTitle) && jobList.push(data);
                } else {
                  jobList.push(data);
                }
              }
            }
          }
          return jobList;
        }, this.titleIncludes, this.ignores);
        jobLists.push(...jobs);
        // next page
        await this.nextpage(++pageNum);
      } catch (error: any) {
        console.log('error: ', error);
        throw new Error(error);
      }
    }
    return jobLists;
  }

  async nextpage(pageNum: number) {
    const paginationList = await this.page.$$('.artdeco-pagination__pages li');
    for (let i = 0; i < paginationList.length; i++) {
      const li = paginationList[i];
      const value = await li.evaluate((
        node: { getAttribute: (arg0: string) => any; }
      ) => node.getAttribute('data-test-pagination-page-btn'));
      /**
       * The hard coding here is 9 because the paging of LinkedIn’s job search page can display up to 9 pages at a time.
      */
      if (pageNum === 9 && !value) {
        await li.click();
        break;
      }
      if (Number(value) == pageNum) {
        await li.click();
        break;
      }
    }
  }
}

export default JobSearch;
