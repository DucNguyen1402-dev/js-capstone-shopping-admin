import {initFormBtnEvents} from "./form-btn/index.js";
import {initFormInputEvents} from "./form-input/index.js"

/**
 * Bootstraps the complete interaction layer for the product form.
 * @description 
 * Acts as the top-level initializer that aggregates both control-driven 
 * (buttons) and field-driven (inputs) event sequences.
 * @param {Function} dispatch - Central action dispatcher.
 * @param {Object} productFormUI - Mapping for form control elements.
 * @param {Object} productFormInputUI - Mapping for individual input fields.
 */
export function initProductFormEvents(dispatch, productFormUI, productFormInputUI) {
    initFormBtnEvents(dispatch, productFormUI, productFormInputUI);
   initFormInputEvents(productFormInputUI);
 
}

