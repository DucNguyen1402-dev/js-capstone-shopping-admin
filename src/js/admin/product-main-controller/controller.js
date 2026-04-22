import { productFormServices } from "../product-form/services/product-form.js";
import { toastServices } from "../product-form/services/toast.js";
import {
  productTableUI,
  productTableServices,
} from "../product-table/index.js";
import {
  setDeleteTarget,
  performDeleteAndUpdate,
} from "./use-cases/delete-flow.js";
import { startEdit, submitProductUpdate } from "./use-cases/edit-flow.js";
import { resolveProductSearch } from "./use-cases/search-product.js";
import { getFilterProducts } from "./use-cases/filter.js";
import {
  productState,
  getCurrentLength,
  updateProduct,
  fetchProducts,
} from "../index.js";
import {
  deletionState,
  editingState,
  filterState,
  filteredList,
  sortedPriceState,
  searchState
} from "../product-interaction-state.js";

/* ======================================================
    1. CENTRAL DISPATCH & ACTION ORCHESTRATION
====================================================== */

/**
 * A map of action types to their corresponding use-case handlers.
 *
 * Each entry represents a unit of business logic responsible for handling
 * a specific action. A use-case may perform synchronous state updates,
 * asynchronous operations (e.g., API calls), and/or trigger UI side effects.
 *
 * The handlers are invoked by the central `dispatch` function based on `action.type`.
 *
 * @type {Object.<string, (action: Object) => (void | Promise<void>)>}
 */

const actionUseCases = {
  
  PRODUCT_DELETE_REQUESTED: (action) => {
    setDeleteTarget(deletionState, action.payload.id);
  },
  PRODUCT_DELETE_CONFIRMED: async (action) => {
    await performDeleteAndUpdate(deletionState);
    fetchAndRenderProducts(getCurrentLength(productState) - 1);
  },
  PRODUCT_EDIT_STARTED: (action) => {
    productFormServices.showFormEdit(action.payload.product);
    startEdit(editingState, action.payload.id);
  },
  PRODUCT_UPDATE_SUBMITTED: (action) => {
    handleSubmitProductUpdate(
      editingState,
      productState,
      productFormServices,
      toastServices,
    );
  },
  PRODUCT_SORT_CHANGED: (action) => {
    sortedPriceState.sortStrategy = action.payload.sortStrategy;
    const sortedList = resolveSortedProductList(
      productState.list,
      filterState,
      productTableServices,
      action.payload.sortStrategy,
    );
    productTableUI.renderRawOrderOfList(sortedList);
  },
  SEARCH_PRODUCT_REQUEST: (action) => {
    const searchList = resolvedSearchProductList(
      productState.list,
      filterState,
      productTableServices,
    );

    handleSearchProductOnTable(
      action.payload.inputValue,
      productTableUI,
      searchList,
      searchState,
    );
  },
  TABLE_FILTER_REQUEST: (action) => {
    let sortedStateOfList = productTableServices.getSortedProducts(
      sortedPriceState.sortStrategy,
      productState.list,
    );
    filterState.setFilterType(action.payload.productType);
    if(searchState.onSearch) sortedStateOfList = searchState.list;
  

    handleProductTableFilter(
      action.payload.productType,
      sortedStateOfList,
      productTableUI,
      filterState,
      filteredList,
    );
  },
};

/**
 * Dispatches an action to its corresponding use-case handler.
 *
 * This function acts as the central coordinator of the application flow:
 * it looks up the appropriate handler from `actionUseCases` using `action.type`
 * and executes it.
 *
 * All handlers are invoked with the full `action` object. The function supports
 * both synchronous and asynchronous handlers by always awaiting the result.
 *
 * If no matching handler is found, the action is silently ignored.
 *
 * @param {Object} action - The action object describing what happened.
 * @param {string} action.type - The type of action to dispatch.
 * @param {Object} [action.payload] - Optional data carried by the action.
 *
 * @returns {Promise<void>} A promise that resolves when the handler (if any) completes.
 */
export async function dispatch(action) {
  const useCase = actionUseCases[action.type];
  if (!useCase) return;

  await useCase(action);
}

/* ======================================================
    3. DOMAIN LOGIC & SERVICE HANDLERS
====================================================== */

/**
 * Action handler for the product update pipeline.
 * @description
 * Orchestrates data extraction, persistence via service layer,
 * and triggers the post-update execution flow.
 * @param {Object} pendingActionState - Tracking buffer.
 * @param {Object} productState - Data state context.
 * @param {Object} productForm - UI form interface.
 * @param {Object} toastServices - Feedback service.
 */
