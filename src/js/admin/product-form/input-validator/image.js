/**
 * @typedef {Object} IssueDetail
 * @property {string} type - Unique identifier for the issue.
 * @property {string} message - Human-readable message explaining the issue.
 * @property {"error" | "warning"} severity - Severity level: "error" blocks submission, "warning" requires confirmation.
 */

/**
 * Validation issues library for Product image fields.
 * @type {Record<string, IssueDetail>}
 */

const FIELD_ISSUES = {
  EMPTY: {
    type: "EMPTY",
    severity: "warning",
    message: "No image link provided. A default placeholder will be used."
  },
  INVALID_URL: {
    type: "INVALID_URL",
    severity: "error",
    message: "Please enter a valid URL (starting with http:// or https://)."
  },
  INVALID_IMAGE_EXT: {
    type: "INVALID_IMAGE_EXT",
    severity: "error",
    message: "The link must end with a valid image extension (.jpg, .png, .webp, .gif)."
  }
};

/**
 * Validates the product image based on predefined format and length rules.
 *
 * @param {string} value - The product image string to be validated.
 * @returns {IssueDetail | null} The first issue encountered, or null if the image passes all checks.
 */
const validateImage = (value) => {
  const validators = [
    {
      isInvalid: (value) => value === "",
      issue: FIELD_ISSUES.EMPTY,
    },
    {
      isInvalid: (value) => !/^(https?:\/\/)/i.test(value),
      issue: FIELD_ISSUES.INVALID_URL,
    },
    {
      isInvalid: (value) => !/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(value),
      issue: FIELD_ISSUES.INVALID_IMAGE_EXT,
    },
  ];


  const firstIssue = validators.find((v) => v.isInvalid(value));
  return firstIssue ? firstIssue.issue : null;
};

/**
 * Processes image validation and returns a comprehensive status object.
 * Useful for determining UI states like border colors or disabling submit buttons.
 *
 * @param {string} value - The raw input value to process.
 * @returns {{ isValid: boolean, issue: IssueDetail | null, canSubmit: boolean }}
 * An object containing the validity, the specific issue, and a submission flag.
 */
export function runImageValidation(value) {
  const issue = validateImage(value);
  return {
    isValid: !issue,
    issue: issue || null,
  };
}
