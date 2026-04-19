import { initDropdownMobile } from "./mobile-nav/controller.js";
import { productForm ,toastNotification } from "./product-form/controller.js";
import { productTable } from "./product-table/controller.js";

import {
  fetchProducts,
  deleteData,
  updateProduct,
} from "../product/services/product.js";
import {
  productState,
  getCurrentLength,
} from "../product/store/product-state.js";

/* ==============================
   1. CONTROLLER STATE
================================== */

const state = {
  /** @type {number|null} - ID waiting for delete confirmation */
  pendingDeleteId: null,
  pendingEditId: null,
};

/* ======================================================
    2. DATA FLOW & ACTION HANDLERS
   - Handle async operations (API calls)
   - Coordinate state updates and UI refresh
====================================================== */

/**
 * Re-fetch and re-render product data
 * @param {number} expectedCount - Expected number of items after update (for skeleton UI)
 */
async function updateData(expectedCount = 8) {
  productTable.showSkeleton(expectedCount);
  await fetchProducts();
  productTable.render(productState);
}

/**
 * Handle delete flow and refresh data
 * @param {Object} state - Controller state
 * @param {number|null} state.pendingDeleteId - ID waiting for deletion
 */
async function handleDeleteAndUpdate(state) {
  const res = await deleteData(state.pendingDeleteId);
  const prevCount = getCurrentLength(productState);
  await updateData(prevCount - 1);
  state.pendingDeleteId = null;
}

/**
 * Dispatch actions from UI → business logic
 * @param {Object} action
 * @param {string} action.type - Action type
 * @param {Object} action.payload - Additional data for the action
 */
async function dispatch(action) {
  switch (action.type) {
    case "DELETE_PREPARE":
      state.pendingDeleteId = action.payload.id;
      break;
    case "DELETE_CONFIRM":
      await handleDeleteAndUpdate(state, productState);
      break;
    case "EDIT":
      productForm.showFormEdit(action.payload.product);
      state.pendingEditId = action.payload.id;
      break;

    case "SORT":
      productTable.handleSorting(action, productState);
      break;

    case "UPDATE":
      await handleProductUpdate(state.pendingEditId, productState);
      break;
  }
}


async function handleAfterUpdate(productForm, toastNotification, productState, updateData) {
  productForm.hideProductForm();
  const currentCount = getCurrentLength(productState);
  await updateData(currentCount);
  toastNotification.showUpdatePopup();
}

async function handleProductUpdate(id, produtState) {
  const data = productForm.getUpdateProduct();
  toastNotification.showToastLoading();
  await updateProduct(id, data);
  toastNotification.hideToastLoading();
  handleAfterUpdate(productForm, toastNotification, produtState, updateData);
}

/* ======================================================
   3. INIT
   - Entry points for page setup
   - Initialize UI, data, and event bindings
====================================================== */

/**
 * Initialize static UI interactions (no data fetching)
 */
function initPageInteractions() {
  initDropdownMobile();
  productForm.bindEvents(dispatch);
}

/**
 * Initialize product table page
 * - Fetch data
 * - Render UI
 * - Bind related events
 */
async function initProductTablePage() {
  productTable.showSkeleton();
   await fetchProducts();
  productTable.render(productState);
  productTable.initProductTable(productState, dispatch);
}

/**
 * Initializes the application.
 * Runs initial data setup and binds global page interactions.
 * This is the entry flow of the app.
 */

async function initApp() {
  await initProductTablePage();
  initPageInteractions();
}

initApp();
