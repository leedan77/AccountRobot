import { Router } from 'express';
import {
  sendTextMessage,
  sendGenericMessage,
  sendButtonMessage,
  sendReceipt,
} from '../controllers/message';
import {
  createNewItem,
  getAllItems,
  getSameTypeItems,
} from '../controllers/item';
import newItemFlow from '../controllers/flow/newItem';
const router = new Router();

router.get('/', (req, res) => {
    if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

let newItemFlag = false;

let itemFlow;

router.post('/', async (req, res, next) => {
  try {
    for (let entry of req.body.entry) {
      for (let event of entry.messaging) {
        let sender = event.sender.id;
        console.log(JSON.stringify(event.message));
        if (event.postback) {
          let payload = event.postback.payload;
          if (payload === 'NEW_ITEM') {
            sendTextMessage(sender, "請輸入商品名稱");
            newItemFlag = true;
            itemFlow = newItemFlow(sender);
            itemFlow.next();
          } else if (payload === 'CANCEL_ITEM') {
            sendTextMessage(sender, "已取消新增項目");
            newItemFlag = false;
          } else if (payload === 'SHOW_RECORD') {
            const items = await getAllItems(sender);
            console.log(items);
            await sendReceipt(sender, items);
          } else if (payload === 'SHOW_CARD') {
            const items = await getAllItems(sender);
            await sendGenericMessage(sender, items);
          } else if (payload.startsWith('TYPE_')) {
            const type = payload.replace('TYPE_', '');
            const items = await getSameTypeItems(type);
            const res = await sendGenericMessage(sender, items);
            console.log(res);
          }
          continue;
        }
        if (event.message && event.message.text && !event.message.is_echo) {
          let text = event.message.text;       
          if (newItemFlag) {
            const isDone = itemFlow.next(text).done;
            if (isDone) {
              newItemFlag = false;
            } /* else {
              const buttons = [{
                type: "postback",
                title: "取消新增項目",
                payload: "CANCEL_ITEM"
              }];
              const result = await sendButtonMessage(sender, "錯誤的格式, 請依序輸入: 商品名稱 價錢 類型", buttons);
            } */
          }
        }
      }
      
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }  
});

export default router;
