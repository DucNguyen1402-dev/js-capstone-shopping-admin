/** 
* @typedef {Object} ErrorDetail
 * @property {string} type - The unique identifier for the error type.
 * @property {string} message - The user-friendly error message.
 */

/**
 * Constant object defining all possible stock validation errors.
 * @type {Record<string, ErrorDetail>}
 */

const FIELD_ISSUES = {
  EMPTY: {
    type: "EMPTY",
    message: "Missing stock amount. Please confirm if you want to leave it blank.",
     severity: "warning"
  },
  INVALID_NUMBER: {
    type: "INVALID_NUMBER",
    message: "The stock amount must be a positive number.",
    severity: "error"
  },
  NOT_INTEGER: {
    type: "NOT_INTEGER",
    message: "The stock amount must be an integer.",
    severity: "error"
  },
  TOO_HIGH: {
    type: "TOO_HIGH",
    message: "Large stock amount detected. Are you sure?",
    severity: "warning"
  },
  NEGATIVE_VALUE: {
    type: "NEGATIVE_VALUE",
    message: "The stock amount cannot be negative.",
    severity: "error"
}
};

/**
 * Evaluates the input value against a set of stock validation rules.
 * * @param {string|number} value - The input value to validate.
 * @returns {ErrorDetail | null} The first error object found, or null if the value is valid.
 */
const validateStock = (value) => {
  const numberValue = Number(value);

  const validators = [
    {
      isInvalid: (v) => v === "",
      issue: FIELD_ISSUES.EMPTY
    },
    {
      isInvalid: (_, n) => Number.isNaN(n),
      issue: FIELD_ISSUES.INVALID_NUMBER
    },
    {
      isInvalid: (_, n) => !Number.isInteger(n),
      issue: FIELD_ISSUES.NOT_INTEGER
    },
    {
      isInvalid: (_, n) => n > 10000,
      issue: FIELD_ISSUES.TOO_HIGH
    },
    {
      isInvalid: (_, n) => n < 0,
      issue: FIELD_ISSUES.NEGATIVE_VALUE
    },
  ];

  const firstIssue = validators.find(v => v.isInvalid(value, numberValue));
  return firstIssue ? firstIssue.issue : null;
};


/**
 * Executes the stock validation process and returns a comprehensive validation state.
 * * @param {string|number} value - The raw input value from the UI.
 * @returns {{ isValid: boolean, error: ErrorDetail | null }} An object containing the validation status and error details.
 */
export function runStockValidation(value){
    const issue = validateStock(value);
    return {
        isValid: !issue,
        issue: issue || null
    };
}

