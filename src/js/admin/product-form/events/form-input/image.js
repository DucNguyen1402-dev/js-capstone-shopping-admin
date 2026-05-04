/**
 * Initializes image input blur event listeners for real-time validation.
 *
 * @param {Object} options - Configuration object.
 * @param {Object} options.productFormInputEl - Container for form input elements.
 * @param {Object} options.inputValidators - Collection of validation logic.
 * @param {Object} options.inputUIHandler - Handlers for UI state rendering.
 */
export function initImageInputEvent({
  productFormInputEl,
  inputValidators,
  inputUIHandler: { imageUIHandler },
}) {
  const { image: imageInput } = productFormInputEl;

  imageInput.addEventListener("blur", () => {
    const value = imageInput.value.trim();

    const { isValid, issue } = inputValidators.image(value);

    imageUIHandler.renderImageValidationState({
      isValid,
      issue,
      inputEl: imageInput,
    });
  });

  imageInput.addEventListener("reset", ()=>{
    imageUIHandler.clearInputValidationState(imageInput);
      imageUIHandler.resetValidationMessage("image");
    imageUIHandler.hideWarningMessage("image");
    imageInput.dataset.warningConsent = "false";
  })
}
