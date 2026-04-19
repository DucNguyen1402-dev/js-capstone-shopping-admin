import { initSortPriceBtn } from "./sort-price-btn.js";
import { initDeleteModalEvents } from "./delete-modal.js";
import { initProductActionEvents } from "./item-actions.js";

/**
 * Initializes all event listeners related to the product table and its interactions.
 * * @param {Array<Object>} productState 
 * @param {Function} dispatch - The dispatcher function for handling state or actions.
 */

export function initProductTableEvents(productState, dispatch) {
  initSortPriceBtn(dispatch);
  initDeleteModalEvents(dispatch);
  initProductActionEvents(productState, dispatch);
}
