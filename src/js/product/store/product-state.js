/**
 * State object containing the list of products.
 * @type {{ list: Product[] }}
 */
export const productState = {
  list: [],
};

/**
 * Returns the current number of items in the provided list.
 * @param {Array} list - The list to be measured.
 * @returns {number} The length of the list.
 */
export function getCurrentLength(list) {
  return list.length;
}
