import fs from 'fs';
import dotenv from 'dotenv';

export default async function setEnv() {
  return new Promise((resolve) => {
    fs.readFile('.env.local', 'utf8', err => {
      if (err) {
        dotenv.config({ path: '.env' });
        resolve(true);
      } else {
        dotenv.config({ path: '.env.local' });
        resolve(true);
      }
    });
  });
}
