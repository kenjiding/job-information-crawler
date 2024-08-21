import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import cors from 'cors';

const projectRoot = path.resolve(__dirname, '../../');

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.post('/add-job', (req: Request, res: Response) => {
  const scriptName: string = req.body.scriptName;

  if (!scriptName) {
    return res.status(400).send('Script name is required');
  }

  exec(`npm run ${scriptName}`, { cwd: projectRoot }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return res.status(500).send(`Error executing script: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send(stderr);
    }
    console.log(`stdout: ${stdout}`);
    res.send(`Script executed successfully: ${stdout}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
