import { initCreateProductTriggerBtnEvent } from "./create-product-trigger-btn/index.js";
import { initDropdownMobile } from "./mobile-nav/controller.js";
import { initAllProductFormEvents } from "./product-form/init-events.js";
import {
  productTableUI,
  initAllProductTableEvents,
} from "./product-table/index.js";
import { fetchProducts, productState } from "./index.js";
import { dispatch } from "./product-main-controller/controller.js";
import { productInteractionState } from "./product-interaction-state.js";

/**
 * Global application context representing the product management module.
 * @typedef {Object} AppContext
 * @property {Object} product - Product module namespace.
 * @property {Object} product.ui - UI rendering methods.
 * @property {Object} product.states - Centralized state objects.
 * @property {Object} product.actions - Core business logic dispatchers.
 * @property {Object} product.eventSetup - Initialization functions for DOM events.
 * @property {Object} product.api - Network request methods.
 */

/** @type {AppContext} */
const context = {
  product: {
    ui: {
      productTableUI,
    },
    states: {
      productState,
      productInteractionState,
    },
    actions: {
      dispatch,
    },
    eventSetup: {
      initCreateProductTriggerBtnEvent,
      initDropdownMobile,
      initAllProductFormEvents,
      initAllProductTableEvents,
    },
    api: {
      fetchProducts,
    },
  },
};

/* ======================================================
   1. INIT
   - Entry points for page setup
   - Initialize UI, data, and event bindings
====================================================== */

/**
 * Sets up initial behaviors and state for the product form page.
 * @param {Object} product - Product module context containing events and actions.
 */
function initPageInteractions({ eventSetup }) {
  const { initCreateProductTriggerBtnEvent, initDropdownMobile } = eventSetup;
  initCreateProductTriggerBtnEvent(dispatch);
  initDropdownMobile();
}

/**
 * Sets up the product form page by injecting shared state and dispatch actions.
 * @param {Object} product - The product module context.
 * @param {Object} product.states - Module states.
 * @param {Object} product.actions - Module actions (dispatch).
 * @param {Object} product.eventSetup - Event initialization methods.
 */
function initProductFormPage({ states, actions, eventSetup }) {
  const { productState } = states;
  const { dispatch } = actions;
  const { initAllProductFormEvents } = eventSetup;
  const context = { dispatch, productList: productState.list };
  initAllProductFormEvents(context);
}

/** 
 * Initializes the product table page, including data fetching, rendering, and event binding.
 * @param {Object} product - The product module context.
 * @param {Object} product.ui - UI rendering components.
 * @param {Object} product.states - Module state objects.
 * @param {Object} product.actions - Dispatch actions.
 * @param {Object} product.eventSetup - Event initialization logic.
 * @param {Object} product.api - API service methods.
 * @returns {Promise<void>}
 */
async function initProductTablePage({ ui, states, actions, eventSetup, api }) {
  const { productTableUI } = ui;
  const { productInteractionState, productState } = states;
  const { initAllProductTableEvents } = eventSetup;
  const { fetchProducts } = api;
  const { dispatch } = actions;

  productTableUI.renderSkeleton();
  await fetchProducts();
  productTableUI.renderDefaultTableOrder(productState.list);
  productInteractionState.filteredCount = productState.list.length;
  const context = { productState, productInteractionState, dispatch };
  initAllProductTableEvents(context);
}

/**
 * Main entry point to initialize the application modules.
 * Orchestrates the setup of form, table, and general page interactions.
 * @returns {Promise<void>}
 */

async function initApp() {
  const {product} = context;
  initProductFormPage(product);
  await initProductTablePage(product);
  initPageInteractions(product);
}

initApp();
