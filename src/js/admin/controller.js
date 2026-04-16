import {fetchProductList} from "../product/services/product.js";
import {productState} from "../product/store/product.js"

async function initProducts() {
  const products = await fetchProducts();
 
}