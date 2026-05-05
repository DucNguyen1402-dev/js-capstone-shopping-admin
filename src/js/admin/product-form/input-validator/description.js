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
export const FIELD_ISSUES = {
  EMPTY: {
    type: "EMPTY",
    severity: "error",
    message:
      "Description cannot be empty.",
  },
  INVALID_TEXT: {
    type: "INVALID_TEXT",
    severity: "error",
    message: "Only letters, numbers, and spaces are allowed.",
  },
  ONLY_NUMBERS: {
    type: "ONLY_NUMBERS",
    severity: "error",
    message:
      "Description cannot contain only numbers.",
  },
  TOO_SHORT: {
    type: "TOO_SHORT",
    severity: "warning",
    message: "This description is quite brief. are you sure?.",
  },
  TOO_LONG: {
    type: "TOO_LONG",
    severity: "warning",
    message:
      "Description is very long (over 2000 chars). It might be hard for users to read.",
  },
  DANGEROUS_CHAR:{
    type: "DANGEROUS_CHAR",
    severity: "error",
    message: "Unsafe characters detected (e.g. <, >, {, }). Please remove them."
  }
};

/**
 * Validates the product name based on predefined format and length rules.
 *
 * @param {string} value - The product name string to be validated.
 * @returns {IssueDetail | null} The first issue encountered, or null if the name passes all checks.
 */
const validateDescription= (value) => {
  const validators = [
    {
      isInvalid: (value) => value === "",
      issue: FIELD_ISSUES.EMPTY,
    },
    {
      isInvalid: (value) => /[<>{}]/.test(value),
      issue: FIELD_ISSUES.DANGEROUS_CHAR,
    },
    {
      isInvalid: (value) =>  !/^[a-zA-ZÀ-ỹ0-9\s,."'-]+$/.test(value),
      issue: FIELD_ISSUES.INVALID_TEXT,
    },
    {
      isInvalid: (value) => /^\d+$/.test(value.replace(/[\s.]/g, "")),
      issue: FIELD_ISSUES.ONLY_NUMBERS,
    },
    {
      isInvalid: (value) => value.length < 2,
      issue: FIELD_ISSUES.TOO_SHORT,
    },
    {
      isInvalid: (value) => value.length > 2000,
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
export function runDescriptionValidation(value) {
  const issue = validateDescription(value);
  return {
    isValid: !issue,
    issue: issue || null,
  };
}
