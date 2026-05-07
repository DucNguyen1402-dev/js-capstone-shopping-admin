import {
  productFormServices,
  toastServices,
} from "../components/product-form/services/index.js";
import {
  productTableUI,
  productTableServices,
} from "../components/product-table/index.js";
import * as useCases from "./use-cases/index.js";
import {
  fetchProducts,
  deleteData,
  updateProduct,
  addProduct,
  productState,
} from "../index.js";

import {
  productUIState,
  productFilterState,
  productFormState,
  productSearchState,
  productSortedState,
} from "../product-interaction-state.js";
import * as errorHanlders from "../utils/error-handlers.js";
import * as productData from "../utils/productDataUtils.js";

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
 * ==========================================
 *           1. INTERNAL HELPERS
 *   - Shared utility functions used locally
 *   - within action handlers.
 * ==========================================
 */
/**
 * Coordinator to sync Product data and UI.
 * Used by dispatch handlers.
 */

const productOrchestrator = {
  ui: productTableUI,
  state: productState,
  services: productTableServices,
  interaction: {
    filter: productFilterState,
    search: productSearchState,
    sort: productSortedState,
  },
  useCases,

  async refreshProductList(count) {
    this.ui.renderSkeleton(count);
    await fetchProducts();
    this.ui.renderDefaultTableOrder(this.state.list);
  },
  async refreshProductListWithState(list) {
    this.ui.renderSkeleton(list.length);
    await fetchProducts();
    this.ui.renderRawOrderOfList(list);
  },

  getProductList() {
    return this.state.list;
  },
  applySearch(list) {
    const searchState = this.interaction.search;
    if (!searchState.isSearching) return list;
    return list.filter((item) => searchState.searchResultIds.has(item.id));
  },

  applyFilter(list) {
    const filterState = this.interaction.filter;
    const filterType = filterState.filterType;
    if (filterType === "all") return list;

    const filterList = list.filter((p) => p.type?.toLowerCase() === filterType);
    return filterList;
  },

  applySortedType(list) {
    const sortStrategy = this.interaction.sort.sortPriceStrategy;
    return productTableServices.getSortedProducts(sortStrategy, list);
  },
};

const createTransformers = () => [
  (list) => productOrchestrator.applySearch(list),
  (list) => productOrchestrator.applyFilter(list),
  (list) => productOrchestrator.applySortedType(list),
];

/**
 * ==========================================================
 *           2. PRODUCT ACTION DISPATCHER
 *  - Coordinates UI interactions and business
 *  - logic mapping for product management.
 * ==========================================================
 */
/**
 * Handlers for direct product entity operations (CRUD-related interactions).
 * @type {Object.<string, Function>}
 */
const productActions = {
  PRODUCT_DELETE_REQUESTED: handleDeleteRequest,
  PRODUCT_DELETE_CONFIRMED: handleDeleteConfirm,
  PRODUCT_CANCEL_DELETION: handleCancelDelete,
  PRODUCT_EDIT_HOVER: handleEditHover,
  PRODUCT_EDIT_STARTED: handleProductEditStart,
  PRODUCT_UPDATE_SUBMITTED: handleProductUpdateSubmitted,
};
/**
 * Handlers for form-specific UI behaviors and internal state logic.
 * @type {Object.<string, Function>}
 */
const formActions = {
  CLOSE_FORM: handleCloseForm,
  TRIGGER_STATUS_EVENT: onStatusEvent,
  OPEN_ADD_PRODUCT_FORM: handleOpenAddProductForm,
  CREATE_NEW_PRODUCT: handleCreateNewProduct,
};

/**
 * Handlers for table utilities: sorting, searching, and entry points for creation.
 * @type {Object.<string, Function>}
 */
const tableActions = {
  PRODUCT_SORT_CHANGED: handleProductSortChanged,
  SEARCH_PRODUCT_REQUEST: handleSearchProductRequest,
  TABLE_FILTER_REQUEST: handleTableFilterRequest,
};

/**
 * Unified action registry used by the dispatcher to route all application events.
 * Combined from product, form, and table action modules.
 * @type {Object.<string, Function>}
 */
