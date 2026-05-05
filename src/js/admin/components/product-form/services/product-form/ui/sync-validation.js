/**
 * Clears validation messages and resets consent states for fields that are currently valid.
 * 
 * @param {Object} results - The validation results object.
 * @param {Array} results.valid - List of fields that passed validation.
 * @param {Object.<string, Object>} inputUIHandlerMapping - Map of field keys to their respective UI handlers.
 * @param {Object} formUI - UI utility for global form state management.
 * @private
 */
function clearNonErrorMessages({ valid }, inputUIHandlerMapping, formUI) {
  valid.forEach(({ field }) => {
    const handler = inputUIHandlerMapping[field];
    if (!handler) return;
    inputUIHandlerMapping[field].resetValidationMessage(field);
    formUI.resetConsentField(field);
  });
}

/**
 * Updates the UI to display a validation message for a specific field after hiding existing warnings.
 * 
 * @param {string} field - The unique identifier of the field.
 * @param {Object} issue - The issue object containing the message and severity.
 * @param {Object.<string, Object>} inputUIHandlerMapping - Map of field keys to their respective UI handlers.
 * @private
 */
function showValidationMessage(field, issue, inputUIHandlerMapping) {
  const handler = inputUIHandlerMapping[field];
  if (!handler) return;
  inputUIHandlerMapping[field].hideWarningMessage(field);
  inputUIHandlerMapping[field].renderValidationMessage(field, issue);
}

/**
 * Synchronizes the entire validation UI based on the latest validation results.
 * It clears valid states and renders messages for errors and unconfirmed warnings.
 * 
 * @param {Object} results - The complete validation results object.
 * @param {Object} context - The service context.
 * @param {Object.<string, Object>} context.inputUIHandlerMapping - Map of field keys to their respective UI handlers.
 * @param {Object} context.formUI - UI utility for global form state management.
 */
export function syncValidationUI(results, { inputUIHandlerMapping, formUI }) {
  const { inputs } = results;

  clearNonErrorMessages(inputs, inputUIHandlerMapping, formUI);

  const merged = [
    ...inputs.error.map((item) => ({ ...item, hasConfirm: false })),
    ...inputs.warning,
  ];
  merged.forEach(({ field, result: { issue }, hasConfirm }) => {
    if (hasConfirm) return;
    showValidationMessage(field, issue, inputUIHandlerMapping);
  });
}
