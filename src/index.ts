import dotenv from 'dotenv';
dotenv.config();
import Linkedin from './linkedin';
import Seek from './seek';

async function run() {
  // start the scraper to search in seek
  await new Seek({
    username: process.env.SEEK_EMAIL!,
    password: process.env.SEEK_PASSWORD!,
    keywords: 'marketing',
    location: 'Australia',
    titleIncludes: '',
    ignores: ['citizen'],
    pages: 20,
  }).run();

  // start the scraper to search in linkedin
  await new Linkedin({
    username: process.env.LINKEDIN_EMAIL!,
    password: process.env.LINKEDIN_PASSWORD!,
    keywords: 'full stack',
    location: 'Australia',
    titleIncludes: '',
    ignores: ['citizen'],
    pages: 30,
  }).run();
}

run();
