import { initSortPriceBtn } from "./sort-price-btn.js";
import { initDeleteModalEvents } from "./delete-modal.js";
import { initProductActionEvents } from "./item-actions.js";
import {initSearchProductInputEvent} from "./search-input.js";
import {initProductTableFilterEvent} from "./list-filter.js";

/**
 * Initializes all event listeners related to the product table and its interactions.
 * * @param {Array<Object>} productState 
 * @param {Function} dispatch - The dispatcher function for handling state or actions.
 */

export function initProductTableEvents(productState, filterState, dispatch) {
  initSortPriceBtn(filterState,  dispatch);
  initDeleteModalEvents(dispatch);
  initProductActionEvents(productState, dispatch);
  initSearchProductInputEvent(dispatch);
  initProductTableFilterEvent(filterState, dispatch );
}
