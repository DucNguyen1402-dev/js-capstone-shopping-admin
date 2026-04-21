// import {initProductListTableEvent} from "./event.js";
import {
  renderProductList,
  renderSkeleton,
  renderNotFoundProduct,
} from "./ui/render.js";
import { initProductTableEvents } from "./events/index.js";

/**
 * Controller object for managing product table UI and behavior.
 * * @type {Object}
 * @property {Function} showSkeleton - Displays the loading placeholder (skeleton screen).
 * @property {Function} render - Renders the actual product list into the table.
 * @property {Function} initProductTable - Sets up table-related events.
 */

export const productTable = {
  showSkeleton: renderSkeleton,
  render: renderSortedProducts,
  showNotFound: renderNotFoundProduct,
  initProductTable: initProductTableEvents,
  handleSorting: handleProductSorting,
};

/**
 * Collection of sorting functions for product data.
 * @type {Object.<string, Function>}
 * @description Defines strategies for sorting products based on price
 * in both ascending and descending order.
 */
export const PRODUCT_SORT_STRATEGIES = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
};

/**
 * Handles the product sorting logic and re-renders the table.
 * * @description
 * Identifies the correct sorting strategy from the payload, creates a
 * shallow copy of the product list to avoid mutating the original state,
 * and triggers a re-render with the sorted data.
 * * @param {Object} state - The current action/event state containing the payload.
 * @param {Object} productState - The global or local product state object.
 * @param {Array<Object>} productState.list - The array of products to be sorted.
 */
export function handleProductSorting(state, productList) {
  const sorter = PRODUCT_SORT_STRATEGIES[state.payload.sortStrategy];

  if (!sorter) return;
  const sortedList = [...productList].sort(sorter);

  renderProductList(sortedList);
}

/**
 * Sorts the product list by price in descending order and triggers the render process.
 * * @param {Object[]} list - The array of product objects to be sorted.
 * @param {number} list[].price - The price of the product.
 * @returns {void}
 */
function renderSortedProducts(list, isDescending= true) {
  if (!Array.isArray(list)) return;

  const sorter = isDescending
    ? PRODUCT_SORT_STRATEGIES.price_desc
    : PRODUCT_SORT_STRATEGIES.price_asc;

  const sortedList = [...list].sort(sorter);

  renderProductList(sortedList);
}
