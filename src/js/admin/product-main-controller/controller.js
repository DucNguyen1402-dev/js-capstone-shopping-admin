import {
  productFormServices,
  toastServices,
} from "../product-form/services/index.js";
import {
  productTableUI,
  productTableServices,
} from "../product-table/index.js";
import {
  performDelete,
  submitProductUpdate,
  resolveProductSearch,
  getFilterProducts,
  performAddProduct,
} from "./use-cases/index.js";

import {
  productState,
  getCurrentLength,
  updateProduct,
  fetchProducts,
} from "../index.js";

import { productInteractionState } from "../product-interaction-state.js";
import { getFriendlyErrorMessage } from "../utils.js";

/**
 * =========================================================
 *                0.COMPONENT MODULE WRAPPERS
 * =========================================================
 */
/**
 * Groups UI-related handlers for managing component interactions.
 * @type {{
 * productFormServices: Object,
 * productTableUI: Object
 * }}
 */
const componentUIHandler = { productTableUI };
/**
 * Aggregates business logic services used within the component.
 * @type {{
 * productFormServices: Object,
 * toastServices: Object,
 * productTableServices: Object
 * }}
 */
const componentServices = {
  productFormServices,
  toastServices,
  productTableServices,
};

/**
 * ==========================================================
 *           1. PRODUCT ACTION DISPATCHER
 *  - Coordinates UI interactions and business
 *  - logic mapping for product management.
 * ==========================================================
 */
/**
 * A mapping of action types to their respective handler functions.
 * @type {Object.<string, Function>}
 */
const useAction = {
  PRODUCT_DELETE_REQUESTED: handleDeleteRequest,
  PRODUCT_DELETE_CONFIRMED: handleDeleteConfirm,
  PRODUCT_CANCEL_DELETION: handleCancelDelete,
  PRODUCT_EDIT_HOVER: handleEditHover,
  CLOSE_FORM: handleCloseForm,
  PRODUCT_EDIT_STARTED: handleProductEditStart,
  PRODUCT_UPDATE_SUBMITTED: handleProductUpdateSubmitted,
  PRODUCT_SORT_CHANGED: handleProductSortChanged,
  SEARCH_PRODUCT_REQUEST: handleSearchProductRequest,
  TABLE_FILTER_REQUEST: handleTableFilterRequest,
  TRIGGER_STATUS_EVENT: onStatusEvent,
  OPEN_ADD_PRODUCT_FORM: handleOpenAddProductForm,
  CREATE_NEW_PRODUCT: handleCreateNewProduct,
};
/**
 * Dispatches and executes the appropriate action handler based on the action type.
 * * @async
 * @function dispatch
 * @param {Object} action - The action object to be processed.
 * @param {string} action.type - The unique identifier for the action handler.
 * @returns {Promise<void>}
 */
export async function dispatch(action) {
  const actionHandler = useAction[action.type];
  if (!actionHandler) return;
  const context = {
    action,
    productInteractionState,
    componentUIHandler,
    componentServices,
    productState,
    productCoordinator,
  };
  await actionHandler(context);
}

/**
 * ==================================================
 *              2. ACTION HANDLERS
 *  - Detailed logic implementation for each
 *  - specific action type.
 * ==================================================
 */

/* ======== 1. PRODUCT UPDATE SUBMITTED ======== */
/**
 * Initiates the deletion process by capturing the target product ID.
 * * @param {Object} context - The handler context.
 * @param {Object} context.action - The dispatched action object.
 * @param {Object} context.action.payload - The data payload.
 * @param {string|number} context.action.payload.id - ID of the product to delete.
 * @param {Object} context.productInteractionState - Current state of UI interactions.
 */
function handleDeleteRequest({ action, productInteractionState }) {
  productInteractionState.deleteId = action.payload.id;
}

/* ======== 2. PRODUCT DELETE CONFIRM ======== */
/**
 * Executes the deletion after user confirmation and refreshes the product list.
 * * @async
 * @param {Object} context - The handler context.
 * @param {Object} context.productInteractionState - Current state of UI interactions.
 * @param {Object} context.componentUIHandler - Utilities for UI manipulation.
 * @returns {Promise<void>}
 */
async function handleDeleteConfirm({
  action,
  productInteractionState,
  componentUIHandler,
  productState,
  productCoordinator,
}) {
  await performDelete(productInteractionState.deleteId);
  await productCoordinator.refresh(getCurrentLength(productState.list) - 1);
}

/* ======== 3. PRODUCT CANCEL DELETION ======== */
/**
 * Cancels the deletion process and clears the UI highlight of the pending row.
 * * @param {Object} context - The handler context.
 * @param {Object} context.action - The dispatched action object.
 * @param {Object} context.action.payload - The data payload.
 * @param {string} context.action.payload.action - The specific UI action context for clearing.
 * @param {Object} context.productInteractionState - Current state of UI interactions.
 * @param {Object} context.componentUIHandler - Utilities for UI manipulation.
 */
