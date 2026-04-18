import {productFormUI} from "../../dom.js";
import { setProductFormToVisible } from "../../ui.js";


export function bindProductFormCloseEvent() {
  const { closeBtn, productForm } = productFormUI;
  closeBtn.addEventListener("click", () => {
    setProductFormToVisible(productForm, false);
  });
}