import { SeekSearchTimeFilter } from '../types';

export const TimeRangeMap: Record<SeekSearchTimeFilter, number | string> = {
  'Today': 'Today',
  3: 'Last 3 days',
  7: 'Last 7 days',
  14: 'Last 14 days',
  30: 'Last 30 days',
  '': 'Any time'
};