import { initProductTableEvents } from "./events/index.js";
import { productListTableEl } from "./dom.js";
import { itemActionUI } from "./ui/item-actions.js";
import { modalUI } from "./ui/shared.js";
import { productItemUI } from "./ui/product-item.js";

const uiToolkit = {
  itemActionUI,
  modalUI,
  productItemUI,
};

/**
 * Orchestrates the initialization of all Table-related events.
 * @description
 * Acts as a bridge to wire UI elements from 'productListTableUI'
 * with the central dispatch logic.
 */
export function initAllProductTableEvents({
  productState,
  productInteractionState,
  dispatch,
}) {
  const context = {
    productState,
    productInteractionState,
    dispatch,
    tableEl: productListTableEl,
    uiToolkit,
  };
  initProductTableEvents(context);
}
