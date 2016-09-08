import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import request from 'request';
import { initChatMenu } from './config';
import router from '../routes'

initChatMenu();
const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(router);

export default app;
