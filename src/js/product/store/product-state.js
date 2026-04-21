export const productState = {
  list: [],
};

export function getCurrentLength(state) {
  return state.list.length;
}
export function setProducts(data) {
  products = data;
}

export function getProducts() {
  return products;
}