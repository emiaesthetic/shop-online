export const getStorage = key => JSON.parse(localStorage.getItem(key)) || [];

export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const addProductToStorage = (key, value) => {
  const goods = getStorage(key);
  goods.push(value);
  setStorage(key, goods);
};

export const removeProductFromStorage = (key, value) => {
  const goods = getStorage(key);
  setStorage(
    key,
    goods.filter(item => item !== value),
  );
};
