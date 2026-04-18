import { initDropdownMobile } from "./dropdown-mobile/controller.js";
import { productForm } from "./product-form/controller.js";
import { productTable } from "./product-table/controller.js";
import { fetchProducts, deleteData } from "../product/services/product.js";
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
async function updateData(expectedCount) {
  productTable.showSkeleton(expectedCount);
  const productList = await fetchProducts();
  productTable.render(productList);
}

/**
 * Handle delete flow and refresh data
 * @param {Object} state - Controller state
 * @param {number|null} state.pendingDeleteId - ID waiting for deletion
 */
async function handleDeleteAndUpdate(state) {
  try {
    const res = await deleteData(state.pendingDeleteId);
      const prevCount = getCurrentLength(productState);
      await updateData(prevCount - 1);
      state.pendingDeleteId = null;
    
  } catch (error) {
    console.error(error);
  }
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
      await handleDeleteAndUpdate(state,productState );
      break;

    case "EDIT":
      productForm.handleEdit(action.payload.product);
      break;
  }
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
  productForm.bindEvent();
}

/**
 * Initialize product table page
 * - Fetch data
 * - Render UI
 * - Bind related events
 */
async function initProductTablePage() {
  productTable.showSkeleton();
  const productList = await fetchProducts();
  productTable.render(productList);
  productTable.bindProductListTableEvent(productList, dispatch);
  productTable.bindDeleteModelEvent(dispatch);
}

/**
 * Main entry point of the page
 */
export async function initPage() {
  await initProductTablePage();
  initPageInteractions();
}
