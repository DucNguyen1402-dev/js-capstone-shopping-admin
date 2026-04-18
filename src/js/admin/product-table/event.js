import {
  getProductListTableDOM,
  getProductFormDOM,
  getProductFormInput,
} from "../dom.js";
import { hideModelState, showModelState } from "./ui/event-ui.js";

// import {
//   bindProductFormStatusInputEvent,
//   bindStockInputEvent,
// } from "../event/product-form.js";
// bindProductFormStatusInputEvent();
// bindStockInputEvent();

/**
 * ======================================
 *   PRODUCT MANAGEMENT UI ELEMENTS
 * ======================================
 */
const productTableUI = getProductListTableDOM();
const productFormUI = getProductFormDOM();
const productFormInputUI = getProductFormInput();

/**
 * =================================
 * PRODUCT FORM EVENT BINDINGS
 * =================================
 */


/**
 * =================================
 *  PRODUCT DELETION LOGIC
 * =================================
 */

function handleModelCancelAction(deleteModel) {
  hideModelState(deleteModel);
}

function handleModelConfirmAction(actionEl, deleteModel) {
  const productRow = actionEl.closest(".product-row");
  productRow.remove();
  hideModelState(deleteModel);
}

function handleRemoveAction(
  actionEl,
  { productListTable, deleteModel, confirmBtn, cancelBtn },
) {
  showModelState(deleteModel);

  deleteModel.addEventListener("click", (e) => {
    const el = e.target.closest("button");
    if (!el) return;
    const action = el.dataset.action;
    if (action === "cancel") {
      handleModelCancelAction(deleteModel);
    } else if (action === "confirm") {
      handleModelConfirmAction(actionEl, deleteModel);
    }
  });
}

/**
 * =================================
 * CORE PRODUCT EDIT LOGIC
 * =================================
 */

function getProductId(actionEl) {
  const productRowEl = actionEl.closest(".product-row");
  return productRowEl.dataset.productId;
}

function getMatchedProductFromState(productId, productList) {

  const matchedProduct = productList.find(
    (product) => Number(product.id) === Number(productId),
  );
  return matchedProduct;
}

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

function fillForm(form, formData) {
  Object.entries(formData).forEach(([k, v]) => {
    form[k].value = v ?? "";
  });

  form.stock?.dispatchEvent(new Event("change"));
}

export function handleEditAction(
  actionEl,
  productList,
  productFormUI,
  productFormInputUI,
) {
  const productId = getProductId(actionEl);

  const matchedProduct = getMatchedProductFromState(productId, productList);


  const formData = productToFormModel(matchedProduct);

  fillForm(productFormInputUI, formData);
}

export const triggerEditEvent = {
  editBtn: "[data-action='edit']",
};
/**
 * =================================
 * MAIN MODULE INITIALIZATION
 * =================================
 */

export function initProductListTableEvent(productList) {
  const { productListTable } = productTableUI;
  productListTable.addEventListener("click", (e) => {
    const actionEl = e.target.closest("button");

    if (!actionEl) return;

    const action = actionEl.dataset.action;
    if (action === "delete") {
      handleRemoveAction(actionEl, productTableUI);
    } else if (action === "edit") {
      handleEditAction(
        actionEl,
        productList,
        productFormUI,
        productFormInputUI,
      );
    }
  });
}
