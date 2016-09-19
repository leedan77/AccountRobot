import { Router } from 'express';
import { sendTextMessage, sendGenericMessage, sendButtonMessage } from '../controllers/message';
import { createNewItem } from '../controllers/item';
const router = new Router();

router.get('/', (req, res) => {
    if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

let newItemFlag = false;

function* newItemFlow(sender) { 
  const name = yield "name";
  sendTextMessage(sender, `請輸入價錢`)
  const price = yield "price";
  sendTextMessage(sender, `請輸入類型`)
  const type = yield "type";
  // sendTextMessage(sender, `類型: ${type}`)
  createNewItem(sender, name, type, Number(price)).then(res => {
    sendTextMessage(sender, `已儲存\n新的項目: ${name}\n價錢: ${price}\n種類: ${type}`);
  }).catch(err => {
    console.error(err);
  });
}

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
