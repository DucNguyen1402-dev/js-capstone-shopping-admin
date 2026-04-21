import {initProductFormEvents} from "./events/index.js";
import {productFormUI, productFormInputUI} from "./dom.js";
/**
 * Hooks the form's internal events to the global controller logic.
 * @description 
 * Acts as the bridge between UI interactions and the central dispatcher. 
 * Only this function needs to be exposed for event initialization.
 * @param {Function} dispatch - The central state/action manager.
 */
export function initAllProductFormEvents(dispatch) {
  initProductFormEvents(dispatch, productFormUI, productFormInputUI);
}


