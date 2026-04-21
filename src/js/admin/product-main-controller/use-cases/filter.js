/**
 * Filters the product collection by type.
 * @description Uses optional chaining for safe, case-insensitive matching.
 * @param {string} productType - Target category.
 * @param {Array} productList - Master data source.
 * @returns {Array} Filtered subset.
 */
export function getFilterProducts(productType, productList){
     const list = productList.filter((p) => p.type?.toLowerCase() === productType);
     return list;
}