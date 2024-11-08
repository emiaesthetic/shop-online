export const getTotalQuantity = goods =>
  goods.reduce((acc, item) => acc + item.quantity, 0);
