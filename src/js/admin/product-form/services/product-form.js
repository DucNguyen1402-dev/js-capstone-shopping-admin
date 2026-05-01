import * as formUI from "../ui/form.js";
import { productFormEl, productFormInputEl } from "../dom.js";
import { inputValidators } from "../input-validator/index.js";
import { inputUIHandlerMaping } from "../ui/input/index.js";
import { productState } from "../dom.js";
const context = {
  productFormEl,
  productFormInputEl,
  formUI,
  inputValidators,
  inputUIHandlerMaping,
  productState,
};

/*=========================================================
         1. PRODUCT FORM SERVICE ORCHESTRATOR
===========================================================*/

/*============= 1.1 FORM UPDATE INITIALIZERS ============ */

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
    image: p.img,
    screen: p.screen,
    backCamera: p.backCamera,
    frontCamera: p.frontCamera,
    desc: p.desc,
    type: p.type.toLowerCase(),
    stock: p.stock,
    status: p.status,
  };
}

/**
 * Orchestrates the UI transition to 'Update Mode'.
 * @description
 * Reveals the form, switches its internal state to update-specific logic,
 * and populates all fields with existing product data.
 * @param {Object} product - The raw product entity to be edited.
 */
function initProductFormUpdateVersion(product, { productFormEl, formUI }) {
  const { productFormContainer, form } = productFormEl;
  form.reset();
  formUI.showForm(productFormContainer, true);
  formUI.setUpdateMode(productFormEl);
  const formData = productToFormModel(product);

  setTimeout(() => {
    formUI.fillForm(productFormInputEl, formData);
  }, 0);
}

/*============= 1.2 FORM ADD INITIALIZERS  ============ */
/**
 * Prepares the product form state for adding a new product.
 * * @param {Object} [product] - Optional initial data for the new product.
 */
function initProductFormAddVersion({ productFormEl, formUI }) {
  const { productFormContainer, form } = productFormEl;
  form.reset();
  formUI.showForm(productFormContainer, true);
  formUI.setAddMode(productFormEl);
}

/*============= 1.3 DATA EXTRACTION  ============ */
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
  "desc",
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

const numberFields = new Set(["price", "stock"]);

function isNumberField(key) {
  return numberFields.has(key);
}

function getUpdatedProduct({ productFormInputEl }) {
  return PRODUCT_FIELDS.reduce((acc, key) => {
    if (isNumberField(key)) {
      const value = productFormInputEl[key].valueAsNumber;
      acc[key] = Number.isNaN(value) ? null : value;
    } else {
      acc[key] = productFormInputEl[key].value;
    }
    return acc;
  }, {});
}

/*============= 1.4 FORM VISIBILITY ============ */

/**
 * Resets and conceals the product form interface.
 * @description
 * Executes the visibility transition to hide the form container
 * from the active viewport.
 */
function hideForm({ productFormEl, formUI }) {
  const { productFormContainer } = productFormEl;
  formUI.showForm(productFormContainer, false);
}

function checkFormExistence({ productFormEl }) {
  const { productFormContainer } = productFormEl;
  return productFormContainer.classList.contains("opacity-100");
}

/*============= 1.4 EVENT TRIGGER ============ */
function triggerStatusEvent(value, { productFormInputEl }) {
  const { status } = productFormInputEl;
  status.value = value;
  status.dispatchEvent(new Event("change"));
}

/*============= 1.5 EVENT TRIGGER ============ */
function getFormData({ productFormInputEl }) {
  return PRODUCT_FIELDS.reduce((acc, key) => {
    acc[key] = productFormInputEl[key].value;
    return acc;
  }, {});
}



function normalizeFormDataTypes(data) {
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = isNumberField(key)
      ? Number(data[key])
      : data[key];
    return acc;
  }, {});
}


/*============= 1.6 VALIDATE AND SHOW ERROR  ============ */

let invalidInputs = [];
let validInputs = [];

function validateData(
  data,
  { inputValidators, productState, inputUIHandlerMaping },
) {
  const states = [];
  for (const key in inputValidators) {
    const validationFn = inputValidators[key];
    const inputField = data[key];
    states.push({ result: validationFn(inputField), field: key });
  }

  const hasDuplicated = productState.list.find(
    (item) => item.nameLower === data["name"].toLowerCase(),
  );

  const hasInvalid = states.find((state) => !state.result.isValid);

  if (hasInvalid || hasDuplicated) {
    invalidInputs = states.filter((state) => !state.result.isValid);
    validInputs = states.filter((state) => state.result.isValid);
 hasDuplicated&&  invalidInputs.push({
      result: {
        issue: {
          severity: "warning",
          message:
            "A product with this name already exists. Please check to avoid confusion.",
        },
      },
      field: "name",
    });

    return false;
  }

  resetValidInputState(invalidInputs, inputUIHandlerMaping);
  return true;
}

function resetValidInputState(validInputs, inputUIHandlerMaping) {
  if (validInputs) {
    validInputs.forEach((validInput) => {
      inputUIHandlerMaping[validInput.field].resetValidationMessage(
        validInput.field,
      );
    });
  }
}

function showValidationErrors(validInputs, { inputUIHandlerMaping }) {
  resetValidInputState(validInputs, inputUIHandlerMaping);

  if (invalidInputs) {
    invalidInputs.forEach((invalidInput) => {
      inputUIHandlerMaping[invalidInput.field].renderValidationMessage(
        invalidInput.field,
        invalidInput.result.issue,
      );
    });
  }
}

/**
 * ============================================
 *    2. SERVICE FACTORY
 * ============================================
 */

const createProductFromServices = (context) => {
  return {
    showFormEdit: (product) => {
      initProductFormUpdateVersion(product, context);
    },
    showFormAdd: () => {
      initProductFormAddVersion(context);
    },
    getUpdatedProduct: () => {
      return getUpdatedProduct(context);
    },
    hideForm: () => {
      hideForm(context);
    },
    triggerStatusEvent: (value) => {
      triggerStatusEvent(value, context);
    },
    checkFormExistence: () => {
      checkFormExistence(context);
    },
    getFormData: () => {
      return getFormData(context);
    },
    validateData: (data) => {
      return validateData(data, context);
    },
    showValidationErrors: () => {
      showValidationErrors(invalidInputs, context);
    },
    resetValidationErrors: () => {
      resetValidationErrors(invalidInputs, context);
    },
    normalizeFormDataTypes: (data) =>{
      return normalizeFormDataTypes(data);
    }
  };
};

/**
 * ============================================
 *    3. PUBLIC SERVICE INTERFACE (EXPORTS)
 * ============================================
 */
export const productFormServices = createProductFromServices(context);
