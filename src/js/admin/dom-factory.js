import { $ } from "../shared/dom-utils.js";


/** @type {HTMLElement} Main trigger to open the product creation form. */
export const createProductTriggerBtn = $('[data-action="open-create-product-form"]');


/**
 * Retrieves DOM elements for the mobile navigation dropdown.
 * @returns {Object} Collection of dropdown control elements.
 */
export function getDropdownButtonElements() {
  return {
    dropDownOpen: $(".js-open-btn"),
    dropDownClose: $(".js-close-btn"),
    dropDownMenu: $(".js-dropdown-mobile"),
  };
}


/**
 * Retrieves DOM elements related to the product list and its management tools.
 * @returns {Object} Elements for table, deletion modal, sorting, searching, and filtering.
 */
export function getProductListTableElements() {
  return {
    productListTable: $(".js-products-list-table"),
    deleteModal: $(".js-delete-modal"),
    confirmBtn: $(".js-delete-modal").querySelector('[data-action="confirm"]'),
    cancelBtn: $(".js-delete-modal").querySelector('[data-action="cancel"]'),
    sortPriceBtn: $(".js-sort-price-btn"),
    sortPriceIcon: $(".js-sort-icon"),
    searchInput: $(".js-search-product-input"),
    filterInput: $(".js-filter-product")
  };
}

/**
 * Retrieves DOM elements for the product creation and editing form.
 * @returns {Object} Form container, action buttons, and header elements.
 */
export function getProductFormElements() {
  return {
    productFormContainer: $(".js-product-form-container"),
    form: $(".js-product-form"),
    createBtn: $(".js-product-create-btn"),
    updateBtn: $(".js-product-update-btn"),
    resetBtn: $(".js-product-reset-btn"),
    closeBtn: $(".js-product-form-close-btn"),
    title: $(".js-product-form-title "),
  };
}

/**
 * Retrieves DOM elements for various toast notification states.
 * @returns {Object} Container and specific status toast elements.
 */
export function getToastNotificationElements() {
  return {
    container: $("[data-toast-container]"),
    loading: $("[data-toast='loading']"),
    add: $("[data-toast='add']"),
    update: $("[data-toast='update']"),
    error: $('[data-toast="error"]')
  };
}

/**
 * Retrieves all input fields within the product form.
 * @returns {Object} Collection of form inputs for product specifications.
 */
export function getProductFormInputElements() {
  return {
    name: $(".js-product-name-input"),
    price: $(".js-price-input"),
    image: $(".js-product-image-input"),
    screen: $(".js-product-screen-input"),
    backCamera: $(".js-product-back-camera-input"),
    frontCamera: $(".js-product-front-camera-input"),
    desc: $(".js-product-desc-input"),
    type: $(".js-product-type"),
    stock: $(".js-stock-input"),
    status: $(".js-product-status"),
  };
}
