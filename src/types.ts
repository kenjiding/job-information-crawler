

export interface ISearchParams {
  username: string;
  password: string;
  position: string;
  location: string;
  titleIncludes: string;
  ignores: string[];
  pages: number;
}

export interface ISearchResult {
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  jobDescription: string;
  jobInfo: string;
  componyInfo: string;
}