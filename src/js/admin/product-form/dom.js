import { getProductFormDOM, getProductFormInput , getToastNotificationDOM} from "../dom-factory.js";

/**
 * The main container elements for the product form UI.
 * @type {Object}
 */
export const productFormUI = getProductFormDOM();

/**
 * The specific input elements within the product form.
 * @type {Object}
 */
export const productFormInputUI = getProductFormInput();

export const toastNotificationUI = getToastNotificationDOM();