async function handleSubmitProductUpdate(
  interactionStateActions,
  productState,
  productForm,
  toastServices,
) {
  const data = productForm.getUpdateProduct();

  toastServices.showLoading();
  await submitProductUpdate(interactionStateActions, data);
  toastServices.hideLoading();

  await runAfterUpdateFlow(productForm, toastServices, productState);
}

/**
 * Finalizes the post-persistence UI sequence.
 * @description
 * Dismisses the form, synchronizes the view with the updated data store,
 * and dispatches success notifications.
 * @param {Object} productForm - UI controller for form visibility.
 * @param {Object} toastServices - Global feedback service.
 * @param {Object} productState - Application state for sync context.
 */
async function runAfterUpdateFlow(productForm, toastServices, productState) {
  productForm.hideForm();
  await fetchAndRenderProducts(getCurrentLength(productState));
  toastServices.showUpdateSuccess();
}

/**
 * Orchestrates the data-to-view synchronization cycle.
 * @description
 * Manages the fetch-render sequence by activating skeleton placeholders,
 * acquiring remote data, and refreshing the table representation.
 * @param {number} expectedCount - Record count for skeleton sizing.
 */
export async function fetchAndRenderProducts(expectedCount) {
  productTableUI.renderSkeleton(expectedCount);

  await fetchProducts();

  productTableUI.renderDefaultTableOrder(productState.list);
}

/**
 * Orchestrates the search result rendering logic.
 * @description
 * Evaluates the search state and commands the table UI to display
 * filtered results, the original list, or a 'Not Found' message.
 * * @param {string} inputValue - Current search query.
 * @param {Object} productTableUI - The Table UI service.
 * @param {Object} productState - Current application data state.
 */
function handleSearchProductOnTable(inputValue, productTableUI, productList) {
  const { state, list } = resolveProductSearch(inputValue, productList);
    searchState.onSearch = true;
  if (state === "NOT_FOUND") {
    productTableUI.renderNotFoundState();
    searchState.list =[];
    return;
  }

   searchState.list =  state === "EMPTY" ? productList : list,
  productTableUI.renderDefaultTableOrder(
    state === "EMPTY" ? productList : list,
  );
}

/**
 * Orchestrates product filtering by category/brand.
 * @description
 * Filters the master list based on the selected product type.
 * If no type is selected, it restores the full table view.
 * @param {string} productType - The selected brand/category to filter by.
 * @param {Array} productList - The master list of products.
 * @param {Object} productTableUI - The Table UI service.
 */
function handleProductTableFilter(
  productType,
  productList,
  productTableUI,
  filterState,
  filteredList,
) {
  if (productType === "all") {
    productTableUI.renderRawOrderOfList(productList);
    filterState.setFilterType("all");
    filteredList.length = productList.length;
    return;
  }
  const filterList = getFilterProducts(productType, productList);

  productTableUI.renderRawOrderOfList(filterList);
  filteredList.length = filterList.length;

  filterState.setFilterType(productType);
}

/**
 * Processes the product list through a filtering and sorting pipeline.
 * @description
 * Synchronizes the current filter state with the requested sort action
 * to ensure consistency between UI view and data results.
 * @param {Array} productList - The raw master data.
 * @param {Object} filterState - State manager for the active filter type.
 * @param {Object} services - Collection of logic utilities (filter/sort).
 * @param {Object} sortStrategy - The sort stategy for sorted list production
 * @returns {Array} The final processed list ready for rendering.
 */
function resolveSortedProductList(
  productList,
  filterState,
  services,
  sortStrategy,
) {
  const activeFilter = filterState.getFilterType();
  const filteredList = services.getListByFilter(activeFilter, productList);
  return services.getSortedProducts(sortStrategy, filteredList);
}

/**
 * Prepares the target dataset for the search operation.
 * @description
 * Synchronizes the search scope by pre-filtering the master list
 * according to the currently active UI filter category.
 * @param {Array} productList - The raw master data.
 * @param {Object} filterState - State manager for the active filter type.
 * @param {Object} services - Logic utility for category filtering.
 * @returns {Array} A refined list to be used as the search baseline.
 */
function resolvedSearchProductList(productList, filterState, services) {
  const activeFilter = filterState.getFilterType();
  const searchList = services.getListByFilter(activeFilter, productList);
  return searchList;
}
