/**
 * Controller object for managing product table UI and behavior.
 * * @type {Object}
 * @property {Function} showSkeleton - Displays the loading placeholder (skeleton screen).
 * @property {Function} render - Renders the actual product list into the table.
 * @property {Function} initProductTable - Sets up table-related events.
 */

export const productTableServices = {
  getSortedProducts,
  getListByFilter,
};

/**
 * Collection of sorting functions for product data.
 * @type {Object.<string, Function>}
 * @description Defines strategies for sorting products based on price
 * in both ascending and descending order.
 */
const PRODUCT_SORT_STRATEGIES = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
};


/**
 * Sorts the product collection based on a predefined strategy.
 * @description 
 * Uses 'PRODUCT_SORT_STRATEGIES' to look up the sorting logic. 
 * Creates a shallow copy of the list to maintain immutability.
 * @param {string} sortStrategy - Key for the sorting strategy (e.g., 'price-asc').
 * @param {Array} productList - The product collection to be sorted.
 * @returns {Array|undefined} A new sorted array, or undefined if strategy is invalid.
 */
function getSortedProducts(sortStrategy, productList) {
  const sorter = PRODUCT_SORT_STRATEGIES[sortStrategy];

  if (!sorter) return;
  const sortedList = [...productList].sort(sorter);

  return sortedList;
}

/**
 * Filters the product collection based on a specific category type.
 * @description 
 * Provides a filtered subset of data. Returns the full list if the type is 'all'.
 * Expects 'type' to be pre-validated and normalized.
 * @param {string} type - The filter category (e.g., 'all', 'laptop', 'phone').
 * @param {Array} productList - The source array of product objects.
 * @returns {Array} The filtered product collection.
 */
function getListByFilter(type, productList) {
  if (type === "all") return productList;

  const list = productList.filter((p) => p.type?.toLowerCase() === type);
  return list;
}

