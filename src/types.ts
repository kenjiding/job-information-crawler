export type OptionalSearchParams<T> = {
  [K in keyof T]?: T[K];
};

type AtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

interface IOptions {
  seek?: OptionalSearchParams<ISearchParams>;
  linkedin?: OptionalSearchParams<ISearchParams>;
}

// Type alias for options with at least one property
export type ValidOptions = AtLeastOne<IOptions>;

export interface Ifilter {
  timeRange?: SearchTimeFilter;
}

export type SearchTimeFilter = '' | 'month' | 'week' | 'day';
export interface ISearchParams {
  username: string;
  password: string;
  keywords: string;
  location: string;
  titleIncludes?: string;
  filename?: string;
  ignores?: string[];
  pages?: number;
  filter?: Ifilter;
}

export interface ISearchResult {
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  jobDescription: string;
  jobInfo: string;
  componyInfo: string;
  jobUrl: string;
}

export type ISearchResultCallback = (searchRes: ISearchResult[]) => any;
