/**
 * Defines business logic rules for specific fields that return warnings 
 * instead of hard validation errors.
 * 
 * @type {Object.<string, Function>}
 */
const businessRules = {
  /**
   * Checks if a product name already exists in the current list (case-insensitive).
   * 
   * @param {string} value - The product name to check.
   * @param {Object} context - The context containing existing data.
   * @param {string[]} context.currentNameProductList - List of current product names.
   * @returns {Object|null} A warning issue object if duplicated, otherwise null.
   */
  name: (value, context) => {
    const normalize = (str) => str.trim().toLowerCase();
    if (
      context.currentNameProductList.map(normalize).includes(normalize(value))
    ) {
      return {
        issue: {
          severity: "warning",
          message: `A product with this name already exists. Please confirm if your want to continue.`,
        },
      };
    }
    return null;
  },
};

/**
 * Retrieves the current warning consent status from an input's data attributes.
 * 
 * @param {string} field - The unique identifier for the data-field-input attribute.
 * @returns {string|undefined} The value of the warning-consent dataset property.
 */
function getWarningConsent(field) {
  const input = document.querySelector(`[data-field-input = ${field}]`);
  return input.dataset.warningConsent;
}

/**
 * Validates product form data by executing input-specific validators and business rules.
 * Categorizes results into errors, warnings (with consent checks), and valid states.
 * 
 * @param {Object} params - The validation parameters.
 * @param {Object} params.data - The normalized form data to validate.
 * @param {string[]} params.currentNameProductList - List of existing product names for duplication checks.
 * @param {Object} serviceContext - The service context containing validators and state.
 * @returns {Object} An object containing the overall validity status and detailed input results.
 */
export function validateData({ data, currentNameProductList }, serviceContext) {
  const { inputValidators, productState, inputUIHandlerMaping } =
    serviceContext;
  const results = {
    isValid: true,
    inputs: {
      error: [],
      warning: [],
      valid: [],
    },
  };
  for (const key in data) {
    const value = data[key];
    const validationFn = inputValidators[key];
    const validationResult = validationFn(value);
    const severity = validationResult.issue?.severity;

    // Handle standard validation errors
    if (severity === "error") {
      results.inputs.error.push({ result: validationResult, field: key });
      results.isValid = false;
      continue;
    }

    const warningConsent = getWarningConsent(key) === "true";

    // Handle standard validation warnings
    if (severity === "warning") {
      results.inputs.warning.push({
        result: validationResult,
        field: key,
        hasConfirm: warningConsent,
      });

      if (!warningConsent) results.isValid = false;
      continue;
    }

    const businessFn = businessRules[key];

    // Execute additional business logic rules (e.g., uniqueness)
    if (businessFn) {
      const businessResult = businessFn(value, {currentNameProductList});

      if (businessResult) {
        results.inputs.warning.push({
          result: businessResult,
          hasConfirm: warningConsent,
          field: key,
        });

        if (!warningConsent) results.isValid = false;
      } else {
        results.inputs.valid.push({
          result: validationResult,
          field: key,
        });
      }
      continue;
    }
   // Mark as valid if no errors, warnings, or business rule violations found
    results.inputs.valid.push({
      result: validationResult,
      field: key,
    });
  }
  return results;
}
