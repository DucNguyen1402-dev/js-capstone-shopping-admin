import { initProductTableEvents } from "./events/index.js";
import { productListTableEl } from "./dom.js";
import { itemActionUI } from "./ui/item-actions.js";
import { modalUI } from "./ui/shared.js";
import { productItemUI } from "./ui/product-item.js";

const uiHandler = {
  itemActionUI,
  modalUI,
  productItemUI
};

/**
 * Orchestrates the initialization of all Table-related events.
 * @description
 * Acts as a bridge to wire UI elements from 'productListTableUI'
 * with the central dispatch logic.
 */
export function initAllProductTableEvents({productState, filterState, filteredList, dispatch}) {
  const context = {
    productState,
    filterState,
    dispatch,
    tableEl: productListTableEl,
    uiHandler,
    filteredList
  };
  initProductTableEvents(context);
}
