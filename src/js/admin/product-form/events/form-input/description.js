/**
 * Initializes description input blur event listeners for real-time validation.
 *
 * @param {Object} options - Configuration object.
 * @param {Object} options.productFormInputEl - Container for form input elements.
 * @param {Object} options.inputValidators - Collection of validation logic.
 * @param {Object} options.inputUIHandler - Handlers for UI state rendering.
 */
export function initDescInputEvent({
  productFormInputEl,
  inputValidators,
  inputUIHandler: { descUIHandler },
}) {
  const { desc: descInput } = productFormInputEl;

  descInput.addEventListener("blur", () => {
    const value = descInput.value.trim();
    const { isValid, issue } = inputValidators.desc(value);

    descUIHandler.renderDescValidationState({
      isValid,
      issue,
      inputEl: descInput,
    });
  });

  descInput.addEventListener("reset", () => {
    descUIHandler.clearInputValidationState(descInput);
  });
}
