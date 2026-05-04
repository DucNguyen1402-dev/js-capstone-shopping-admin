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
  getUpdatedProduct,
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
 *          SERVICE FACTORY
 * ============================================
 */

const createProductFromServices = (serviceContext) => {
  return {
    openEditFormFresh: (product) => {
      initProductFormUpdateVersion(product, serviceContext);
    },
    openEditFormWithState: () => {
      openEditFormWithState(serviceContext);
    },
    openAddFormFresh: () => {
      initProductFormAddVersion(serviceContext);
    },
    openAddFormWithState: () => {
      openAddFormWithState(serviceContext);
    },
    getUpdatedProduct: () => {
      return getUpdatedProduct(serviceContext);
    },
    hideForm: () => {
      hideForm(serviceContext);
    },
    triggerStatusEvent: (value) => {
      triggerStatusEvent(value, serviceContext);
    },
    checkFormExistence: () => {
      checkFormExistence(serviceContext);
    },
    getFormData: () => {
      return getFormData(serviceContext);
    },
    syncValidationUI: (results) => {
      syncValidationUI(results, serviceContext);
    },
    normalizeFormDataTypes: (data) => {
      return normalizeFormDataTypes(data, serviceContext);
    },
    validateData: (data, currentNameProductList) =>{
     return validateData({data, currentNameProductList}, serviceContext);
    }
  };
};

/**
 * ============================================
 *    4. PUBLIC SERVICE INTERFACE (EXPORTS)
 * ============================================
 */

export const productFormServices = createProductFromServices(serviceContext);
