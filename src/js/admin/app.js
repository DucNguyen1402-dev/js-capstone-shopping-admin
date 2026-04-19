import { initDropdownMobile } from "./mobile-nav/controller.js";
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
  pendingEditId: null
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
      handleProductUpdate(state.pendingEditId);
      break;
      
  }
}


async function handleProductUpdate(id){
  const updateProduct = productForm.getUpdateProduct();
   productForm.showToastLoading();
   try {
    const res = await axios.put(
      `https://69ca67a6ba5984c44bf31972.mockapi.io/api/v1/phone/${id}`,
      updateProduct
    );

  } catch (err) {
    throw err;
  }
   productForm.hideToastLoading();
  productForm.setProductFormToHidden();
  
  productTable.showSkeleton();

  const productList = await fetchProducts();
  productTable.render(productList);
  productForm.showUpdatePopup();
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
  productForm.bindEvent(dispatch);
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
  productTable.initProductTable(productList, dispatch);
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
