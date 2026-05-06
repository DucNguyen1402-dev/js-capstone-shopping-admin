/**
 * @typedef {Object} IssueDetail
 * @property {string} type - Unique identifier for the issue.
 * @property {string} message - Human-readable message explaining the issue.
 * @property {"error" | "warning"} severity - Severity level: "error" blocks submission, "warning" requires confirmation.
 */

/**
 * Validation issues library for Product back camera fields.
 * @type {Record<string, IssueDetail>}
 */

const FIELD_ISSUES = {
  EMPTY: {
    type: "EMPTY",
    severity: "error",
    message: "Back camera specs cannot be empty."
  },
  INVALID_FORMAT: {
    type: "INVALID_FORMAT",
    severity: "error",
    message: "Invalid characters in back camera specs. Please use numbers, letters, and symbols like f/, +, or MP."
  },
  TOO_LONG: {
    type: "TOO_LONG",
    severity: "warning",
    message: "Back camera description is too detailed. Please keep it concise."
  }
};

/**
 * Validates the product screen based on predefined format and length rules.
 *
 * @param {string} value - The product image string to be validated.
 * @returns {IssueDetail | null} The first issue encountered, or null if the screen passes all checks.
 */
const validateBackCamera = (value) => {
  const validators = [
    {
      isInvalid: (value) => value === "",
      issue: FIELD_ISSUES.EMPTY,
    },
    {
      isInvalid: (value) => !/^[a-zA-ZÀ-ỹ0-9\s.,"'xX\-+\/()]*$/.test(value),
      issue: FIELD_ISSUES. INVALID_FORMAT,
    },
    {
      isInvalid: (value) => value.length > 150,
      issue: FIELD_ISSUES. TOO_LONG,
    },
  ];


  const firstIssue = validators.find((v) => v.isInvalid(value));
  return firstIssue ? firstIssue.issue : null;
};

/**
 * Processes back camera validation and returns a comprehensive status object.
 * Useful for determining UI states like border colors or disabling submit buttons.
 *
 * @param {string} value - The raw input value to process.
 * @returns {{ isValid: boolean, issue: IssueDetail | null, canSubmit: boolean }}
 * An object containing the validity, the specific issue, and a submission flag.
 */
export function runBackCameraValidation(value) {
  const issue = validateBackCamera(value);
  return {
    isValid: !issue,
    issue: issue || null,
  };
}
