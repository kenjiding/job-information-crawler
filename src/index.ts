
/**
 * You can use the following order:
 * 
 * start.seak(...).linkedin(...);
 * start.linkedin(...).seek(...);
 * start.linkedin(...);
 * start.seek(...);
*/
/**
 * @param {string} username - LinkedIn username
 * @param {string} password - LinkedIn password
 * @param {string} keywords - Keywords to search
 * @param {string} location - Location to search
 * @param {string} titleIncludes - Title includes to search
 * @param {string[]} ignores - Keywords to ignore
 * @param {Object} filter - Filter options
 * @param {number} pages - Number of pages to search
 */
import start from './start';

start.linkedin({
  keywords: 'Senior Software Developer',
  location: ' Australia',
  ignores: ['citizen'],
  // 开启邮箱推送
  enableSendEmail: false,
  filter: {
    timeRange: 'week'
  },
  pages: 1,
}).seak({
  keywords: 'Senior Software Developer',
  location: ' Australia',
  ignores: ['citizen'],
  // 开启邮箱推送
  enableSendEmail: false,
  filter: {
    timeRange: '7'
  },
  pages: 1,
});
