/**
 * =======================================
 *       1. REMOVE HANLDER
 * =======================================
 */
/**
 * Handles the click event for the delete button.
 * Shows the confirmation modal and dispatches the product ID to be prepared for deletion.
 * * @param {HTMLElement} actionEl - The button element that was clicked.
 * @param {HTMLElement} deleteModal - The delete confirmation modal element.
 * @param {Function} dispatch - The dispatcher function to handle state updates.
 */
function handleRemoveAction(actionEl, deleteModal, dispatch, modalUI) {
  modalUI.showModalState(deleteModal);
  const productItem = actionEl.closest(".product-item");
  const productId = productItem.dataset.productId;
  dispatch({
    type: "PRODUCT_DELETE_REQUESTED",
    payload: { id: productId },
  });
}

/**
 * =======================================
 *          2. EDIT HANLDER
 * =======================================
 */
/**
 * Searches for a specific product in the list based on its ID.
 * * @param {string|number} productId - The ID of the product to find.
 * @param {Array<Object>} productList - The array of product data objects.
 * @returns {Object|undefined} The matched product object or undefined if not found.
 */
function getMatchedProductFromState(productId, productState) {
  const matchedProduct = productState.list.find(
    (product) => Number(product.id) === Number(productId),
  );
  return matchedProduct;
}

/**
 * Handles the click event for the edit button.
 * Finds the corresponding product data and dispatches an EDIT action.
 * * @param {HTMLElement} actionEl - The button element that was clicked.
 * @param {Array<Object>} productList - The current list of products.
 * @param {Function} dispatch - The dispatcher function to trigger the edit mode.
 */
export function handleEditAction(
  actionEl,
  productState,
  dispatch,
  itemActionUI,
) {
  const productId = itemActionUI.getProductId(actionEl);
  const matchedProduct = getMatchedProductFromState(productId, productState);
  dispatch({
    type: "PRODUCT_EDIT_STARTED",
    payload: { product: matchedProduct, id: productId},
  });

}

/**
 * =======================================
 *    2. HOVER SIMULATOR HANDLER
 * =======================================
 */

/**
 * Resolves the necessary DOM context for delete-related hover events.
 * @description
 * Orchestrates multiple UI services to gather the product row and its
 * associated action buttons based on the triggered element.
 * @param {HTMLElement} actionEl - The element that triggered the event (e.g., Delete btn).
 * @param {Object} uiServices - Combined UI interfaces (productItemUI, itemActionUI).
 * @returns {Object} Context containing the product row and action buttons.
 */
function getDeleteHoverContext(actionEl, { productItemUI, itemActionUI }) {
  const productId = itemActionUI.getProductId(actionEl);
  const product = productItemUI.getProductItemById(productId);
  const actionBtns = itemActionUI.getActionBtns(product);
  return { product, actionBtns };
}

/**
 * Core logic for toggling the visual state of a product row during hover.
 * @description
 * Shared by both enter and leave events. It delegates styling to
 * specialized UI services based on the dynamic 'eventType'.
 */
const handler = (
  { actionBtns, product },
  { itemActionUI, productItemUI },
  action,
  eventType,
) => {
  itemActionUI.setActionButtonsContrast(actionBtns, eventType);
  productItemUI.applyActionFeedbackUI(product, action, eventType);
};

/**
 * Immutable strategy for delete-hover interactions.
 * @description
 * Maps both 'mouseenter' and 'mouseleave' to the same transition logic.
 * This ensures perfectly symmetrical UI updates and eases maintenance.
 */
const deleteHoverHandler = Object.freeze({
  mouseenter: handler,
  mouseleave: handler,
});

/**
 * Main entry point for delete hover interactions.
 * @description
 * This is the high-level coordinator called by the event listener.
 * It gathers context first, then delegates styling tasks to the strategy handler.
 * @param {HTMLElement} actionEl - The event target.
 * @param {Object} uiHandler - The UI service bundle.
 * @param {string} eventType - The triggered event name ('mouseenter' | 'mouseleave').
 */
function handleDeleteHover({ actionEl, uiToolkit, action, eventType }) {
  const hoverEl = getDeleteHoverContext(actionEl, uiToolkit);

  deleteHoverHandler[eventType]?.(hoverEl, uiToolkit, action, eventType);
}

/**
 * List of permitted action strings allowed for event delegation.
 * @type {string[]}
 */
const ALLOWED_ACTIONS = ["edit", "delete"];

/**
 * Initializes event delegation for product item actions (Edit/Delete) within the table.
 * * @description Listens for clicks on the table body, filters for buttons with
 * valid 'data-action' attributes, and triggers the appropriate handler.
 * * @param {Array<Object>} productState
 * @param {Function} dispatch - The dispatcher function for state communication.
 */
export function initProductActionEvents({
  productState = {},
  dispatch = {},
  tableEl = {},
  uiToolkit = {},
}) {
  const { productListTable, deleteModal } = tableEl;
  const { modalUI, itemActionUI } = uiToolkit;

  /**
   * Main event delegation for product action buttons (Edit/Delete).
   * @description
   * Intercepts clicks on the table, validates the action type via data-attributes,
   * and dispatches to specific handlers (Remove or Edit).
   */
  productListTable.addEventListener("click", (e) => {
    const actionEl = e.target.closest("button");
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    if (!ALLOWED_ACTIONS.includes(action)) return;

    if (action === "delete") {
      handleRemoveAction(actionEl, deleteModal, dispatch, modalUI);
    } else if (action === "edit") {
      handleEditAction(actionEl, productState, dispatch, itemActionUI);
    }
  });

  /**
   * Global hover delegation for delete warnings.
   * @description
   * Captures mouseenter/mouseleave on delete buttons to trigger visual row highlights.
   * Uses 'true' (Event Capturing) to ensure events are caught early in the DOM tree.
   */
  ["mouseenter", "mouseleave"].forEach((eventName) => {
    productListTable.addEventListener(
      eventName,
      (e) => {
        const actionEl = e.target.closest("button");
        if (!actionEl) return;
        const action = actionEl.dataset.action;
        if(action === "edit"){
          dispatch({
            type: "PRODUCT_EDIT_HOVER",
            payload: {
              id:  itemActionUI.getProductId(actionEl),
              eventType: eventName,
              action: "edit"
            }
          })
          return;
        }
        if (deleteModal.classList.contains("opacity-100")) return;
        const context = { actionEl, uiToolkit, action, eventType: e.type };
        handleDeleteHover(context);
      },
      true,
    );
  });
}