const useAction = {
  ...productActions,
  ...formActions,
  ...tableActions,
};

/**
 * Global dispatcher that routes actions to their respective handlers.
 * Orchestrates state, UI, services, and controller logic based on action type.
 * @param {Object} action - The action object containing type and payload.
 * @param {string} action.type - Unique identifier for the action.
 * @param {any} [action.payload] - Data required for the action.
 * @returns {Promise<void>}
 */
export async function dispatch(action) {
  const actionHandler = useAction[action.type];
  if (!actionHandler) return;
  const context = {
    action,
    states: {
      productUIState,
      productFilterState,
      productFormState,
      productSearchState,
      productSortedState,
    },
    ui: {
      componentUIHandler,
    },
    services: {
      componentServices,
    },
    controller: {
      productOrchestrator,
      createTransformers,
    },
    domain: {
      productData,
    },
    useCases,
    errorHanlders,
    api: { fetchProducts, deleteData, updateProduct, addProduct },
  };
  await actionHandler(context);
}

/**
 * ==================================================
 *             3. ACTION HANDLERS
 *  - Detailed logic implementation for each
 *  - specific action type.
 * ==================================================
 */

/* ======== 1. PRODUCT UPDATE SUBMITTED ======== */
/**
 * Captures the ID of the product intended for deletion to prepare for confirmation.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.action - Contains the payload with the target product ID.
 * @param {Object} params.states - Application states.
 */
function handleDeleteRequest({ action, states }) {
  const { productUIState } = states;
  productUIState.deleteId = action.payload.id;
}

/* ======== 2. PRODUCT DELETE CONFIRM ======== */

/**
 * Executes the final deletion of a product and refreshes the management table.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.states - Application states for tracking deletion ID and current list.
 * @param {Object} params.ui - UI handlers for visual feedback.
 * @param {Object} params.controller - Business logic orchestrators.
 * @returns {Promise<void>}
 */

async function handleDeleteConfirm({
  action,
  states,
  ui,
  services,
  controller,
  useCases,
  api: { fetchProducts, deleteData },
}) {
  const { productUIState } = states;
  const { componentUIHandler } = ui;
  const { productOrchestrator, createTransformers } = controller;
  const {
    componentServices: { productTableServices },
  } = services;

  const deleteId = productUIState.deleteId;
  await deleteData(deleteId);
  await fetchProducts();

  const transformers = createTransformers();
  const list = transformers.reduce(
    (list, transformer) => transformer(list),
    productOrchestrator.getProductList(),
  );

  const withoutDeleted = list.filter((item) => item.id !== deleteId);

  await productOrchestrator.refreshProductListWithState(withoutDeleted);
}

/* ======== 3. PRODUCT CANCEL DELETION ======== */
/**
 * Resets the UI state for a product row and clears the pending deletion ID.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.action - The action object containing the reset state in payload.
 * @param {Object} params.states - Application states to clear the pending ID.
 * @param {Object} params.ui - UI handlers to revert row styling.
 */
function handleCancelDelete({ action, states, ui }) {
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const { productUIState } = states;

  productTableUI.setPendingProductRowUIState(
    productUIState.deleteId,
    action.payload.action,
  );
  productUIState.deleteId = null;
}

/* ======== 4. PRODUCT EDIT HOVER  ======== */
/**
 * Handles hover effects on product table rows, ensuring visual states don't conflict with active editing.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.action - Action containing product ID, UI action type, and event type.
 * @param {Object} params.states - Application states to check the current form status.
 * @param {Object} params.ui - UI handlers for row state manipulation.
 */
function handleEditHover({ action, states, ui }) {
  const { productUIState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;

  if (productUIState.onEditForm) return;
  productTableUI.setPendingProductRowUIState(
    action.payload.id,
    action.payload.action,
    action.payload.eventType,
  );
}

/* ======== 5. PRODUCT CLOSE FORM EDIT ======== */
/**
 * Closes the product form and resets associated UI highlighting and interaction states.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.states - Application states for tracking edit mode.
 * @param {Object} params.ui - UI handlers for table row manipulation.
 * @param {Object} params.services - Component services for form visibility.
 */
function handleCloseForm({ action, states, ui, services }) {
  const { productUIState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productFormServices },
  } = services;

  productFormServices.hideForm();
  if (!productUIState.editId) return;
  productTableUI.hideHighlightEditRow(productUIState.editId);
  productUIState.onEditForm = false;
}

