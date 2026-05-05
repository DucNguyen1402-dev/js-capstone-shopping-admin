/**
 * A constant array representing the canonical list of field names used
 * within the product form. This serves as the source of truth for
 * iterating over inputs during initialization, validation, and data collection.
 *
 * @type {string[]}
 */
const INPUT_FIELDS = [
  "name",
  "price",
  "image",
  "screen",
  "backCamera",
  "frontCamera",
  "desc",
  "type",
  "stock",
  "status",
];

/**
 * Initializes change event listeners for warning consent checkboxes across all input fields.
 * Syncs the checkbox state with the input's dataset and handles UI cleanup upon consent.
 *
 * @param {Object} context - The service context.
 * @param {Object.<string, Object>} context.inputUIHandlerMapping - Map of field keys to their respective UI handlers.
 */
export function initWarningConsentCheckboxEvent({ inputUIHandlerMapping }) {
  INPUT_FIELDS.forEach((field) => {
    const warningConsentCheckbox = document.querySelector(
      `[data-role="warning-consent-checkbox"][data-field ="${field}"]`,
    );

    const fieldInput = document.querySelector(`[data-field-input="${field}"]`);
    // Sync initial checkbox state from DOM dataset
    warningConsentCheckbox.checked =
      fieldInput.dataset.warningConsent === "true";

    warningConsentCheckbox.addEventListener("change", () => {
      // Update dataset based on checkbox toggle
      fieldInput.dataset.warningConsent =
        warningConsentCheckbox.checked.toString();

      if (fieldInput.dataset.warningConsent) {
        // Delay UI reset to allow user to see the interaction
        setTimeout(() => {
          inputUIHandlerMapping[field].hideWarningMessage(field);
          inputUIHandlerMapping[field]?.resetInputValidationState?.(field);
        }, 300);
      }
    });
  });
}
