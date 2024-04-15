import start from './start';

start({
  seek: {
    // username: 'xxx', // you can set here or set it in .env file
    // password: 'xxx', // you can set here or set it in .env file
    keywords: 'developer',
    location: 'Australia',
    titleIncludes: 'full stack | back end',
    ignores: ['citizen'],
    pages: 20,
  },
  linkedin: {
    // username: 'xxx', // you can set here or set it in .env file
    // password: 'xxx', // you can set here or set it in .env file
    keywords: 'engineer',
    location: 'Australia',
    titleIncludes: 'full stack | front end',
    ignores: ['citizen'],
    pages: 20,
  },
});