/* ======== 6. PRODUCT EDIT STARTED ======== */
/**
 * Initiates the product editing process, deciding whether to resume a draft or load fresh data.
 * Updates interaction states and highlights the active row in the table.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.action - Contains product data and ID for editing.
 * @param {Object} params.states - Application states for draft and mode tracking.
 * @param {Object} params.ui - UI handlers for row highlighting.
 * @param {Object} params.services - Component services to manage form visibility and data.
 */
function handleProductEditStart({ action, states, ui, services }) {
  const { productUIState, productFormState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productFormServices },
  } = services;

  if (
    productFormState.onDraft &
    (productFormState.mode === "editing" &&
      action.payload.id === productUIState.editId)
  ) {
    productFormServices.openEditFormWithState(action.payload.product);
  } else {
    productFormServices.openEditFormFresh(action.payload.product);

    productFormState.onDraft = true;
    productFormState.mode = "editing";
    productUIState.editId = action.payload.id;
  }
  productUIState.onEditForm = true;
  productTableUI.showHighlightEditRow(action.payload.id);
}

/* ======== 7. PRODUCT UPDATE SUBMITTED ======== */

//INTERNAL HELPER

/**
 * Handles the loading state and executes the update API call.
 * @async
 * @param {string|number} editId - The ID of the product being updated.
 * @param {Object} data - The new product data.
 * @returns {Promise<void>}
 */
async function submitUpdateAndRefresh({
  editId,
  data,
  toastServices,
  updateProduct,
}) {
  toastServices.showLoading();
  await updateProduct(editId, data);
  await fetchProducts();
  toastServices.hideLoading();
}

/**
 * Resets the UI and state after a successful update.
 * @param {Object} params
 * @param {string|number} params.editId - The ID of the product.
 * @param {Object} params.productUIState - Contain state of the editing process.
 * @param {Object} params.productTableUI - UI utilities for the product table.
 * @param {Object} params.productFormServices - Service handling form visibility.
 * @param {Object} params.productFormState - Contain state of form for reset.
 */
function cleanupAfterUpdate({
  editId,
  productUIState,
  productTableUI,
  productFormServices,
  productFormState,
}) {
  productTableUI.hideHighlightEditRow(editId);
  productUIState.editId = null;
  productFormServices.hideForm();
  productFormState.reset();
}

/**
 * Processes raw form data to identify changes and prepare data for update.
 * Normalizes types, computes the difference from the current product, and extracts changed raw values.
 * @param {Object} rawData - The raw input data from the form.
 * @param {Object} currentProduct - The existing product data before editing.
 * @returns {Object} An object containing normalizedData, changedFields, and changedRawData.
 */
function prepareUpdateData(rawData, currentProduct, productData) {
  const normalizedData = productData.normalizeFormDataTypes(rawData);
  const changedFields = productData.diffFields(currentProduct, normalizedData);
  const changedRawData = productData.pickFields(changedFields, rawData);

  return { normalizedData, changedFields, changedRawData };
}

//MAIN HANLDER
/**
 * Processes the product update submission.
 * Validates changed fields, handles API submission, resets form state,
 * and refreshes the UI to reflect changes.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.action - Submission action.
 * @param {Object} params.states - Module states (interaction and product list).
 * @param {Object} params.ui - UI handlers for table feedback.
 * @param {Object} params.services - Services for form data, validation, and toasts.
 * @param {Object} params.controller - Orchestrator for data refreshing.
 * @returns {Promise<void>}
 */
