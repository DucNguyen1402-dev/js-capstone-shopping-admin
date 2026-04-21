import { productFormServices } from "../product-form/services/product-form.js";
import { toastServices } from "../product-form/services/toast.js";
import { productTable } from "../product-table/controller.js";
import {
  prepareDelete,
  confirmDeleteAndUpdate,
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
} from "../product-interaction-state.js";

/* ======================================================
    1. CENTRAL DISPATCH & ACTION ORCHESTRATION
====================================================== */
/**
 * Central action dispatcher for the product module.
 * * @description
 * Acts as the primary orchestrator, mapping disparate UI actions to
 * specialized business logic handlers. It maintains the integrity of the
 * product lifecycle by managing state transitions, asynchronous persistence,
 * and view reconciliation.
 * * @param {Object} action - The intent object containing `type` and optional `payload`.
 * @returns {Promise<void>}
 */
export async function dispatch(action) {
  switch (action.type) {
    case "PRODUCT_DELETE_REQUESTED":
      prepareDelete(deletionState, action);
      break;
    case "PRODUCT_DELETE_CONFIRMED":
      await confirmDeleteAndUpdate(deletionState);
      fetchAndRenderProducts(getCurrentLength(productState) - 1);
      break;
    case "PRODUCT_EDIT_STARTED":
      productFormServices.showFormEdit(action.payload.product);
      startEdit(editingState, action);
      break;
    case "PRODUCT_UPDATE_SUBMITTED":
      handleSubmitProductUpdate(
        editingState,
        productState,
        productFormServices,
        toastServices,
      );
      break;
    case "PRODUCT_SORT_CHANGED":
      const list = filterState.resolveFilterList(productState.list);
      productTable.handleSorting(action, list);
      break;
    case "SEARCH_PRODUCT_REQUEST":
      handleSearchProductOnTable(
        action.payload.inputValue,
        productTable,
        productState.list,
      );
      break;
    case "TABLE_FILTER_REQUEST":
      filterState.onFilterState(action.payload.onFilter);
      handleProductTableFilter(
        action.payload.productType,
        productState.list,
        productTable,
        filterState,
      );
      break;
  }
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
  productTable.showSkeleton(expectedCount);

  await fetchProducts();

  productTable.render(productState.list);
}

/**
 * Orchestrates the search result rendering logic.
 * @description
 * Evaluates the search state and commands the table UI to display
 * filtered results, the original list, or a 'Not Found' message.
 * * @param {string} inputValue - Current search query.
 * @param {Object} productTable - The Table UI service.
 * @param {Object} productState - Current application data state.
 */
function handleSearchProductOnTable(inputValue, productTable, productList) {
  const { state, list } = resolveProductSearch(inputValue, productList);

  if (state === "NOT_FOUND") {
    productTable.showNotFound();
    return;
  }

  productTable.render(state === "EMPTY" ? productList : list);
}

/**
 * Orchestrates product filtering by category/brand.
 * @description
 * Filters the master list based on the selected product type.
 * If no type is selected, it restores the full table view.
 * @param {string} productType - The selected brand/category to filter by.
 * @param {Array} productList - The master list of products.
 * @param {Object} productTable - The Table UI service.
 */
function handleProductTableFilter(
  productType,
  productList,
  productTable,
  filterState,
) {
  if (productType === "all") {
    filterState.setFilterList([]);
    productTable.render(productList);
    filterState.onFilterState(false);
    return;
  }

  const filterList = getFilterProducts(productType, productList);

  productTable.render(filterList);

  filterState.setFilterList(filterList);
}
