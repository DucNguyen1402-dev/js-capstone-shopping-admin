/**
 * Initializes back camera input blur event listeners for real-time validation.
 *
 * @param {Object} options - Configuration object.
 * @param {Object} options.productFormInputEl - Container for form input elements.
 * @param {Object} options.inputValidators - Collection of validation logic.
 * @param {Object} options.inputUIHandler - Handlers for UI state rendering.
 */
export function initBackCameraInputEvent({
  productFormInputEl,
  inputValidators,
  inputUIHandler: { backCameraUIHandler },
}) {
  const { backCamera: backCameraInput } = productFormInputEl;

  backCameraInput.addEventListener("blur", () => {
    const value = backCameraInput.value.trim();
    const { isValid, issue } = inputValidators.backCamera(value);
    backCameraUIHandler.renderBackCameraValidationState({
      isValid,
      issue,
      inputEl: backCameraInput,
    });
  });

  backCameraInput.addEventListener("reset", ()=>{
    backCameraUIHandler.clearInputValidationState(backCameraInput);
    backCameraUIHandler.resetValidationMessage("backCamera");
    backCameraUIHandler.hideWarningMessage("backCamera");
    backCameraInput.dataset.warningConsent = "false";
  })
}
