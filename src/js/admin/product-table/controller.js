import { productListTableEl } from "./dom.js";
import {
  renderRawOrderOfList,
  renderSkeleton,
  renderNotFoundState,
} from "./ui/render.js";

import { itemActionUI } from "./ui/item-actions.js";
import { productItemUI, } from "./ui/product-item.js";

/**
 * UI Service Bundle for the Product Table.
 * @description 
 * Groups sub-modules (Action buttons and Row items) into a single 
 * dependency object to be injected into the main Table UI factory.
 */
const uiToolkit = {
  itemActionUI,
  productItemUI,
};


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
const createProductTableUI = (productListTableEl, uiToolkit) => ({
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
  setPendingProductRowUIState: (deleteId, action, eventType) => {
    setPendingProductRowUIState(deleteId, action, eventType, uiToolkit);
  },
  showHighlightEditRow: (id) => {
    const {productItemUI} = uiToolkit;
     const product = productItemUI.getProductItemById(id);
    productItemUI.setRowEditorialMode(product);
  },
  hideHighlightEditRow: (id) =>{
     const {productItemUI} = uiToolkit;
     const product = productItemUI.getProductItemById(id);
     const actionBtns = itemActionUI.getActionBtns(product);
      itemActionUI.setActionButtonsContrast(actionBtns);
    productItemUI.setRowEditorialMode(product, false);
  },
  highlightUpdatedRow: (id)=>{
    const {productItemUI} = uiToolkit;
    productItemUI.highlightRowChanged(id, "updated");
  },
  highlightAddedRow: ({ oldList, newList }) => {
  const {productItemUI} = uiToolkit;
  const oldIds = new Set(oldList.map(item => item.id));
  const newProduct = newList.find(item => !oldIds.has(item.id));

  productItemUI.highlightRowChanged(newProduct.id, "added");
}
});



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

function setPendingProductRowUIState(
  deleteId,
  action,
  eventType,
  { itemActionUI, productItemUI },
) {
  const product = productItemUI.getProductItemById(deleteId);
  if (!product) return;
  const actionBtns = itemActionUI.getActionBtns(product);

  itemActionUI.setActionButtonsContrast(actionBtns, eventType);
  productItemUI.applyActionFeedbackUI(product, action, eventType);
}


/**
 * Main Product Table UI Instance.
 * @description 
 * Created via a factory function (createProductTableUI) by injecting the 
 * table's root DOM element and the required UI service handlers.
 * Exposes the public API for controlling the entire table component.
 */
export const productTableUI = createProductTableUI(
  productListTableEl,
  uiToolkit,
);
