import Item from '../models/item';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function parseQuery(query) {
  let q;
  if (query.startsWith('name:')) {
    let name = query.replace('name:', '');
    q = {
      name,
    };
  } else if (query.startsWith('type:')) {
    let type = query.replace('type:', '');
    q = {
      type,
    };
  } else if (query.startsWith('time:')) {
    let time = query.replace('time:', '').split('~');
    q = {
      createdAt: {
        $gte: new Date(time[0]),
        $lt: new Date(time[1]),
      },
    };
  }
  return q;
}

export async function createNewItem(owner, name, type, price) {
  const item = new Item({ owner, name, type, price });
  await item.save();
  return item;
}

export async function getAllItems(userID, limit) {
  return Item.find({ owner: userID }).limit(limit);
}

export async function getSameTypeItems(type) {
  const items = await Item.find({ type });
  return items;
}

export async function getFilterItems(userID, limit, query) {
  if (isEmpty(query))
    return null;
  const items = await Item.find(query).limit(limit);
  return items;
}
