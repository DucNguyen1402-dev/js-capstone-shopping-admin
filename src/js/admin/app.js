import {initCreateProductTriggerBtnEvent} from "./create-product-trigger-btn/index.js";
import { initDropdownMobile } from "./mobile-nav/controller.js";
import { initAllProductFormEvents } from "./product-form/init-events.js";
import { productTableUI, productTableServices, initAllProductTableEvents } from "./product-table/index.js";
import { fetchProducts, productState } from "./index.js";
import { dispatch } from "./product-main-controller/controller.js";
import {productInteractionState} from "./product-interaction-state.js";

/* ======================================================
   1. INIT
   - Entry points for page setup
   - Initialize UI, data, and event bindings
====================================================== */

/**
 * Initialize static UI interactions (no data fetching)
 */
function initPageInteractions() {
  initCreateProductTriggerBtnEvent(dispatch);
  initDropdownMobile();
  const context = {dispatch, productList: productState.list} ;
  initAllProductFormEvents(context);
}

/**
 * Initialize product table page
 * - Fetch data
 * - Render UI
 * - Bind related events
 */
async function initProductTablePage() {
  productTableUI.renderSkeleton();
  await fetchProducts();
  productTableUI.renderDefaultTableOrder(productState.list);
  productInteractionState.filteredCount = productState.list.length;
  const context = {productState, productInteractionState, dispatch};
  initAllProductTableEvents(context);
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
