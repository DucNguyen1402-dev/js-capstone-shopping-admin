import { initDropdownMobile } from "./mobile-nav/controller.js";
import {initAllProductFormEvents} from  "./product-form/init-events.js";
import { productTable } from "./product-table/controller.js";

import { fetchProducts, productState } from "./index.js";

import { dispatch } from "./product-main-controller/controller.js";

/* ======================================================
   1. INIT
   - Entry points for page setup
   - Initialize UI, data, and event bindings
====================================================== */

/**
 * Initialize static UI interactions (no data fetching)
 */
function initPageInteractions() {
  initDropdownMobile();
  initAllProductFormEvents(dispatch);
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