function handleCancelDelete({
  action,
  productInteractionState,
  componentUIHandler,
}) {
  const { productTableUI } = componentUIHandler;
  productTableUI.setPendingProductRowUIState(
    productInteractionState.deleteId,
    action.payload.action,
  );
  productInteractionState.deleteId = null;
}

/* ======== 4. PRODUCT EDIT HOVER  ======== */
/**
 * Handles the hover effect on the edit action, clearing pending UI states
 * if no other product is currently being edited.
 * * @param {Object} context - The handler context.
 * @param {Object} context.action - The dispatched action object.
 * @param {Object} context.action.payload - The data payload.
 * @param {string|number} context.action.payload.id - The ID of the product being hovered.
 * @param {string} context.action.payload.eventType - The type of mouse event (e.g., 'mouseenter', 'mouseleave').
 * @param {Object} context.productInteractionState - Current state of UI interactions.
 * @param {Object} context.componentUIHandler - Utilities for UI manipulation.
 */
function handleEditHover({
  action,
  productInteractionState,
  componentUIHandler,
}) {
  const { productTableUI } = componentUIHandler;
  if (productInteractionState.editId) return;
  productTableUI.setPendingProductRowUIState(
    action.payload.id,
    action.payload.action,
    action.payload.eventType,
  );
}

/* ======== 5. PRODUCT CLOSE FORM EDIT ======== */
/**
 * Closes the edit form, removes the highlight from the active row,
 * and resets the editing state.
 * * @param {Object} context - The handler context.
 * @param {Object} context.productInteractionState - Current state of UI interactions.
 * @param {Object} context.componentUIHandler - Utilities for UI manipulation.
 */
function handleCloseForm({
  action,
  productInteractionState,
  componentUIHandler,
  componentServices,
}) {
  const { productTableUI } = componentUIHandler;
  const { productFormServices } = componentServices;

  productFormServices.hideForm();
  if (!productInteractionState.editId) return;
  productTableUI.hideHighlightEditRow(productInteractionState.editId);
  productInteractionState.editId = null;
}

/* ======== 6. PRODUCT EDIT STARTED ======== */
/**
 * Initiates the product editing mode by displaying the edit form,
 * updating the active edit ID, and highlighting the corresponding table row.
 * * @param {Object} context - The handler context.
 * @param {Object} context.action - The dispatched action object.
 * @param {Object} context.action.payload - The data payload.
 * @param {Object} context.action.payload.product - The product data to populate the form.
 * @param {string|number} context.action.payload.id - The ID of the product being edited.
 * @param {Object} context.productInteractionState - Current state of UI interactions.
 * @param {Object} context.componentUIHandler - Utilities for UI manipulation.
 * @param {Object} context.componentServices - External services for component logic.
 */
function handleProductEditStart({
  action,
  productInteractionState,
  componentUIHandler,
  componentServices,
}) {
  const { productTableUI } = componentUIHandler;
  const { productFormServices } = componentServices;
  productFormServices.showFormEdit(action.payload.product);
  productInteractionState.editId = action.payload.id;
  productTableUI.showHighlightEditRow(action.payload.id);
}

/* ======== 7. PRODUCT UPDATE SUBMITTED ======== */

//INTERNAL HELPER
/**
 * Retrieves the updated product data from the form service.
 * @param {Object} productFormServices - Service handling form data.
 * @returns {Object} The updated product data.
 */
function getUpdateData(productFormServices) {
  return productFormServices.getUpdatedProduct();
}
/**
 * Handles the loading state and executes the update API call.
 * @async
 * @param {string|number} editId - The ID of the product being updated.
 * @param {Object} data - The new product data.
 * @returns {Promise<void>}
 */
async function submitUpdate(editId, data, toastServices) {
  toastServices.showLoading();
  await submitProductUpdate(editId, data);
  toastServices.hideLoading();
}

/**
 * Resets the UI and state after a successful update.
 * @param {Object} params
 * @param {string|number} params.editId - The ID of the product.
 * @param {Object} params.productInteractionState - Contain state of the editing process.
 * @param {Object} params.productTableUI - UI utilities for the product table.
 * @param {Object} params.productFormServices - Service handling form visibility.
 */
function cleanupAfterUpdate({
  editId,
  productInteractionState,
  productTableUI,
  productFormServices,
}) {
  productTableUI.hideHighlightEditRow(editId);
  productInteractionState.editId = null;
  productFormServices.hideForm();
}

