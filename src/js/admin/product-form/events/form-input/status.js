/**
 * Binds change and focus events to the status input field to handle dynamic styling.
 * * @description
 * - 'change': Updates the background color based on the selected status.
 * - 'focus': Temporarily clears styling for better readability during selection.
 */
export function initStatusInputEvent({
  productFormInputEl,
  inputUIHandler: { statusUIHandler },
}) {
  const { status } = productFormInputEl;

  status.addEventListener("change", () => {
    statusUIHandler.renderStatusInputState(status);
  });

  status.addEventListener("mousedown", () => {
    status.value = "";
    statusUIHandler.renderStatusInputState(status);
  });

  status.addEventListener("reset", () => {
    statusUIHandler.resetToNormalState(status);
    statusUIHandler.resetValidationMessage("status");
    statusUIHandler.hideWarningMessage("status");
    status.dataset.warningConsent = "false";
  });
}
