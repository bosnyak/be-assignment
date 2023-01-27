import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import { AppDataSource } from './database';

(async () => {
  const app = express();
  app.use(bodyParser.json());
  const port = process.env.PORT || 3000;

  await AppDataSource.initialize();

  app.use('/', router);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
