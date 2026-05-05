import { getProductFormElements, getProductFormInputElements , getToastNotificationElements} from "../dom-factory.js";
export {productState} from "../../index.js";
/**
 * The main container elements for the product form UI.
 * @type {Object}
 */
export const productFormEl = getProductFormElements();

/**
 * The specific input elements within the product form.
 * @type {Object}
 */
export const productFormInputEl = getProductFormInputElements();
export const toastNotificationEl = getToastNotificationElements();