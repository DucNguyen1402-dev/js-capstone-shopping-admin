

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
