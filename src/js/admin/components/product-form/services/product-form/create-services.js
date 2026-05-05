import {
  formUI,
  productFormEl,
  productFormInputEl,
  inputValidators,
  inputUIHandlerMapping,
  productState,
} from "../index.js";
import { fieldUtils } from "./helper.js";
import { PRODUCT_FIELDS } from "./product-field.js";
import { productToFormModel } from "./product-form-to-model.js";
import {
  validateData,
  getFormData,
  normalizeFormDataTypes,
} from "./core/index.js";
import { triggerStatusEvent } from "./event-trigger/index.js";
import {
  initProductFormUpdateVersion,
  initProductFormAddVersion,
} from "./form-init/index.js";
import {
  checkFormExistence,
  hideForm,
  syncValidationUI,
  openEditFormWithState,
  openAddFormWithState,
} from "./ui/index.js";

const serviceContext = {
  productFormEl,
  productFormInputEl,
  formUI,
  inputValidators,
  inputUIHandlerMapping,
  productState,
  fieldUtils,
  PRODUCT_FIELDS,
  productToFormModel,
};

/**
 * ============================================
 *            1. SERVICES FACTORY
 * ============================================
 */
/**
 * Factory function that creates an object containing services for managing product forms.
 * It encapsulates various form-related operations using the provided service context.
 *
 * @param {Object} serviceContext - The context object containing state and dependencies.
 * @returns {Object} An object containing methods to interact with the product form services.
 */
const createProductFromServices = (serviceContext) => {
  return {
    /**
     * Initializes and opens the edit form with a fresh product instance.
     * @param {Object} product - The product data to populate the form.
     */
    openEditFormFresh: (product) => {
      initProductFormUpdateVersion(product, serviceContext);
    },
    /**
     * Opens the edit form using the current existing state.
     */
    openEditFormWithState: () => {
      openEditFormWithState(serviceContext);
    },
    /**
     * Initializes and opens the form for adding a new product.
     */
    openAddFormFresh: () => {
      initProductFormAddVersion(serviceContext);
    },
    /**
     * Opens the add form using the current existing state.
     */
    openAddFormWithState: () => {
      openAddFormWithState(serviceContext);
    },
    /**
     * Hides the current form.
     */
    hideForm: () => {
      hideForm(serviceContext);
    },
    /**
     * Triggers a status-related event within the form context.
     * @param {*} value - The value associated with the status event.
     */
    triggerStatusEvent: (value) => {
      triggerStatusEvent(value, serviceContext);
    },
    /**
     * Checks for the existence of the form in the current context.
     */
    checkFormExistence: () => {
      checkFormExistence(serviceContext);
    },
    /**
     * Retrieves the current raw data from the form.
     * @returns {Object} The form data.
     */
    getFormData: () => {
      return getFormData(serviceContext);
    },
    /**
     * Synchronizes the validation UI based on the provided validation results.
     * @param {Array|Object} results - The results of the validation process.
     */
    syncValidationUI: (results) => {
      syncValidationUI(results, serviceContext);
    },
    /**
     * Normalizes and casts form data types (e.g., converting strings to numbers).
     * @param {Object} data - The raw form data.
     * @returns {Object} The normalized data.
     */
    normalizeFormDataTypes: (data) => {
      return normalizeFormDataTypes(data, serviceContext);
    },
    /**
     * Validates the provided data against business rules and the current product list.
     * @param {Object} data - The data to be validated.
     * @param {Array<string>} currentNameProductList - A list of existing product names for duplication checks.
     * @returns {Object} The validation results.
     */
    validateData: (data, currentNameProductList) => {
      return validateData({ data, currentNameProductList }, serviceContext);
    },
  };
};

/**
 * ============================================
 *    2. PUBLIC SERVICE INTERFACE (EXPORTS)
 * ============================================
 */
/**
 * Exported instance of product form services, initialized with the current service context.
 * Provides a unified API for managing product form states, validation, and data normalization.
 * 
 * @type {ReturnType<typeof createProductFromServices>}
 */
export const productFormServices = createProductFromServices(serviceContext);
