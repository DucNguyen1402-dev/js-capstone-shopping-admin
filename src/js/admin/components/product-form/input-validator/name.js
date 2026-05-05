/**
 * @typedef {Object} IssueDetail
 * @property {string} type - Unique identifier for the issue.
 * @property {string} message - Human-readable message explaining the issue.
 * @property {"error" | "warning"} severity - Severity level: "error" blocks submission, "warning" requires confirmation.
 */

/**
 * Validation issues library for Product Name fields.
 * @type {Record<string, IssueDetail>}
 */
const FIELD_ISSUES = {
  EMPTY: {
    type: "EMPTY",
    severity: "error",
    message: "Product name is required. Please enter a name.",
  },
  INVALID_NAME: {
    type: "INVALID_NAME",
    severity: "error",
    message:
      "Special characters are not allowed. Please use only letters and numbers.",
  },
  ONLY_NUMBERS: {
    type: "ONLY_NUMBERS",
    severity: "error",
    message: "Product name must contain at least one letter.",
  },

  TOO_SHORT: {
    type: "TOO_SHORT",
    severity: "warning",
    message: "This name is very short. Please verify if it's correct.",
  },
  TOO_LONG: {
    type: "TOO_LONG",
    severity: "warning",
    message: "This name is unusually long. Are you sure you want to use it?",
  },
};

/**
 * Validates the product name based on predefined format and length rules.
 *
 * @param {string} value - The product name string to be validated.
 * @returns {IssueDetail | null} The first issue encountered, or null if the name passes all checks.
 */
const validateName = (value) => {
  const validators = [
    {
      isInvalid: (value) => value === "",
      issue: FIELD_ISSUES.EMPTY,
    },
    {
      isInvalid: (value) => /[!@#$%^&*(),.?":{}|<>_]/.test(value),
      issue: FIELD_ISSUES.INVALID_NAME,
    },
    {
      isInvalid: (value) => !/[a-zA-ZÀ-ỹ]/.test(value),
      issue: FIELD_ISSUES.ONLY_NUMBERS,
    },
    {
      isInvalid: (value) => value.length < 2,
      issue: FIELD_ISSUES.TOO_SHORT,
    },
    {
      isInvalid: (value) => value.length > 50,
      issue: FIELD_ISSUES.TOO_LONG,
    },
  ];

  const firstIssue = validators.find((v) => v.isInvalid(value));
  return firstIssue ? firstIssue.issue : null;
};

/**
 * Processes name validation and returns a comprehensive status object.
 * Useful for determining UI states like border colors or disabling submit buttons.
 *
 * @param {string} value - The raw input value to process.
 * @returns {{ isValid: boolean, issue: IssueDetail | null, canSubmit: boolean }}
 * An object containing the validity, the specific issue, and a submission flag.
 */
export function runNameValidation(value) {
  const issue = validateName(value);
  return {
    isValid: !issue,
    issue: issue || null,
  };
}
