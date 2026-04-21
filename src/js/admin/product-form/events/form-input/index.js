import { initProductFormStatusInputEvent } from "./status.js";
import { initStockInputEvent } from "./stock.js";
/**
 * Initializes field-level input and validation events.
 * @description
 * Attaches listeners to individual form controls to manage real-time
 * data binding, formatting, and field-specific logic.
 * @param {Object} productFormInputUI - Mapping of input-specific DOM elements.
 */
export function initFormInputEvents(productFormInputUI) {
  initProductFormStatusInputEvent(productFormInputUI);
  initStockInputEvent(productFormInputUI);
}
