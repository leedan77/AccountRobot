import mongoose from 'mongoose';
import { dbUrl } from './config';

export function connectDb() {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbUrl, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function disconnectDb() {
  return new Promise((resolve, reject) => {
    mongoose.disconnect((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}