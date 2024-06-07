import { LinkedinSearchTimeFilter } from '../types';

export const TimeRangeMap: Record<LinkedinSearchTimeFilter, number> = {
  '': 0,
  month: 1,
  week: 2,
  day: 3
};