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
export function handleEditAction(actionEl, productState, dispatch, itemActionUI) {
  const productId = itemActionUI.getProductId(actionEl);
  const matchedProduct = getMatchedProductFromState(productId, productState);
  dispatch({
    type: "PRODUCT_EDIT_STARTED",
    payload: { product: matchedProduct, id: productId },
  });
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
  productState ={},
  dispatch ={},
  tableUI ={},
  uiHandler ={},
}) {
  const { productListTable, deleteModal } = tableUI;
  const { modalUI, itemActionUI } = uiHandler;
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
}
