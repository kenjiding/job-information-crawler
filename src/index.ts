
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

start.seak({
  keywords: 'Developer',
  location: 'Melbourne',
  // 只保存出标题中含有 front 关键字的职位, 多个关键由 | 隔开， 例如 front | full stack
  // titleIncludes: 'front',
  ignores: ['citizen'],
  // 开启邮箱推送
  enableSendEmail: false,
  filter: {
    // 3天内的职位
    timeRange: '3'
  },
  pages: 1,
});
