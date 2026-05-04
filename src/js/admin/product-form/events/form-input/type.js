/**
 * Binds change and focus events to the status input field to handle dynamic styling.
 * * @description
 * - 'change': Updates the background color based on the selected status.
 * - 'focus': Temporarily clears styling for better readability during selection.
 */
export function initTypeInputEvent({
  productFormInputEl,
  inputUIHandler: { typeUIHandler },
}) {
  const { type } = productFormInputEl;

  type.addEventListener("reset", () => {
    typeUIHandler.resetValidationMessage("type");
    typeUIHandler.hideWarningMessage("type");
    type.dataset.warningConsent = "false";
  });
}