/**
 * Refreshes the product list and displays a success notification.
 * @async
 * @param {Object} componentUIHandler - Utilities for UI manipulation.
 * @returns {Promise<void>}
 */
async function refreshProductList(
  componentUIHandler,
  productState,
  productCoordinator,
  toastServices
) {
  await productCoordinator.refresh(getCurrentLength(productState.list));
  toastServices.showUpdateSuccess();
}

//MAIN HANLDER
/**
 * Orchestrates the full product update pipeline:
 * Data retrieval -> API Submission -> UI Cleanup -> List Refresh.
 * * @async
 * @param {Object} context - The handler context.
 * @param {Object} context.productInteractionState - Current state of UI interactions.
 * @param {Object} context.componentUIHandler - Utilities for UI manipulation.
 * @param {Object} context.componentServices - External services for component logic.
 * @returns {Promise<void>}
 */
async function handleProductUpdateSubmitted({
  action,
  productInteractionState,
  componentUIHandler,
  componentServices,
  productState,
  productCoordinator,
}) {
  const { productTableUI } = componentUIHandler;
  const { productFormServices , toastServices} = componentServices;
  const editId = productInteractionState.editId;
  const data = getUpdateData(productFormServices);

  await submitUpdate(editId, data, toastServices);

  cleanupAfterUpdate({
    editId,
    productInteractionState,
    productTableUI,
    productFormServices,
  });

  await refreshProductList(
    componentUIHandler,
    productState,
    productCoordinator,
    toastServices
  );
}

/* ======== 8. PRODUCT SORT CHANGED ======== */
/**
 * Handles product sorting changes by applying the selected strategy
 * to the currently filtered or searched product list.
 * * @param {Object} context - The handler context.
 * @param {Object} context.action - The dispatched action object.
 * @param {Object} context.action.payload - The data payload.
 * @param {string} context.action.payload.sortStrategy - The sorting algorithm/criteria to apply.
 * @param {Object} context.productInteractionState - Current state of UI interactions (filter, search, sort).
 * @param {Object} context.componentUIHandler - Utilities for UI manipulation.
 * @param {Object} context.componentServices - Services for table logic and sorting.
 */
function handleProductSortChanged({
  action,
  productInteractionState,
  componentUIHandler,
  componentServices,
  productState,
}) {
  const { productTableUI } = componentUIHandler;
  const { productTableServices } = componentServices;

  // Update sorting state
  productInteractionState.sortPriceStrategy = action.payload.sortStrategy;

  // Determine the base list: either current search results or the full product list
  const baseList = productInteractionState.isSearching
    ? productInteractionState.searchResults
    : productState.list;

  // Apply current filters to the base list
  const filteredList = getCurrentFilteredList(
    productInteractionState,
    productTableServices,
    baseList,
  );

  // Apply the sorting strategy to the filtered results
  const sortedList = productTableServices.getSortedProducts(
    action.payload.sortStrategy,
    filteredList,
  );

  // Render the final sorted and filtered list
  productTableUI.renderRawOrderOfList(sortedList);
}

/* ======== 9. PRODUCT SEARCH REQUEST ======== */

//INTERNAL HELPER
/**
 * Processes the search input and returns the appropriate search state and result list.
 * @param {string} inputValue - The search query from the user.
 * @param {Array} filteredList - The product list after applying current filters.
 * @returns {Object} An object containing:
 * @returns {boolean} returns.isSearching - Whether the search mode is active.
 * @returns {Array} returns.resultList - The list of products matching the search/filter criteria.
 */
const getSearchResult = (inputValue, filteredList) => {
  const { state, list } = resolveProductSearch(inputValue, filteredList);

  const mapping = {
    NOT_FOUND: { isSearching: true, resultList: [] },
    EMPTY: { isSearching: false, resultList: filteredList },
    DEFAULT: { isSearching: true, resultList: list },
  };

  return mapping[state] || mapping.DEFAULT;
};

//MAIN HANDLER
/**
 * Handles product search requests by filtering the current list and updating the UI state.
 * * @param {Object} context - The handler context.
 * @param {Object} context.action - The dispatched action object.
 * @param {Object} context.action.payload - The data payload.
 * @param {string} context.action.payload.inputValue - The text entered by the user.
 * @param {Object} context.productInteractionState - Current state of UI interactions.
 * @param {Object} context.componentUIHandler - Utilities for UI manipulation.
 * @param {Object} context.componentServices - Services for table and search logic.
 */
