import { FAVORITE_ITEMS_KEY, CART_ITEMS_KEY } from '../helpers/constants.js';

export const getStorage = key => JSON.parse(localStorage.getItem(key)) || [];

export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const addProductToFavorite = productID => {
  const goods = getStorage(FAVORITE_ITEMS_KEY);

  if (!goods.includes(productID)) {
    goods.push(productID);
    setStorage(FAVORITE_ITEMS_KEY, goods);
  }
};

export const removeProductFromFavorite = productID => {
  setStorage(
    FAVORITE_ITEMS_KEY,
    getStorage(FAVORITE_ITEMS_KEY).filter(product => product.id !== productID),
  );
};

export const addProductToCart = productID => {
  const goods = getStorage(CART_ITEMS_KEY);
  const existingProduct = goods.some(product => product.id === productID);

  if (!existingProduct) {
    goods.push({ id: productID, quantity: 1 });
    setStorage(CART_ITEMS_KEY, goods);
  }
};

export const setProductQuantityInCart = (productID, quantity) => {
  const goods = getStorage(CART_ITEMS_KEY);
  const target = goods.find(product => product.id === productID);
  target.quantity = quantity;
  setStorage(CART_ITEMS_KEY, goods);
};

export const removeProductFromCart = productID => {
  const goods = getStorage(CART_ITEMS_KEY);
  const filteredGoods = goods.filter(product => product.id !== productID);
  setStorage(CART_ITEMS_KEY, filteredGoods);
};
