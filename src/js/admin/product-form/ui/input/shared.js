/**
 * A collection of CSS classes mapped by severity levels (warning, error)
 * for styling validation message elements.
 *
 * @type {Object.<string, string[]>}
 */
const ERROR_MESSAGE_SEVERITY_CLASSES = {
  warning: [
    "bg-orange-50",
    "text-orange-700",
    "border-orange-200",
    "border-l-4",
    "indent-4",
  ],
  error: ["bg-red-50", "text-red-700", "border-red-200", "border-l-4"],
};
/**
 * A flattened array containing all possible CSS classes used across
 * all severity levels for validation messages.
 *
 * @type {string[]}
 */
const ALL_ERROR_MESSAGE_SEVERITY_CLASSES = Object.values(
  ERROR_MESSAGE_SEVERITY_CLASSES,
).flat();

/**
 * Renders a validation message with specific styling based on the issue's severity.
 * If the severity is a warning, it also reveals a consent checkbox.
 *
 * @param {string} field - The unique identifier for the data-field attribute.
 * @param {Object} issue - The validation issue object.
 * @param {string} issue.severity - The severity level (e.g., 'error', 'warning').
 * @param {string} issue.message - The validation message content to display.
 */
export function renderValidationMessage(field, issue) {
  const messageField = document.querySelector(
    `[data-role="warning"][data-field = "${field}"]`,
  );

  _clearValidationMessageUI(messageField);

  if (issue.severity === "warning") {
    const confirmBtn = document.querySelector(
      `[data-role="warning-consent-checkbox"][data-field="${field}"]`,
    );
    confirmBtn.classList.remove("hidden");
  }
  const classes = ERROR_MESSAGE_SEVERITY_CLASSES[issue.severity];
  if (!classes) return;
  messageField.innerHTML = issue.message;
  messageField.classList.remove("hidden");
  messageField.classList.add(...classes);
}

/**
 * Hides the warning UI components for a specific field, including
 * the consent checkbox and the validation message container.
 *
 * @param {string} field - The unique identifier for the data-field attribute.
 */
export function hideWarningMessage(field) {
  const confirmBtn = document.querySelector(
    `[data-role="warning-consent-checkbox"][data-field="${field}"]`,
  );
  confirmBtn.classList.add("hidden");
  const messageField = document.querySelector(
    `[data-role="warning"][data-field = "${field}"]`,
  );
  messageField.classList.add("hidden");
  messageField.classList.remove(...ALL_ERROR_MESSAGE_SEVERITY_CLASSES);
}

/**
 * Resets the visual state of a validation message element by hiding it
 * and removing all severity-specific CSS classes.
 *
 * @param {HTMLElement|null} messageField - The DOM element displaying the validation message.
 * @private
 */

function _clearValidationMessageUI(messageField) {
  if (!messageField) return;
  messageField.classList.add("hidden");
  messageField.classList.remove(...ALL_ERROR_MESSAGE_SEVERITY_CLASSES);
}

export function resetValidationMessage(field) {
  const confirmBtn = document.querySelector(
    `[data-role="warning-consent-checkbox"][data-field="${field}"]`,
  );
  confirmBtn.classList.add("hidden");

  const messageField = document.querySelector(
    `[data-role="warning"][data-field = "${field}"]`,
  );
  messageField.classList.add("hidden");
  messageField.classList.remove(...ALL_ERROR_MESSAGE_SEVERITY_CLASSES);
}
