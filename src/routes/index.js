import { Router } from 'express';
import webhookRouter from './webhook';

const router = new Router();

router.get('/', (req, res) => {
  res.json({
    message: "I am a Facebook robot",
  });
});

router.use('/webhook', webhookRouter);

export default router;