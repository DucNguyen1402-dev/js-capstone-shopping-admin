/**
 * Initializes front camera input blur event listeners for real-time validation.
 *
 * @param {Object} options - Configuration object.
 * @param {Object} options.productFormInputEl - Container for form input elements.
 * @param {Object} options.inputValidators - Collection of validation logic.
 * @param {Object} options.inputUIHandler - Handlers for UI state rendering.
 */
export function initFrontCameraInputEvent({
  productFormInputEl,
  inputValidators,
  inputUIHandler: { frontCameraUIHandler },
}) {
  const { frontCamera: frontCameraInput } = productFormInputEl;

  frontCameraInput.addEventListener("blur", () => {
    const value = frontCameraInput.value.trim();
    const { isValid, issue } = inputValidators.backCamera(value);

    frontCameraUIHandler.renderFrontCameraValidationState({
      isValid,
      issue,
      inputEl: frontCameraInput,
    });
  });

  frontCameraInput.addEventListener("reset", ()=>{
    frontCameraUIHandler.clearInputValidationState(frontCameraInput);
  })
}
