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

/**
 * You can use the following order:
 * 
 * start.seak(...).linkedin(...);
 * start.linkedin(...).seek(...);
 * start.linkedin(...);
 * start.seek(...);
*/
import start from './start';

start.linkedin({
  keywords: 'developer',
  location: 'Australia',
  ignores: ['citizen'],
  enableSendEmail: true,
  pages: 2,
});
