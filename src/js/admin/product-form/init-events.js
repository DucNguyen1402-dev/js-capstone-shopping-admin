import {initProductFormEvents} from "./events/index.js";
import {productFormEl, productFormInputEl} from "./dom.js";
import {inputValidators} from "./input-validator/index.js";
import {inputUIHandler} from "./ui/input/index.js";

/**
 * Hooks the form's internal events to the global controller logic.
 * @description 
 * Acts as the bridge between UI interactions and the central dispatcher. 
 * Only this function needs to be exposed for event initialization.
 * @param {Function} dispatch - The central state/action manager.
 */
export function initAllProductFormEvents(dispatch) {
  const contextBtn = {dispatch, productFormEl, productFormInputEl};
  const contextInput ={dispatch, productFormInputEl, inputValidators, inputUIHandler}
  initProductFormEvents(contextBtn, contextInput);
}


