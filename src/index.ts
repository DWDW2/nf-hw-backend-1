import 'dotenv/config';
import express from 'express';
const cookieParser = require('cookie-parser');
import connectDB from './db';
import globalRouter from './global-router';
import { logger } from './logger';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(cookieParser())
app.use(logger);
app.use(express.json());
app.use('/api/v1/',globalRouter);

app.get('/', (req, res) => {
  res.send('Hello Worldsadd!');
})


app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
