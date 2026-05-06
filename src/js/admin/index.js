/** --- API Services --- */
export {
  fetchProducts,
  deleteData,
  updateProduct,
  addProduct
} from "./product/services/product.js";

/** --- State Management --- */
export {
  productState
} from "./product/store/product-state.js";

export { $ } from "../shared/dom-utils.js";