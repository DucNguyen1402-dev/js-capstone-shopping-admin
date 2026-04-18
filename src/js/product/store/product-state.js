export const productState = {

  list: [],        
 
};

export function setProducts(data) {
  products = data;
}

export function getProducts() {
  return products;
}