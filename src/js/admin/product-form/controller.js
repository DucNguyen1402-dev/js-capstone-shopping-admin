import { bindProductFormEvents } from "./events/index.js";
import {
  setProductFormStateForUpdate,
  fillForm,
  setProductFormStateForAdd,
  setProductFormToVisible,
} from "./ui/form.js";
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
  setProductFormStateForUpdate(productFormUI);

  const formData = productToFormModel(product);

  fillForm(productFormInputUI, formData);
}

/**
 * Prepares the product form state for adding a new product.
 * * @param {Object} [product] - Optional initial data for the new product.
 */
function initProductFormAddVersion(product) {
  setProductFormStateForAdd(productFormUI);
}

export function getProductFormInput() {
  return {
    name: $(".js-product-name-input"),
    price: $(".js-price-input"),
    image: $(".js-product-image-input"),
    screen: $(".js-product-screen-input"),
    backCamera: $(".js-product-back-camera-input"),
    frontCamera: $(".js-product-front-camera-input"),
    decs: $(".js-product-desc-input"),
    type: $(".js-product-type"),
    stock: $(".js-stock-input"),
    status: $(".js-product-status"),
  };
}

function getupdateProduct() {
  const {
    name,
    price,
    image,
    screen,
    backCamera,
    frontCamera,
    decs,
    type,
    stock,
    status,
  } = productFormInputUI;
  return {
    name: name.value,
    price: price.value,
    image: image.value,
    screen: screen.value,
    backCamera: backCamera.value,
    frontCamera: frontCamera.value,
    decs: decs.value,
    type: type.value,
    stock: stock.value,
    status: status.value,
  };
}

function setLoadingStateToVisible() {
  const { loading } = toastNotificationUI;
  loading.classList.remove("hidden");
}

function setLoadingStateToHidden() {
  const { loading } = toastNotificationUI;
  loading.classList.add("hidden");
}
function setProductFormtoHidden() {
  const { productForm } = productFormUI;
  setProductFormToVisible(productForm, false);
}

function showUpdatePopup(){
  const {update} = toastNotificationUI;
  update.classList.remove("opacity-0");
  setTimeout(()=>{
     update.classList.add("opacity-0");
  },3000);
}
/**
 * Controller object for managing product form actions.
 * * @type {Object}
 * @property {Function} bindEvent - Method to attach listeners to form elements.
 * @property {Function} handleEdit - Method to trigger update mode.
 * @property {Function} handleAdd - Method to trigger addition mode.
 */
export const productForm = {
  bindEvent: bindProductFormEvents,
  showFormEdit: initProductFormUpdateVersion,
  showFormAdd: initProductFormAddVersion,
  getUpdateProduct: getupdateProduct,
  showToastLoading: setLoadingStateToVisible,
  hideToastLoading: setLoadingStateToHidden,
  setProductFormToHidden: setProductFormtoHidden,
  showUpdatePopup: showUpdatePopup
};
