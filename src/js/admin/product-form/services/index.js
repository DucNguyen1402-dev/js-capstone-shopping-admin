// Group 1: Internal Module Exports
// Exporting internal components (UI, DOM, Logic) to provide resources for other modules.
export * as formUI from "../ui/form.js";
export { productFormEl, productFormInputEl } from "../dom.js";
export { inputValidators } from "../input-validator/index.js";
export { inputUIHandlerMapping } from "../ui/input/index.js";
export { productState } from "../dom.js";

// Group 2: External Entry Exports
// Exporting entry points or services initialized from external sources to modularize business logic.
export {productFormServices} from "./product-form/create-services.js";
export {toastServices} from "./toast.js";