async function handleProductUpdateSubmitted({
  action,
  states,
  ui,
  services,
  controller,
  domain: { productData },
  api: { updateProduct, fetchProducts },
}) {
  const { productUIState, productFormState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productFormServices, toastServices },
  } = services;

  const { productOrchestrator, createTransformers } = controller;
  const editId = productUIState.editId;

  const productList = productOrchestrator.getProductList();

  // 1. Prepare and detect changes
  const rawData = productFormServices.getFormData();
  const currentProduct = productList.find((item) => item.id === editId);

  const { normalizedData, changedFields, changedRawData } = prepareUpdateData(
    rawData,
    currentProduct,
    productData,
  );

  // 2. Validate only changed data
  const currentNameProductList = productData.getNameProductList(productList);
  const results = productFormServices.validateData(
    changedRawData,
    currentNameProductList,
  );
  productFormServices.syncValidationUI(results);
  if (!results.isValid) {
    toastServices.showError("Data invalid! Check your form");
    return;
  }

  // 3. Submit update request and refresh product data from server
  await submitUpdateAndRefresh({
    editId,
    data: normalizedData,
    toastServices,
    updateProduct,
    fetchProducts,
  });

  // 4. Reset UI and interaction state after update
  cleanupAfterUpdate({
    editId,
    productUIState,
    productTableUI,
    productFormServices,
    productFormState,
  });

  // 5. Define transformation pipeline (search → filter → sort)
  const transformers = createTransformers();

  //6. Build final display list from base data through pipeline
  const list = transformers.reduce(
    (list, transformer) => transformer(list),
    productOrchestrator.getProductList(),
  );

  // 7. Render updated list in original order context
  productTableUI.renderRawOrderOfList(list);

  // 8. Show success notification
  toastServices.showUpdateSuccess();

  // 9. Highlight the updated row in UI
  productTableUI.highlightUpdatedRow(editId);
}

/* ======== 8. PRODUCT SORT CHANGED ======== */
/**
 * Updates the sorting strategy and re-renders the table based on the current context (searching/filtering).
 * @param {Object} params - The dispatch context.
 * @param {Object} params.action - Action containing the new sortStrategy.
 * @param {Object} params.states - Application states to track search results and sort strategies.
 * @param {Object} params.ui - UI handlers to render the re-ordered list.
 * @param {Object} params.services - Table services for filtering and sorting logic.
 */

function handleProductSortChanged({
  action,
  states,
  ui,
  services,
  controller: { productOrchestrator, createTransformers },
}) {
  const { productSortedState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productTableServices },
  } = services;

  // Update sorting state
  productSortedState.sortPriceStrategy = action.payload.sortStrategy;

  // 5. Define transformation pipeline (search → filter → sort)
  const transformers = createTransformers();
  //6. Build final display list from base data through pipeline
  const list = transformers.reduce(
    (list, transformer) => transformer(list),
    productOrchestrator.getProductList(),
  );
  // Render the final sorted and filtered list
  productTableUI.renderRawOrderOfList(list);
}

/* ======== 9. PRODUCT SEARCH REQUEST ======== */
/**
 * Resolve search result from keyword.
 *
 * @param {string} searchValue
 * @param {Array<Object>} list
 * @returns {{ state: 'NOT_FOUND' | 'EMPTY' | 'DEFAULT', list: Array<Object> }}
 *
 * - NOT_FOUND: keyword present, no match → []
 * - EMPTY: no keyword → original list
 * - DEFAULT: keyword present, has match → filtered list
 */
function resolveProductSearch({ searchValue, list, useCases }) {
  const { state, list: searchList } = useCases.resolveProductSearch(
    searchValue,
    list,
  );

  const mapping = {
    NOT_FOUND: { isSearching: true, resultList: [] },
    EMPTY: { isSearching: false, resultList: searchList },
    DEFAULT: { isSearching: true, resultList: searchList },
  };

  return mapping[state] || mapping.DEFAULT;
}

/**
 * Handles product search requests by filtering the master list and performing a keyword search.
 * Manages both internal search state and UI transitions between results and "Not Found" states.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.action - Contains the search input value.
 * @param {Object} params.states - Application states for tracking master list and search results.
 * @param {Object} params.ui - UI handlers to toggle between table rows and empty states.
 * @param {Object} params.services - Table services for filtering logic.
 */
