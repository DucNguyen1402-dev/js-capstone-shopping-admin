/**
 * @typedef {Object} IssueDetail
 * @property {string} type - Unique identifier for the issue.
 * @property {string} message - Human-readable message explaining the issue.
 * @property {"error" | "warning"} severity - Severity level: "error" blocks submission, "warning" requires confirmation.
 */

/**
 * Validation issues library for Product type field.
 * @type {Record<string, IssueDetail>}
 */

const FIELD_ISSUES = {
  EMPTY: {
    type: "EMPTY",
    severity: "warning",
    message: "The type is requied! ",
  },
};

/**
 * Validates the product screen based on predefined format and length rules.
 *
 * @param {string} value - The product image string to be validated.
 * @returns {IssueDetail | null} The first issue encountered, or null if the screen passes all checks.
 */
const validateType= (value) => {
  const validators = [
    {
      isInvalid: (value) => value === "",
      issue: FIELD_ISSUES.EMPTY,
    },
  ];

  const firstIssue = validators.find((v) => v.isInvalid(value));
  return firstIssue ? firstIssue.issue : null;
};

/**
 * Processes screen validation and returns a comprehensive status object.
 * Useful for determining UI states like border colors or disabling submit buttons.
 *
 * @param {string} value - The raw input value to process.
 * @returns {{ isValid: boolean, issue: IssueDetail | null, canSubmit: boolean }}
 * An object containing the validity, the specific issue, and a submission flag.
 */
export function runTypeValidation(value) {
  const issue = validateType(value);
  return {
    isValid: !issue,
    issue: issue || null,
  };
}
