import {
  productFormServices,
  toastServices,
} from "../product-form/services/index.js";
import {
  productTableUI,
  productTableServices,
} from "../product-table/index.js";
import * as useCases from "./use-cases/index.js";
import { productState, fetchProducts } from "../index.js";
import { productInteractionState } from "../product-interaction-state.js";
import * as errorHanlders from "../utils/error-handlers.js";
import * as productData from "../domain/productDataUtils.js";

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
  interaction: productInteractionState,

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
  getCurrentFilteredList(list) {
    const filteredList = this.services.getListByFilter(
      this.interaction.filterType,
      list,
    );
    return filteredList;
  },
  getDisplayProducts({
    displayContext,
    services: { productTableServices },
    useCases,
  }) {
    const {
      list,
      interaction: { deleteId, filterType, sortStrategy },
    } = displayContext;

    const withoutDeleted = list.filter((item) => item.id !== deleteId);

    const sorted = productTableServices.getSortedProducts(
      sortStrategy,
      withoutDeleted,
    );

    return filterType === "all"
      ? sorted
      : useCases.getFilterProducts(filterType, sorted);
  },
};

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
      productInteractionState,
      productState,
    },
    ui: {
      componentUIHandler,
    },
    services: {
      componentServices,
    },
    controller: {
      productOrchestrator,
    },
    domain: {
      productData,
    },
    useCases,
    errorHanlders,
    api: { fetchProducts },
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
  const { productInteractionState } = states;
  productInteractionState.deleteId = action.payload.id;
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
  api: { fetchProducts },
}) {
  const { productInteractionState, productState } = states;
  const { componentUIHandler } = ui;
  const { productOrchestrator } = controller;
  const {
    componentServices: { productTableServices },
  } = services;

  await useCases.performDelete(productInteractionState.deleteId);
  await fetchProducts();

  const baseList = productInteractionState.isSearching
    ? productInteractionState.searchResults
    : productState.list;

  const displayContext = {
    list: baseList,
    interaction: {
      deleteId: productInteractionState.deleteId,
      filterType: productInteractionState.filterType,
      sortStrategy: productInteractionState.sortPriceStrategy,
    },
  };

  const finalDisplayList = productOrchestrator.getDisplayProducts({
    displayContext,
    services: { productTableServices },
    useCases,
  });

  await productOrchestrator.refreshProductListWithState(finalDisplayList);
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
  const { productInteractionState } = states;

  productTableUI.setPendingProductRowUIState(
    productInteractionState.deleteId,
    action.payload.action,
  );
  productInteractionState.deleteId = null;
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
  const { productInteractionState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;

  if (productInteractionState.onEditForm) return;
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
  const { productInteractionState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productFormServices },
  } = services;

  productFormServices.hideForm();
  if (!productInteractionState.editId) return;
  productTableUI.hideHighlightEditRow(productInteractionState.editId);
  productInteractionState.onEditForm = false;
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
  const { productInteractionState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productFormServices },
  } = services;

  if (
    productInteractionState.formState.onDraft &
    (productInteractionState.formState.mode === "editing" &&
      action.payload.id === productInteractionState.editId)
  ) {
    productFormServices.openEditFormWithState(action.payload.product);
  } else {
    productFormServices.openEditFormFresh(action.payload.product);

    productInteractionState.formState.onDraft = true;
    productInteractionState.formState.mode = "editing";
    productInteractionState.editId = action.payload.id;
  }
  productInteractionState.onEditForm = true;
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
async function submitUpdate(editId, data, toastServices, useCases) {
  toastServices.showLoading();
  await useCases.submitProductUpdate(editId, data);
  toastServices.hideLoading();
}

/**
 * Resets the UI and state after a successful update.
 * @param {Object} params
 * @param {string|number} params.editId - The ID of the product.
 * @param {Object} params.productInteractionState - Contain state of the editing process.
 * @param {Object} params.productTableUI - UI utilities for the product table.
 * @param {Object} params.productFormServices - Service handling form visibility.
 */
function cleanupAfterUpdate({
  editId,
  productInteractionState,
  productTableUI,
  productFormServices,
}) {
  productTableUI.hideHighlightEditRow(editId);
  productInteractionState.editId = null;
  productFormServices.hideForm();
}

/**
 * Refreshes the product list and displays a success notification.
 * @async
 * @param {Object} componentUIHandler - Utilities for UI manipulation.
 * @returns {Promise<void>}
 */
