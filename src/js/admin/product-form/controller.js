import { bindProductFormEvents } from "./events/index.js";
import {
  setProductFormStateForUpdate,
  fillForm,
  setProductFormStateForAdd,
  setProductFormToVisible,
} from "./ui/form.js";

import {
  setToastLoadingToVisible,
  setUpdatePopUpToVisible,
} from "./ui/toast-notification.js";

import {
  productFormUI,
  productFormInputUI,
  toastNotificationUI,
} from "./dom.js";

/**
 * Transforms a raw product object into a data model suitable for form inputs.
 * * @param {Object} p - The raw product object from the data source.
 * @param {string} p.id - The product identifier.
 * @param {number} p.price - The price of the product.
 * @param {string} p.image - The image URL/path.
 * @param {string} p.screen - Screen specifications.
 * @param {string} p.backCamera - Rear camera specifications.
 * @param {string} p.frontCamera - Front camera specifications.
 * @param {string} p.desc - Product description.
 * @param {string} p.type - Product category/type.
 * @param {number} p.stock - Inventory count.
 * @returns {Object} The formatted model for the form.
 */
function productToFormModel(p) {
  return {
    name: p.name,
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

/**
 * Initializes the product form for update mode and populates it with existing data.
 * * @param {Object} product - The product object to be edited.
 */
function initProductFormUpdateVersion(product) {
  const { productForm } = productFormUI;
  setProductFormToVisible(productForm, true);
  setProductFormStateForUpdate(productFormUI);
  const formData = productToFormModel(product);

  fillForm(productFormInputUI, formData);
}

/**
 * Prepares the product form state for adding a new product.
 * * @param {Object} [product] - Optional initial data for the new product.
 */
function initProductFormAddVersion() {
  const { productForm } = productFormUI;
  setProductFormToVisible(productForm, true);
  setProductFormStateForAdd(productFormUI);
}

const PRODUCT_FIELDS = [
  "name",
  "price",
  "image",
  "screen",
  "backCamera",
  "frontCamera",
  "decs",
  "type",
  "stock",
  "status",
];

function getUpdateProduct() {
  return PRODUCT_FIELDS.reduce((acc, key) => {
    acc[key] = productFormInputUI[key].value;
    productFormInputUI[key].value = "";
    return acc;
  }, {});
}

function setProductFormtoHidden() {
  const { productForm } = productFormUI;
  setProductFormToVisible(productForm, false);
}

/**
 * Controller object for managing product form actions.
 * * @type {Object}
 * @property {Function} bindEvent - Method to attach listeners to form elements.
 * @property {Function} handleEdit - Method to trigger update mode.
 * @property {Function} handleAdd - Method to trigger addition mode.
 */
export const productForm = {
  bindEvents: bindProductFormEvents,
  showFormEdit: initProductFormUpdateVersion,
  showFormAdd: initProductFormAddVersion,
  getUpdateProduct: getUpdateProduct,
  hideProductForm: setProductFormtoHidden,
};

function showToastLoading() {
  const { loading } = toastNotificationUI;
  setToastLoadingToVisible(loading, true);
}

function hideToastLoading() {
  const { loading } = toastNotificationUI;
  setToastLoadingToVisible(loading, false);
}


function showUpdatePopup() {
  const { update } = toastNotificationUI;
  setUpdatePopUpToVisible(update, true);

  setTimeout(() => {
    setUpdatePopUpToVisible(update, true);
  }, 2500);
}

export const toastNotification = {
  showUpdatePopup: showUpdatePopup,
  showToastLoading: showToastLoading,
  hideToastLoading: hideToastLoading,
};
