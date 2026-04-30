/**
 * Initializes price input blur event listeners for real-time validation.
 * 
 * @param {Object} options - Configuration object.
 * @param {Object} options.productFormInputEl - Container for form input elements.
 * @param {Object} options.inputValidators - Collection of validation logic.
 * @param {Object} options.inputUIHandler - Handlers for UI state rendering.
 */
export function initPriceInputEvent({
  productFormInputEl,
  inputValidators,
  inputUIHandler: { priceUIHandler },
}) {
  const { price: priceInput } = productFormInputEl;

  priceInput.addEventListener("blur", () => {
    const value = priceInput.value.trim();
    const { isValid, issue } = inputValidators.price(value);
    priceUIHandler.renderPriceValidationState({
      isValid,
      issue,
      inputEl: priceInput,
    });
  });
}
