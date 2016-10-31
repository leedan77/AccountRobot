import { sendTextMessage, sendLinkMessagem, sendRapidReply } from '../message';
import { createNewItem } from '../item';

export default function* newItemFlow(sender) { 
  const name = yield "name";
  sendTextMessage(sender, `請輸入價錢`);
  const price = yield "price";
  sendRapidReply(sender, '請選取類型或自行輸入', ['食', '衣', '住', '行', '樂']).then(res => {
    console.log(res);
  }).catch(err => {
    console.error(err);
  })
  const type = yield "type";
  createNewItem(sender, name, type, Number(price)).then(res => {
    sendTextMessage(sender, `已儲存\n新的項目: ${name}\n價錢: ${price}\n種類: ${type}`);
    sendLinkMessage(sender, name).then(res => { 
      console.log(res);
    }).catch(err => {
      console.error(err);
    })
  }).catch(err => {
    console.error(err);
  });
}
