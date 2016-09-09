import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import debug from 'debug';
import { initChatMenu, initNewThreadBtn } from './config';
import router from '../routes'

const log = debug('Bot:log');
const error = debug('Bot:error');

initNewThreadBtn()
.then(res => {
  log(res);
})
.catch(err => {
  error(err);
});

initChatMenu();

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(router);

export default app;