function handleSearchProductRequest({
  action,
  states,
  ui,
  services,
  useCases,
  controller: { productOrchestrator },
}) {
  const { productSearchState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productTableServices },
  } = services;

  // Define transformation pipeline (filter → sort)
  const transformers = [
    (list) => productOrchestrator.applyFilter(list),
    (list) => productOrchestrator.applySortedType(list),
  ];
  // Build base list after applying filter and sort
  const list = transformers.reduce(
    (list, transformer) => transformer(list),
    productOrchestrator.getProductList(),
  );

  // Resolve search state and compute matching results
  const { isSearching, resultList } = resolveProductSearch({
    searchValue: action.payload.inputValue,
    list,
    useCases,
  });

  // Sync internal search state
  productSearchState.isSearching = isSearching;
  productSearchState.searchResultIds = new Set(
    resultList.map((item) => item.id),
  );
  productSearchState.searchValue = action.payload.inputValue;

  // UI Branching: Show "Not Found" or render the list
  if (isSearching && resultList.length === 0) {
    productTableUI.renderNotFoundState();
  } else {
    productTableUI.renderRawOrderOfList(resultList);
  }
}

/* ======== 10. PRODUCT TABLE FILTER REQUEST ======== */
/**
 * Processes table filtering based on product category.
 * Determines the correct base list (considering active searches and sorting)
 * before applying the category filter and updating the UI.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.action - Contains the filter criteria (productType).
 * @param {Object} params.states - Application states for search results and sorting strategies.
 * @param {Object} params.ui - UI handlers to render the filtered list.
 * @param {Object} params.services - Table services for sorting and filtering logic.
 */
function handleTableFilterRequest({
  action,
  states,
  ui,
  services,
  controller,
}) {
  const { productFilterState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productTableServices },
  } = services;
  const { productOrchestrator, createTransformers } = controller;
  const { productType } = action.payload;

  // Update internal states
  productFilterState.filterType = productType;

  const transformers = createTransformers();

  const list = transformers.reduce(
    (list, transformer) => transformer(list),
    productOrchestrator.getProductList(),
  );
  // Syncing the length of the filtered results
  productFilterState.filteredCount = list.length;

  // Refresh the table UI with the final list
  productTableUI.renderRawOrderOfList(list);
}

/* ======== 10. STATUS EVENT TRIGGER ======== */
/**
 * Bridges status-related UI events to the form services.
 * Used to trigger logic when a status value (e.g., availability) changes.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.action - Contains the statusValue from the event.
 * @param {Object} params.services - Component services to handle status logic.
 */
function onStatusEvent({ action, services }) {
  const {
    componentServices: { productFormServices },
  } = services;
  const statusValue = action.payload.statusValue;
  productFormServices.triggerStatusEvent(statusValue);
}

/* ======== 10. ADD PRODUCT FORM TRIGGER ======== */
/**
 * Opens the product creation form, handling both fresh starts and resuming drafts.
 * Ensures the correct form mode ("adding") is set and tracked in the interaction state.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.states - Application states to track current form mode and draft status.
 * @param {Object} params.services - Component services to control form visibility and state.
 */
function handleOpenAddProductForm({ states, services }) {
  const {
    componentServices: { productFormServices },
  } = services;
  const { productFormState } = states;
  if (productFormState.onDraft & (productFormState.mode === "adding")) {
    productFormServices.openAddFormWithState();
  } else {
    productFormServices.openAddFormFresh();
    productFormState.onDraft = true;
    productFormState.mode = "adding";
  }
}

/* ======== 10. CREATE NEW PRODUCT ======== */
/**
 * Derive search result list from current product state.
 *
 * Applies filter + sort pipeline, then resolves search result.
 *
 * @returns {Array<Object>} Filtered & searched product list
 */
