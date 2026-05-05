/**
 * @typedef {Object} ProductInteractionState
 * @property {string|null} deleteId - ID of the product marked for deletion.
 * @property {string|null} editId - ID of the product being edited.
 * @property {string} filterType - Current active category filter.
 * @property {number} filteredCount - Total items matching current filters.
 * @property {string} sortPriceStrategy - Sorting logic for product prices.
 * @property {boolean} isSearching - Indicates if a search operation is active.
 * @property {Array} searchResults - List of items returned from search.
 * @property {Object} formState - State management for the product form.
 * @property {string} formState.mode - Form operation mode (e.g., 'create', 'edit').
 * @property {boolean} formState.onDraft - Tracking unsaved changes in the form.
 * @property {function} formState.reset - Resets form state to default values.
 */
export const productInteractionState = {
  deleteId: null,
  editId: null,
   onEditForm: false,
  filterType: "all",
  filteredCount: 0,
  sortPriceStrategy: "price_desc", // Fixed typo
  isSearching: false, // Renamed for clarity
  searchResults: [], // Alternative to searchList,
  formState: {
    mode: "",
    onDraft: false,
    reset() {
      this.mode = "";
      this.onDraft = false;
    },
  },
};
