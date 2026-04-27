import { productListTableEl } from "./dom.js";
import {
  renderRawOrderOfList,
  renderSkeleton,
  renderNotFoundState,
} from "./ui/render.js";

import { itemActionUI } from "./ui/item-actions.js";
import { productItemUI } from "./ui/product-item.js";

/**
 * Renders the initial table view with a default sorting order.
 * @description
 * Sorts the provided list by price (descending) as the baseline view
 * before any user interaction. Creates a shallow copy to preserve data integrity.
 * @param {Array} list - The dataset to be rendered initially.
 */
function sortByPriceDesc(list) {
  return [...list].sort((a, b) => b.price - a.price);
}

/**
 * Create Product Table UI bound to given DOM elements.
 *
 * @param {Object} tableElements
 * @returns {{
 *   renderSkeleton: (expectedCount: number) => void,
 *   renderDefaultTableOrder: (list: Array) => void,
 *   renderRawOrderOfList: (list: Array) => void,
 *   renderNotFoundState: () => void
 * }}
 */
const createProductTableUI = (productListTableEl, tableUIHandler) => ({
  renderSkeleton: (expectedCount) => {
    renderSkeleton(expectedCount, productListTableEl);
  },
  renderDefaultTableOrder: (list) => {
    const sortedList = sortByPriceDesc(list);
    renderRawOrderOfList(sortedList, productListTableEl);
  },
  renderRawOrderOfList: (list) => {
    renderRawOrderOfList(list, productListTableEl);
  },
  renderNotFoundState: () => {
    renderNotFoundState(productListTableEl);
  },
  clearPendingDeleteProductRow: (deleteId) => {
    handleClearPendingDeleteProductRow(deleteId, tableUIHandler);
  },
});

const tableUIHandler = {
  itemActionUI,
  productItemUI,
};
export const productTableUI = createProductTableUI(
  productListTableEl,
  tableUIHandler,
);

/**
 * Executes the UI cleanup sequence for a canceled deletion.
 * @description 
 * Coordinates between action buttons and the row container to remove 
 * visual "pending" states. Targeted at specific row components.
 * @param {string|number} deleteId - The unique identifier of the target product.
 * @param {Object} dependencies - UI interfaces for actions and row items.
 * @param {Object} dependencies.itemActionUI - Interface for button-level styling.
 * @param {Object} dependencies.productItemUI - Interface for row-level styling.
 */

function handleClearPendingDeleteProductRow(
  deleteId,
  { itemActionUI, productItemUI },
) {
  const product = productItemUI.getProductItemById(deleteId);
  if (!product) return;
  const actionBtns = itemActionUI.getActionBtns(product);

  itemActionUI.setActionButtonsContrast(actionBtns);
  productItemUI.setDeleteProductRowUI(product);
}
