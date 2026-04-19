import {productFormUI} from "../../dom.js";
import { setProductFormToVisible } from "../../ui/form.js";

/**
 * Attaches a click event listener to the close button to hide the product form.
 * * @function
 * @description Listens for a click on the close button and toggles 
 * the visibility of the form container to hidden.
 */
export function bindProductFormCloseEvent() {
  const { closeBtn, productForm } = productFormUI;
  closeBtn.addEventListener("click", () => {
    setProductFormToVisible(productForm, false);
  });
}