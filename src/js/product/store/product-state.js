export const productState = {
  list: [],
};

export function getCurrentLength(list) {
  return list.length;
}
export function setProducts(data) {
  products = data;
}

export function getProducts() {
  return products;
}