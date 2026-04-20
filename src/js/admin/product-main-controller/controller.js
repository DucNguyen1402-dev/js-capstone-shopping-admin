import { productFormServices } from "../product-form/services/product-form.js";
import {toastServices} from "../product-form/services/toast.js";
import { productTable } from "../product-table/controller.js";
import {
  prepareDelete,
  confirmDeleteAndUpdate,
} from "./use-cases/delete-flow.js";
import { startEdit, submitProductUpdate } from "./use-cases/edit-flow.js";
import {
  productState,
  getCurrentLength,
  updateProduct,
  fetchProducts,
} from "../index.js";

/*  ========================================
    1. PERSISTENT & EPHEMERAL STATE
  =========================================== */

/**
 * Local state buffer for pending operations.
 * @description 
 * Maintains ephemeral identifiers to track entities during async transitions, 
 * ensuring data integrity and preventing race conditions.
 */
const pendingActionState = {
  /** @type {number|null} - ID awaiting deletion confirmation. */
  deletedId: null,

  /** @type {number|null} - ID currently locked for editing. */
  editId: null,
};

/* ======================================================
    2. CENTRAL DISPATCH & ACTION ORCHESTRATION
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
      prepareDelete(pendingActionState, action);
      break;
    case "PRODUCT_DELETE_CONFIRMED":
      await confirmDeleteAndUpdate(pendingActionState);
      fetchAndRenderProducts(getCurrentLength(productState) - 1);
      break;
    case "PRODUCT_EDIT_STARTED":
      productFormServices.showFormEdit(action.payload.product);
      startEdit(pendingActionState, action);
      break;
    case "PRODUCT_UPDATE_SUBMITTED":
      handleSubmitProductUpdate(
        pendingActionState,
        productState,
        productFormServices,
        toastServices,
      );
      break;
    case "PRODUCT_SORT_CHANGED":
      productTable.handleSorting(action, productState);
      break;
    case "SEARCH_PRODUCT_REQUEST":
      handleSearchProductOnTable(action.payload.inputValue, productTable, productState);
      break;

  }
}

function handleSearchProductOnTable(inputValue, productTable,productState ){
    // const findedProduct = productState.list.filter(product => product.)
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
  pendingActionState,
  productState,
  productForm,
  toastServices,
) {
  const data = productForm.getUpdateProduct();

  toastServices.showLoading();
  await submitProductUpdate(pendingActionState, data);
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
async function runAfterUpdateFlow(
  productForm,
  toastServices,
  productState,
) {
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

  productTable.render(productState);
}
