
# job-information-crawler

`job-information-crawler` this is a linkedin, seek job information crawler

## description

This project shows how to use the Puppeteer framework to work with several other commonly used Node.js libraries, such as `csv-writer` for data export, `dayjs` for date processing, etc., to implement web page automation tasks.

## features

- linkedin, seek job information crawler
- Web page automation
- CSV file generation
- Environment variable management
- Database interaction

## Install

First, make sure you have installed [Node.js](https://nodejs.org/) (the latest stable version is recommended). Then, clone this repository and install dependencies:

```bash
git clone https://github.com/kenjiding/job-information-crawler.git
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
  /**
   * ./src/index.ts
   * 
   * You can use the following order:
   *
  */
  start.seak(...).linkedin(...);
  start.linkedin(...).seek(...);
  start.linkedin(...);
  start..seek(...);
```

```javascript
// example of search options
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

```
