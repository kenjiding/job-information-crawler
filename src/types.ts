export type OptionalSearchParams<T> = {
  [K in keyof T]?: T[K];
};

type AtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

interface IOptions {
  seek?: OptionalSearchParams<ISearchParams<SeekSearchTimeFilter>>;
  linkedin?: OptionalSearchParams<ISearchParams<LinkedinSearchTimeFilter>>;
}

// Type alias for options with at least one property
export type ValidOptions = AtLeastOne<IOptions>;

export interface Ifilter<T> {
  timeRange?: T;
}

export type LinkedinSearchTimeFilter = '' | 'month' | 'week' | 'day';
export type SeekSearchTimeFilter = '0' | '1' | '3' | '7' | '14' | '30';
export interface ISearchParams<T> {
  username: string;
  password: string;
  keywords: string;
  location: string;
  // if true, filter out jobs that have already been applied
  filterAlreadyApply?: boolean;
  titleIncludes?: string;
  filename?: string;
  ignores?: string[];
  pages?: number;
  filter?: Ifilter<T>;
  enableSendEmail?: boolean;
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

export type ISearchResultCallback = (searchRes: ISearchResult[], isFinised?: boolean) => void;
