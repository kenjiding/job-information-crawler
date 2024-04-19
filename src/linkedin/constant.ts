import { SearchTimeFilter } from '../types';

export const TimeRangeMap: Record<SearchTimeFilter, number> = {
  '': 0,
  month: 1,
  week: 2,
  day: 3
};