function handleSearchProductRequest({
  action,
  productInteractionState,
  componentUIHandler,
  componentServices,
  productState,
}) {
  const { productTableUI } = componentUIHandler;
  const { productTableServices } = componentServices;

  // Apply filters to the master list before searching
  const filteredList = getCurrentFilteredList(
    productInteractionState,
    productTableServices,
    productState.list,
  );

  const { isSearching, resultList } = getSearchResult(
    action.payload.inputValue,
    filteredList,
  );
  // Sync internal search state
  productInteractionState.isSearching = isSearching;
  productInteractionState.searchResults = resultList;

  // UI Branching: Show "Not Found" or render the list
  if (isSearching && resultList.length === 0) {
    productTableUI.renderNotFoundState();
  } else {
    productTableUI.renderDefaultTableOrder(resultList);
  }
}

/* ======== 10. PRODUCT TABLE FILTER REQUEST ======== */
/**
 * Handles table filtering requests by product type.
 * It maintains the current search or sort context while applying the new filter.
 * * @param {Object} context - The handler context.
 * @param {Object} context.action - The dispatched action object.
 * @param {Object} context.action.payload - The data payload.
 * @param {string} context.action.payload.productType - The category or type to filter by (e.g., 'all', 'electronics').
 * @param {Object} context.productInteractionState - Current state of UI interactions.
 * @param {Object} context.componentUIHandler - Utilities for UI manipulation.
 * @param {Object} context.componentServices - Services for table logic and filtering.
 */
function handleTableFilterRequest({
  action,
  productInteractionState,
  componentUIHandler,
  componentServices,
  productState,
}) {
  const { productTableUI } = componentUIHandler;
  const { productType } = action.payload;
  const { productTableServices } = componentServices;

  // Determine the source list based on active search or default sorted list
  let baseList = productInteractionState.isSearching
    ? productInteractionState.searchResults
    : productTableServices.getSortedProducts(
        productInteractionState.sortPriceStrategy,
        productState.list,
      );

  // Apply category filter logic
  const finalDisplayList =
    productType === "all" ? baseList : getFilterProducts(productType, baseList);

  // Update internal states
  productInteractionState.filterType = productType;

  // Syncing the length of the filtered results
  productInteractionState.filteredCount = finalDisplayList.length;

  // Refresh the table UI with the final list
  productTableUI.renderRawOrderOfList(finalDisplayList);
}

/* ======== 10. STATUS EVENT TRIGGER ======== */
function onStatusEvent({ action, componentServices }) {
  const { productFormServices } = componentServices;
  const statusValue = action.payload.statusValue;
  productFormServices.triggerStatusEvent(statusValue);
}

/* ======== 10. ADD PRODUCT FORM TRIGGER ======== */

function handleOpenAddProductForm({ componentServices }) {
  const { productFormServices } = componentServices;
  productFormServices.showFormAdd();
}

/* ======== 10. CREATE NEW PRODUCT ======== */

function refreshAfterCreation(
  productFormServices,
  toastServices,
  productCoordinator,
) {
  productFormServices.hideForm();
  toastServices.hideLoading();

  productCoordinator.refresh(getCurrentLength(productState.list) + 1);
  toastServices.showAddSuccess();
}

async function handleCreateNewProduct({
  componentServices,
  productState,
  productCoordinator,
}) {
  const { productFormServices, toastServices } = componentServices;
  const data = productFormServices.getFormData();

  const isValidData  = productFormServices.validateData(data);

  if(!isValidData){
     toastServices.showError("Data invalid! Check your form");
     productFormServices.showValidationErrors();
     return;
  }

  const norminalizeData = productFormServices.normalizeFormDataTypes(data);
  try {
    toastServices.showLoading();
    await performAddProduct(norminalizeData);

    refreshAfterCreation(
      productFormServices,
      toastServices,
      productCoordinator,
    );
  } catch (error) {
    toastServices.hideLoading();
    const errorMessage = getFriendlyErrorMessage(error);
    toastServices.showError(errorMessage);
  }
}

/**
 * ==========================================
 *           3. INTERNAL HELPERS
 *   - Shared utility functions used locally
 *   - within action handlers.
 * ==========================================
 */
/**
 * Coordinator to sync Product data and UI.
 * Used by dispatch handlers.
 */

const productCoordinator = {
  ui: productTableUI,
  state: productState,

  async refresh(count) {
    this.ui.renderSkeleton(count);
    await fetchProducts();
    this.ui.renderDefaultTableOrder(this.state.list);
  },
};

/**
 * Retrieves the product list filtered by the current active filter type.
 * * @param {Object} productInteractionState - State object managing current filter settings.
 * @param {Object} productTableServices - Service containing filtering logic.
 * @param {Array} productList - The source list of products to filter.
 * @returns {Array} The filtered list of products.
 */
function getCurrentFilteredList(
  productInteractionState,
  productTableServices,
  productList,
) {
  const activeFilter = productInteractionState.filterType;
  const filteredList = productTableServices.getListByFilter(
    activeFilter,
    productList,
  );
  return filteredList;
}