async function refreshProductList(
  productState,
  productOrchestrator,
  toastServices,
) {
  await productOrchestrator.refreshProductList(productState.list.length);
  toastServices.showUpdateSuccess();
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
  useCases,
  domain: { productData },
}) {
  const { productInteractionState, productState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productFormServices, toastServices },
  } = services;
  const { productOrchestrator } = controller;
  const editId = productInteractionState.editId;

  // 1. Prepare and detect changes
  const rawData = productFormServices.getFormData();
  const currentProduct = productState.list.find((item) => item.id === editId);
  const { normalizedData, changedFields, changedRawData } = prepareUpdateData(
    rawData,
    currentProduct,
    productData,
  );

  // 2. Validate only changed data
  const currentNameProductList = productData.getNameProductList(
    productState.list,
  );
  const results = productFormServices.validateData(
    changedRawData,
    currentNameProductList,
  );
  productFormServices.syncValidationUI(results);
  if (!results.isValid) {
    toastServices.showError("Data invalid! Check your form");
    return;
  }
  // 3. API Submission
  await submitUpdate(editId, normalizedData, toastServices, useCases);

  // 4. State & UI Cleanup
  productInteractionState.formState.reset();
  cleanupAfterUpdate({
    editId,
    productInteractionState,
    productTableUI,
    productFormServices,
  });

  // 5. Refresh and Visual Feedback
  await refreshProductList(productState, productOrchestrator, toastServices);
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
  controller: { productOrchestrator },
}) {
  const { productInteractionState, productState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productTableServices },
  } = services;

  // Update sorting state
  productInteractionState.sortPriceStrategy = action.payload.sortStrategy;

  // Determine the base list: either current search results or the full product list
  const baseList = productInteractionState.isSearching
    ? productInteractionState.searchResults
    : productState.list;

  // Apply current filters to the base list
  const filteredList = productOrchestrator.getCurrentFilteredList(baseList);

  // Apply the sorting strategy to the filtered results
  const sortedList = productTableServices.getSortedProducts(
    action.payload.sortStrategy,
    filteredList,
  );

  // Render the final sorted and filtered list
  productTableUI.renderRawOrderOfList(sortedList);
}

/* ======== 9. PRODUCT SEARCH REQUEST ======== */

//INTERNAL HELPER
/**
 * Processes the search input and returns the appropriate search state and result list.
 * @param {string} inputValue - The search query from the user.
 * @param {Array} filteredList - The product list after applying current filters.
 * @returns {Object} An object containing:
 * @returns {boolean} returns.isSearching - Whether the search mode is active.
 * @returns {Array} returns.resultList - The list of products matching the search/filter criteria.
 */
const getSearchResult = (inputValue, filteredList, useCases) => {
  const { state, list } = useCases.resolveProductSearch(
    inputValue,
    filteredList,
  );

  const mapping = {
    NOT_FOUND: { isSearching: true, resultList: [] },
    EMPTY: { isSearching: false, resultList: filteredList },
    DEFAULT: { isSearching: true, resultList: list },
  };

  return mapping[state] || mapping.DEFAULT;
};

//MAIN HANDLER
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
  const { productInteractionState, productState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productTableServices },
  } = services;

  // Apply filters to the master list before searching
  const filteredList = productOrchestrator.getCurrentFilteredList(
    productState.list,
  );

  const { isSearching, resultList } = getSearchResult(
    action.payload.inputValue,
    filteredList,
    useCases,
  );
  // Sync internal search state
  productInteractionState.isSearching = isSearching;
  productInteractionState.searchResults = resultList;
  // UI Branching: Show "Not Found" or render the list
  if (isSearching && resultList.length === 0) {
    productTableUI.renderNotFoundState();
  } else {
    productTableUI.renderDefaultTableOrder(resultList);
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
function handleTableFilterRequest({ action, states, ui, services, useCases }) {
  const { productInteractionState, productState } = states;
  const {
    componentUIHandler: { productTableUI },
  } = ui;
  const {
    componentServices: { productTableServices },
  } = services;
  const { productType } = action.payload;

  // Determine the source list based on active search or default sorted list
  let baseList = productInteractionState.isSearching
    ? productInteractionState.searchResults
    : productTableServices.getSortedProducts(
        productInteractionState.sortPriceStrategy,
        productState.list,
      );

  // Apply category filter logic
  const finalDisplayList =
    productType === "all"
      ? baseList
      : useCases.getFilterProducts(productType, baseList);

  // Update internal states
  productInteractionState.filterType = productType;

  // Syncing the length of the filtered results
  productInteractionState.filteredCount = finalDisplayList.length;

  // Refresh the table UI with the final list
  productTableUI.renderRawOrderOfList(finalDisplayList);
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
  const { productInteractionState } = states;
  if (
    productInteractionState.formState.onDraft &
    (productInteractionState.formState.mode === "adding")
  ) {
    productFormServices.openAddFormWithState();
  } else {
    productFormServices.openAddFormFresh();
    productInteractionState.formState.onDraft = true;
    productInteractionState.formState.mode = "adding";
  }
}

/* ======== 10. CREATE NEW PRODUCT ======== */

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
  productFormServices,
  toastServices,
  productOrchestrator,
}) {
  productFormServices.hideForm();
  toastServices.hideLoading();

  // Refresh data with the updated list length
  await productOrchestrator.refreshProductList(productState.list.length + 1);
  toastServices.showAddSuccess();
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
}) {
  const { productState } = states;
  const oldList = [...productState.list];
  const {
    componentServices: { productFormServices, toastServices },
  } = services;
  const { productOrchestrator } = controller;
  const {
    componentUIHandler: { productTableUI },
  } = ui;

  // 1. Validation logic
  const data = productFormServices.getFormData();
  const currentNameProductList = productData.getNameProductList(
    productState.list,
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
  productInteractionState.formState.reset();
  const norminalizeData = productFormServices.normalizeFormDataTypes(data);
  try {
    toastServices.showLoading();
    await useCases.performAddProduct(norminalizeData);

    // 3. Post-creation cleanup and data refresh
    await refreshAfterCreation({
      productFormServices,
      toastServices,
      productOrchestrator,
    });
  } catch (error) {
    toastServices.hideLoading();
    const errorMessage = errorHanlders.getFriendlyErrorMessage(error);
    console.log(errorMessage);
    toastServices.showError(errorMessage);
  }
  // 4. Visual feedback for the new entry
  productTableUI.highlightAddedRow({ oldList, newList: productState.list });
}
