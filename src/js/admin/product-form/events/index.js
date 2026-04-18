import { bindProductFormCloseEvent } from "./form-btn/close-btn.js";
import { bindProductFormStatusInputEvent } from "./form-input/status.js";
import {bindStockInputEvent} from "./form-input/stock.js";



/**
 * ==============================
 *     . EVENT ORCHESTRATION
 * =================================
 */

export function bindProductFormEvent() {
  
  bindProductFormCloseEvent();
  bindProductFormStatusInputEvent();
  bindStockInputEvent();
}




