import dotenv from 'dotenv';
dotenv.config();
import Linkedin from './linkedin/index';
import Seek from './seek';

async function run() {
  // start the scraper to search in seek
  await new Seek({
    username: process.env.LINKEDIN_EMAIL!,
    password: process.env.LINKEDIN_PASSWORD!,
    position: 'developer engineer | remote',
    location: 'Australia',
    titleIncludes: 'senior',
    ignores: ['citizen'],
    pages: 1,
  }).run();

  // start the scraper to search in linkedin
  await new Linkedin({
    username: process.env.LINKEDIN_EMAIL!,
    password: process.env.LINKEDIN_PASSWORD!,
    position: 'developer engineer',
    location: 'Australia',
    titleIncludes: 'full stack',
    ignores: ['citizen'],
    pages: 1,
  }).run();
}

run();
