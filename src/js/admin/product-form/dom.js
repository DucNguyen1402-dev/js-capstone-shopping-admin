import { getProductFormDOM, getProductFormInputDOM , getToastNotificationDOM} from "../dom-factory.js";
export {productState} from "../index.js";
/**
 * The main container elements for the product form UI.
 * @type {Object}
 */
export const productFormEl = getProductFormDOM();

/**
 * The specific input elements within the product form.
 * @type {Object}
 */
export const productFormInputEl = getProductFormInputDOM();
export const toastNotificationEl = getToastNotificationDOM();