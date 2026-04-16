import {fetchProducts} from "../product/services/product.js";
import {productState} from "../product/store/product.js"
import {renderProductList} from "./ui/product.js";


async function initProductPage() {

  const productList = await fetchProducts();
  renderProductList(productList);

}

initProductPage();