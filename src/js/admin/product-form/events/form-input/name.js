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
  productList,
}) {
  const { name: nameInput } = productFormInputEl;

  nameInput.addEventListener("blur", () => {
    const value = nameInput.value.trim();
    let { isValid, issue } = inputValidators.name(value);
 
    let isDuplicated = false;
    const inputLower = value.toLowerCase();
    isValid &&
      (isDuplicated = productList.some((p) => p.nameLower === inputLower));

    if (isDuplicated) {
      isValid = false;
      issue = {
        type: " DUPLICATE_NAME",
        severity: "warning",
        message:
          "A product with this name already exists. Please check to avoid confusion.",
      };
    }

    nameUIHandler.renderNameValidationState({
      isValid,
      issue,
      inputEl: nameInput,
    });
  });

  nameInput.addEventListener("reset", () => {
    nameUIHandler.clearInputValidationState(nameInput);
  });
}
