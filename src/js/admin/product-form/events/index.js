import { bindProductFormCloseEvent } from "./form-btn/close-btn.js";
import { bindProductFormStatusInputEvent } from "./form-input/status.js";
import {bindStockInputEvent} from "./form-input/stock.js";



/**
 * Initializes and binds all event listeners for the Product Form component.
 * * @description 
 * This is the central hub for form-related events. It orchestrates:
 * - Form closing logic.
 * - Dynamic status styling based on selection.
 * - Automatic status updates triggered by stock quantity changes.
 */
export function bindProductFormEvents() {
  
  bindProductFormCloseEvent();
  bindProductFormStatusInputEvent();
  bindStockInputEvent();
}




