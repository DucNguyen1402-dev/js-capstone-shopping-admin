/**
 * @typedef {Object} ProductInteractionState
 * @property {number|string|null} deleteId - ID of the product marked for deletion.
 * @property {number|string|null} editId - ID of the product currently being edited.
 * @property {string} filterType - Current active filter category.
 * @property {number} filteredCount - Total number of items after filtering.
 * @property {'price_asc'|'price_desc'} sortPriceStrategy - Strategy used to sort product prices.
 * @property {boolean} isSearching - Toggle state for the search mode.
 * @property {Array} searchResults - List of items matching the search query.
 */
export const productInteractionState = {
  deleteId: null,
  editId: null,
  filterType: "all",
  filteredCount: 0,
  sortPriceStrategy: "price_desc", // Fixed typo
  isSearching: false, // Renamed for clarity
  searchResults: [], // Alternative to searchList
};
