/**
 * @typedef {Object} IssueDetail
 * @property {string} type - Unique identifier for the issue.
 * @property {string} message - Human-readable message explaining the issue.
 * @property {"error" | "warning"} severity - Severity level: "error" blocks submission, "warning" prompts for confirmation.
 */

/**
 * Validation issues library for Price fields.
 * @type {Record<string, IssueDetail>}
 */
const FIELD_ISSUES = {
  EMPTY: {
    type: "EMPTY",
    message:
      "Please enter a price. This field cannot be left blank.",
    severity: "error",
  },
  INVALID_NUMBER: {
    type: "INVALID_NUMBER",
    message: "Please enter a valid numeric value for the price.",
    severity: "error",
  },
  TOO_HIGH: {
    type: "TOO_HIGH",
    message:
      "This price seems unusually high. Please verify the amount before saving.",
    severity: "warning",
  },
  NEGATIVE_VALUE: {
    type: "NEGATIVE_VALUE",
    message: "Price cannot be a negative value.",
    severity: "error",
  },
  ZERO_PRICE: {
    type: "ZERO_PRICE",
    severity: "warning",
    message: "The price is set to 0. Is this a free product?",
  },
};

/**
 * Validates the price input by checking format, range, and common typos.
 * 
 * @param {string | number} value - The raw price value from the input field.
 * @returns {IssueDetail | null} The first validation issue found, or null if the price is valid.
 */
const validatePrice = (value) => {
  const numberValue = Number(value);

  const validators = [
    {
      isInvalid: (v) => v === "",
      issue: FIELD_ISSUES.EMPTY,
    },
    {
      isInvalid: (_, n) => Number.isNaN(n),
      issue: FIELD_ISSUES.INVALID_NUMBER,
    },
    {
      isInvalid: (_, n) => n < 0,
      issue: FIELD_ISSUES.NEGATIVE_VALUE,
    },
    {
      isInvalid: (_, n) => n === 0,
      issue: FIELD_ISSUES.ZERO_PRICE,
    },
     {
      isInvalid: (_, n) => n > 500000000,
      issue: FIELD_ISSUES.TOO_HIGH,
    },
  ];

  const firstIssue = validators.find((v) => v.isInvalid(value, numberValue));
  return firstIssue ? firstIssue.issue : null;
};

/**
 * Orchestrates price validation and returns a UI-ready status object.
 * 
 * @param {string | number} value - The input value to validate.
 * @returns {{ isValid: boolean, issue: IssueDetail | null, canSubmit: boolean }} 
 * An object containing the validity state, the specific issue detail, and a submission permission flag.
 */
export function runPriceValidation(value) {
  const issue = validatePrice(value);
  return {
    isValid: !issue,
    issue: issue || null,
  };
}
