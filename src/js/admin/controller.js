import { initDropdownMobile } from "./dropdown-mobile/controller.js";
import { productForm } from "./product-form/controller.js";
import { productTable } from "./product-table/controller.js";
import { fetchProducts } from "../product/services/product.js";
import { productState } from "../product/store/product-state.js";
import { getProductFormDOM } from "./dom.js";
import { ACTIONS } from "./action-type.js";

const productFormUI = getProductFormDOM();

function initPageInteractions() {
  initDropdownMobile();
  productForm.bindEvent();

  //....continue
}

async function initProductTablePage() {
  productTable.showSkeleton();
  const productList = await fetchProducts();
  productTable.render(productList);
  productTable.bindProductListTableEvent(productList);
}


export function initDocumentPageEvent() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;

    const action = el.dataset.action;

    if (action === ACTIONS.EDIT) {
      productForm.initUpdateVersion(productFormUI);
    }
  });
}



export function initPage() {
  initProductTablePage();
  initPageInteractions();
  initDocumentPageEvent();
}
