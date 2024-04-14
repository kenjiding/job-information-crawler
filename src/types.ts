

export interface ISearchParams {
  username: string;
  password: string;
  keywords: string;
  location: string;
  titleIncludes?: string;
  filename?: string;
  ignores?: string[];
  pages?: number;
}

export interface ISearchResult {
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  jobDescription: string;
  jobInfo: string;
  componyInfo: string;
}

export type ISearchResultCallback = (searchRes: ISearchResult[]) => any;
