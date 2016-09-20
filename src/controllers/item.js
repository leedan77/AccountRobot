import Item from '../models/item';

export async function createNewItem(owner, name, type, price) {
  const item = new Item({ owner, name, type, price });
  await item.save();
  return item;
}

export async function getAllItems(userID) {
  const items = await Item.find({ owner: userID });
  return items;
}

export async function getSameTypeItems(type) {
  const items = await Item.find({ type });
  return items;
}
