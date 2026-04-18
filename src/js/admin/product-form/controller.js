import {bindProductFormEvent} from "./events/index.js";
import {setProductFormStateForUpdate} from "./ui.js";


export const productForm = {
   bindEvent: bindProductFormEvent,
   initUpdateVersion: setProductFormStateForUpdate
}