function deriveSearchList({
  productOrchestrator,
  useCases,
  productSearchState,
}) {
  const transformers = [
    (list) => productOrchestrator.applyFilter(list),
    (list) => productOrchestrator.applySortedType(list),
  ];

  const list = transformers.reduce(
    (list, fn) => fn(list),
    productOrchestrator.getProductList(),
  );

  const { list: searchList } = useCases.resolveProductSearch(
    productSearchState.searchValue,
    list,
  );

  productSearchState.searchResultIds = new Set(
    searchList.map((item) => item.id),
  );
  return searchList;
}

/**
 * Find the newly added product by comparing previous IDs.
 *
 * @param {Set<string|number>} prevIds - IDs before update
 * @param {Array<Object>} list - Current product list
 * @returns {Object|undefined} The new product (if found)
 */
function findNewProduct(prevIds, list) {
  return list.find((item) => !prevIds.has(item.id));
}
/**
 * Clean up the UI and refresh the product list after a successful creation.
 * Hides the form and loading indicators, updates the list via the orchestrator,
 * and displays a success notification.
 * @param {Object} params - The cleanup context.
 * @param {Object} params.productFormServices - Services to manage form visibility.
 * @param {Object} params.toastServices - Services for notifications and loading states.
 * @param {Object} params.productOrchestrator - Orchestrator to trigger data re-fetching.
 * @returns {Promise<void>}
 */
async function refreshAfterCreation({
  states: { productSearchState },
  componentServices: { productFormServices, toastServices },
  componentUIHandler: { productTableUI },
  controller: { productOrchestrator, createTransformers },
  api: { fetchProducts },
  useCases,
}) {
  const previousProductIds = new Set(
    productOrchestrator.getProductList().map((item) => item.id),
  );

  await fetchProducts();
  productFormServices.hideForm();
  toastServices.hideLoading();

  // handle list for display
  const currentProductList = productOrchestrator.getProductList();

  const newlyAddedProduct = findNewProduct(
    previousProductIds,
    currentProductList,
  );

  const searchList = deriveSearchList({
    productOrchestrator,
    useCases,
    productSearchState,
  });
  productTableUI.renderRawOrderOfList(searchList);
  toastServices.showAddSuccess();

  const isVisible = searchList.some(
    (item) => item.id === newlyAddedProduct?.id,
  );

  isVisible && productTableUI.highlightAddedRow(newlyAddedProduct.id);
}
/**
 * Processes the creation of a new product.
 * Validates input, handles the API submission with loading states,
 * resets the form, and triggers visual feedback for the newly added item.
 * @param {Object} params - The dispatch context.
 * @param {Object} params.states - Application states for comparing product lists.
 * @param {Object} params.ui - UI handlers for row highlighting.
 * @param {Object} params.services - Services for validation, data normalization, and notifications.
 * @param {Object} params.controller - Orchestrator to refresh data after creation.
 * @returns {Promise<void>}
 */
async function handleCreateNewProduct({
  states,
  ui,
  services,
  controller,
  useCases,
  domain: { productData },
  errorHanlders,
  api: { addProduct, fetchProducts },
}) {
  const { productFormState } = states;
  const {
    componentServices: { productFormServices, toastServices },
  } = services;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const { productOrchestrator } = controller;

  // 1. Validation logic
  const data = productFormServices.getFormData();
  const currentNameProductList = productData.getNameProductList(
    productOrchestrator.getProductList(),
  );
  const results = productFormServices.validateData(
    data,
    currentNameProductList,
  );
  productFormServices.syncValidationUI(results);
  if (!results.isValid) {
    toastServices.showError("Data invalid! Check your form");
    return;
  }

  // 2. Submission and State Management
  productFormState.reset();
  const norminalizeData = productFormServices.normalizeFormDataTypes(data);
  try {
    toastServices.showLoading();
    await addProduct(norminalizeData);

    // 3. Post-creation cleanup and data refresh
    await refreshAfterCreation({
      states,
      componentServices,
      componentUIHandler,
      controller,
      api: { fetchProducts },
      useCases,
    });
  } catch (error) {
    toastServices.hideLoading();
    console.log(error);
    const errorMessage = errorHanlders.getFriendlyErrorMessage(error);
    toastServices.showError(errorMessage);
  }
}
