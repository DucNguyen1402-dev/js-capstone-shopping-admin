/**
 * @typedef {Object} IssueDetail
 * @property {string} type - Unique identifier for the issue.
 * @property {string} message - Human-readable message explaining the issue.
 * @property {"error" | "warning"} severity - Severity level: "error" blocks submission, "warning" requires confirmation.
 */

/**
 * Validation issues library for product status field.
 * @type {Record<string, IssueDetail>}
 */

const FIELD_ISSUES = {
  EMPTY: {
    type: "EMPTY",
    severity: "error",
    message: "The status option is requied! ",
  },
  UNKNOWN: {
    type: "UNKNOWN",
    severity: "warning",
    message: "The status value is unrecognized. Please confirm if you want to proceed."
  }
};

/**
 * Validates the product screen based on predefined format and length rules.
 *
 * @param {string} value - The product image string to be validated.
 * @returns {IssueDetail | null} The first issue encountered, or null if the screen passes all checks.
 */
const validateStatus= (value) => {
  const validators = [
    {
      isInvalid: (value) => value === "",
      issue: FIELD_ISSUES.EMPTY,
    },
      {
      isInvalid: (value) => value === "unknown",
      issue: FIELD_ISSUES.UNKNOWN,
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
export function runStatusValidation(value) {
  const issue = validateStatus(value);
  return {
    isValid: !issue,
    issue: issue || null,
  };
}
