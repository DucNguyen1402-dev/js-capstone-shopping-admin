import { bindProductFormEvent } from "./events/index.js";
import { setProductFormStateForUpdate, fillForm } from "./ui.js";
import { productFormUI, productFormInputUI } from "./dom.js";

function productToFormModel(p) {
  return {
    name: p.id,
    price: p.price,
    image: p.image,
    screen: p.screen,
    backCamera: p.backCamera,
    frontCamera: p.frontCamera,
    decs: p.desc,
    type: p.type.toLowerCase(),
    stock: p.stock,
  };
}

function initProductFormUpdateVersion(product) {
  setProductFormStateForUpdate(productFormUI);

  const formData = productToFormModel(product);

  fillForm(productFormInputUI, formData);
}

export const productForm = {
  bindEvent: bindProductFormEvent,
  handleEdit: initProductFormUpdateVersion,
};
