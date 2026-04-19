import { $ } from "../shared/dom-utils.js";

export function getDropdownButtonDOM() {
  return {
    dropDownOpen: $(".js-open-btn"),
    dropDownClose: $(".js-close-btn"),
    dropDownMenu: $(".js-dropdown-mobile"),
  };
}

export function getProductListTableDOM() {
  return {
    productListTable: $(".js-products-list-table"),
    deleteModal: $(".js-delete-modal"),
    confirmBtn: $(".js-delete-modal").querySelector('[data-action="confirm"]'),
    cancelBtn: $(".js-delete-modal").querySelector('[data-action="cancel"]'),
    sortPriceBtn: $(".js-sort-price-btn"),
    sortPriceIcon: $(".js-sort-icon")
  };
}

export function getProductFormDOM() {
  return {
    productForm: $(".js-product-form"),
    submitBtn: $(".js-product-submit-btn"),
    updateBtn: $(".js-product-update-btn"),
    resetBtn: $(".js-product-reset-btn"),
    closeBtn: $(".js-product-form-close-btn"),
    title: $(".js-product-form-title "),
  };
}

export function getToastNotificationDOM() {
  return {
    container: $("[data-toast-container]"),
    loading: $("[data-toast='loading']"),
    add: $("[data-toast='add']"),
    update: $("[data-toast='update']"),
  };
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
