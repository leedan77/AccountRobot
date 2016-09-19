export default function* newItemFlow(sender) { 
  const name = yield "name";
  sendTextMessage(sender, `請輸入價錢`)
  const price = yield "price";
  sendTextMessage(sender, `請輸入類型`)
  const type = yield "type";
  createNewItem(sender, name, type, Number(price)).then(res => {
    sendTextMessage(sender, `已儲存\n新的項目: ${name}\n價錢: ${price}\n種類: ${type}`);
  }).catch(err => {
    console.error(err);
  });
}
