import Item from '../models/item';

export async function createNewItem(userID, name, type, price) {
  const item = new Item({ userID, name, type, price });
  await item.save();
  return item;
}

export async function getAllItems(userID) {
  const items = await Item.find({ owner: userID });
  return items;
}
