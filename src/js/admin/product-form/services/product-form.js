import {
  setProductFormStateForUpdate,
  fillForm,
  setProductFormStateForAdd,
  setProductFormToVisible,
} from "../ui/form.js";

import { productFormUI, productFormInputUI } from "../dom.js";

/**
 * ============================================
 *    0. PUBLIC SERVICE INTERFACE (EXPORTS)
 * ============================================
 * @module Services/ProductForm
 * @description
 * Manages the lifecycle, state transitions, and data extraction for the
 * Product Form component. Acts as the primary bridge between the UI
 * implementation and the Main Controller's business logic.
 */

/**
 * High-level API for form operations and data retrieval.
 */
export const productFormServices = {
  showFormEdit: initProductFormUpdateVersion,
  showFormAdd: initProductFormAddVersion,
  getUpdateProduct,
  hideForm,
};

/*=======================================
      1. FORM ADD INITIALIZERS 
=========================================*/

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
    status: p.status
  };
}

/**
 * Orchestrates the UI transition to 'Update Mode'.
 * @description
 * Reveals the form, switches its internal state to update-specific logic,
 * and populates all fields with existing product data.
 * @param {Object} product - The raw product entity to be edited.
 */
function initProductFormUpdateVersion(product) {
  const { productFormContainer } = productFormUI;
  setProductFormToVisible(productFormContainer, true);
  setProductFormStateForUpdate(productFormUI);
  const formData = productToFormModel(product);

  fillForm(productFormInputUI, formData);
}

/*=======================================
    2. FORM UPDATE INITIALIZERS 
=========================================*/

/**
 * Prepares the product form state for adding a new product.
 * * @param {Object} [product] - Optional initial data for the new product.
 */
function initProductFormAddVersion() {
  const { productFormContainer } = productFormUI;
  setProductFormToVisible(productFormContainer, true);
  setProductFormStateForAdd(productFormUI);
}

/*===============================================
      2. DATA EXTRACTION & VISIBILITY CONTROL
================================================*/

/**
 * Definition of the product data schema for consistent extraction.
 */
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

/**
 * Executes a schema-based data extraction from the form UI.
 * @description
 * Iterates through the defined PRODUCT_FIELDS to map DOM values
 * into a structured data object.
 * @returns {Object} A clean product entity for API or state updates.
 */
function getUpdateProduct() {
  return PRODUCT_FIELDS.reduce((acc, key) => {
    acc[key] = productFormInputUI[key].value;
    return acc;
  }, {});
}

/*================================================
       3. FORM VISIBILITY
==================================================*/
/**
 * Resets and conceals the product form interface.
 * @description
 * Executes the visibility transition to hide the form container
 * from the active viewport.
 */
function hideForm() {
  const { productFormContainer } = productFormUI;
  setProductFormToVisible(productFormContainer, false);
}
