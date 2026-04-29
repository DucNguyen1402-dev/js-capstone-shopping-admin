import {initProductFormCloseEvent} from "./close-btn.js";
import {initUpdateBtnEvent} from "./update-btn.js";
import {initResetBtnEvent} from "./reset-btn.js";

/**
 * Initializes form control and action-trigger events.
 * @description 
 * Sets up listeners for high-level form operations (close, submit, reset). 
 * Distinct from field-level input validation or change events.
 * @param {Function} dispatch - Central action dispatcher.
 * @param {Object} productFormUI - UI elements mapping for the form.
 */
export function initFormBtnEvents(dispatch, productFormUI, productFormInputUI) {
  initProductFormCloseEvent(dispatch, productFormUI);
  initUpdateBtnEvent(dispatch, productFormUI);
  initResetBtnEvent(productFormUI, productFormInputUI);
}
