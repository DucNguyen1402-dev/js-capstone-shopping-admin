/**
 * Initializes screen input blur event listeners for real-time validation.
 *
 * @param {Object} options - Configuration object.
 * @param {Object} options.productFormInputEl - Container for form input elements.
 * @param {Object} options.inputValidators - Collection of validation logic.
 * @param {Object} options.inputUIHandler - Handlers for UI state rendering.
 */
export function initScreenInputEvent({
  productFormInputEl,
  inputValidators,
  inputUIHandler: { screenUIHandler },
}) {
  const { screen: screenInput } = productFormInputEl;

  screenInput.addEventListener("blur", () => {
    const value = screenInput.value.trim();
    const { isValid, issue } = inputValidators.screen(value);

    screenUIHandler.renderScreenValidationState({
      isValid,
      issue,
      inputEl: screenInput,
    });
  });

  screenInput.addEventListener("reset", () =>{
    screenUIHandler.reset(screenInput);
    screenInput.dataset.warningConsent = "false";
  });
}
