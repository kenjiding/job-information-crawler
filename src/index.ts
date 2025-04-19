
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
  keywords: 'full stack',
  location: 'Melbourne',
  // titleIncludes: 'full stack',
  ignores: ['citizen'],
  enableSendEmail: false,
  pages: 1,
  // Only save jobs whose titles contain the keyword "front".  
  // For multiple keywords, separate them with `|`, e.g., `front | full stack`.
  // titleIncludes: 'full stack',
  // enable Email: true,
});
