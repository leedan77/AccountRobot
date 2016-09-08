import 'babel-polyfill';
import { createServer } from 'http';
import debug from 'debug';
import app from './core/app';
import { connectDb, disconnectDb } from './core/db';
import { port } from './core/config';

const log = debug('http:log');
const error = debug('http:error');

const server = createServer(app);

export function start() {
  return connectDb().then(() =>
    new Promise((resolve, reject) => {
      server.listen(port);
      server.on('listening', () => {
        log(`listening on port: ${port}`);
        resolve();
      });
      server.on('error', (err) => {
        reject(err);
      });
    })
  );
}

export function stop() {
  disconnectDb().then(() => {
    server.close();
  });
}

if (require.main === module) {
  start().catch((err) => {
    error(err);
    stop();
  });
}
