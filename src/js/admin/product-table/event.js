import { productListTableUI } from "./dom.js";
import { hideModelState, showModelState, getProductId } from "./ui/event-ui.js";

/**
 * =================================
 *   2. PRODUCT DELETION LOGIC
 * =================================
 */

function handleModelCancelAction(deleteModel) {
  hideModelState(deleteModel);
}

function handleModelConfirmAction(deleteModel, dispatch) {
  dispatch({
    type: "DELETE_CONFIRM",
  });

  hideModelState(deleteModel);
}

function handleRemoveAction(actionEl, deleteModel, dispatch) {
  showModelState(deleteModel);
  const productItem = actionEl.closest(".product-item");
  const productId = productItem.dataset.productId;
  dispatch({
    type: "DELETE_PREPARE",
    payload: { id: productId },
  });
}

/**
 * =================================
 *    3. CORE PRODUCT EDIT LOGIC
 * =================================
 */



function getMatchedProductFromState(productId, productList) {
  const matchedProduct = productList.find(
    (product) => Number(product.id) === Number(productId),
  );
  return matchedProduct;
}

export function handleEditAction(actionEl, productList, dispatch) {
  const productId = getProductId(actionEl);
  const matchedProduct = getMatchedProductFromState(productId, productList);
  dispatch({
    type: "EDIT",
    payload: { product: matchedProduct },
  });
}

/**
 * =================================
 *   4. MAIN MODULE INITIALIZATION
 * =================================
 */

const ALLOWED_ACTIONS = ["edit", "delete"];

export function initProductListTableEvent(productList, dispatch) {
  const { productListTable, deleteModel } = productListTableUI;

  productListTable.addEventListener("click", (e) => {
    const actionEl = e.target.closest("button");
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    if (!ALLOWED_ACTIONS.includes(action)) return;

    if (action === "delete") {
      handleRemoveAction(actionEl, deleteModel, dispatch);
    } else if (action === "edit") {
      handleEditAction(actionEl, productList, dispatch);
    }
  });
}

export function initDeleteModelEvent(dispatch) {
  const { deleteModel } = productListTableUI;

  deleteModel.addEventListener("click", (e) => {
    const el = e.target.closest("button");
    if (!el) return;
    const action = el.dataset.action;

    if (action === "cancel") {
      handleModelCancelAction(deleteModel, dispatch);
    } else if (action === "confirm") {
      handleModelConfirmAction(deleteModel, dispatch);
    }
  });
}
