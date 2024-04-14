
# job-information-crawler

`job-information-crawler` this is a linkedin, seek job information crawler

## 描述

This project shows how to use the Puppeteer framework to work with several other commonly used Node.js libraries, such as `csv-writer` for data export, `dayjs` for date processing, etc., to implement web page automation tasks.

## 特性

- linkedin, seek job information crawler
- Web page automation
- CSV file generation
- Environment variable management
- Database interaction

## Install

First, make sure you have installed [Node.js](https://nodejs.org/) (the latest stable version is recommended). Then, clone this repository and install dependencies:

```bash
git clone https://github.com/yourusername/puppeteer-page.git
cd job-information-crawler
```

## Usage

### input your linkedin / seek account and password in the `.env` file.
```bash
# .env file
LINKEDIN_EMAIL='your_linkedin_email'
LINKEDIN_PASSWORD='your_linkedin_password'
SEEK_EMAIL='your_seek_email'
SEEK_PASSWORD='your_seek_password'
```

### Install
```bash
npm install
npm run start
```

## Search Guide
```javascript
{
  // linkedin/seek account
  username: process.env.SEEK_EMAIL!,
  // linkedin/seek password
  password: process.env.SEEK_PASSWORD!,
  // search keywords
  keywords: 'developer engineer | remote',
  // search location
  location: 'Australia',
  // search job title includes these keywords
  titleIncludes: 'senior',
  // skip job descriptions with these keywords
  ignores: ['citizen'],
  // how many pages to search
  pages: 1,
}
```