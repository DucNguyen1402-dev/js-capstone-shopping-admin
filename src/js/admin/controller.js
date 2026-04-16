import { fetchProducts } from "../product/services/product.js";
import { productState } from "../product/store/product.js";
import { renderProductList, renderSkeleton } from "./ui/product.js";

async function initProductPage() {
  renderSkeleton();
  const productList = await fetchProducts();
  renderProductList(productList);
}

initProductPage();
