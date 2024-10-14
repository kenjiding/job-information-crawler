import express, { Request, Response } from 'express';
import cors from 'cors';
import Seek from '../seek';
import setEnv from '../setEnv';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.post('/add-job', async (req: Request, res: Response) => {
  const {
    scriptName,
    keywords,
    location,
    ignores = [],
    titleIncludes,
    pages,
  }: any = req.body;

  if (!scriptName) {
    return res.status(400).send('Script name is required');
  }
  try {
    if (scriptName === 'seek-search') {
      await new Seek({
        username: process.env.SEEK_EMAIL!,
        password: process.env.SEEK_PASSWORD!,
        keywords,
        location,
        titleIncludes,
        ignores,
        filter: {
          // 3天内的职位
          timeRange: '3'
        },
        pages,
      }).run((data) => {
        console.log('data: ', data);
        res.send({
          code: 200,
          data,
        });
      });
    }
    // res.send(`Script executed successfully`);
  } catch (err) {
    res.status(500).send(`Error executing script: ${err}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
