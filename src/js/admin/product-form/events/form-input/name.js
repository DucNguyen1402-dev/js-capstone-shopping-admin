/**
 * Initializes name input blur event listeners for real-time validation.
 *
 * @param {Object} options - Configuration object.
 * @param {Object} options.productFormInputEl - Container for form input elements.
 * @param {Object} options.inputValidators - Collection of validation logic.
 * @param {Object} options.inputUIHandler - Handlers for UI state rendering.
 */
export function initNameInputEvent({
  productFormInputEl,
  inputValidators,
  inputUIHandler: { nameUIHandler },
}) {
  const { name: nameInput } = productFormInputEl;

  nameInput.addEventListener("blur", () => {
    const value = nameInput.value.trim();
    const { isValid, issue } = inputValidators.name(value);
    nameUIHandler.renderNameValidationState({
      isValid,
      issue,
      inputEl: nameInput,
    });
  });
}
