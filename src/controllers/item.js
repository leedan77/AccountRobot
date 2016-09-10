import Item from '../models/item';

export async function createNewItem(userID, name, type, price) {
  const item = new Item({ userID, name, type, price });
  await item.save();
  return item;
}