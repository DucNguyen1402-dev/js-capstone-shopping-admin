/**
 * Threshold rules for determining product status based on stock quantity.
 * @type {Array<{max: number, value: string}>}
 */
const STATUS_RULES = [
  { min: -Infinity, max: -1, value: "unknown" },
  { min: 0, max: 0, value: "outOfStock" },
  { min: 1, max: 8, value: "lowStock" },
  { min: 9, max: Infinity, value: "inStock" },
];
/**
 * Determines the appropriate status string based on the provided stock quantity.
 * * @param {number} value - The current stock count.
 * @returns {string} The matching status value (e.g., "outOfStock", "lowStock", "inStock").
 */

function getStatusFromStock(value) {
  if (value === "") return "unknown";
  return STATUS_RULES.find((rule) => value >= rule.min && value <= rule.max)
    .value;
}

/**
 * Initializes stock input blur event listeners for validation and UI updates.
 *
 * @param {Object} options - Configuration object.
 * @param {Function} options.dispatch - State management dispatch function.
 * @param {Object} options.productFormInputEl - Container for form input elements.
 * @param {Object} options.inputValidators - Collection of validation logic.
 * @param {Object} options.inputUIHandler - Handlers for UI state rendering.
 */
export function initStockInputEvent({
  dispatch,
  productFormInputEl,
  inputValidators,
  inputUIHandler: { stockUIHandler },
}) {
  const { stock: stockInput, status: statusInput } = productFormInputEl;
  stockInput.addEventListener("blur", () => {
    const value = stockInput.value.trim();

    const { isValid, issue } = inputValidators.stock(value);
    dispatch({
      type: "TRIGGER_STATUS_EVENT",
      payload: {
        statusValue: isValid ? getStatusFromStock(value) : "unknown",
      },
    });
    stockUIHandler.renderStockValidationState({
      isValid,
      issue,
      inputEl: stockInput,
    });
  });

  stockInput.addEventListener("reset", () => {
    stockUIHandler.clearInputValidationState(stockInput);
    stockUIHandler.resetValidationMessage("stock");
    stockUIHandler.hideWarningMessage("stock");
    stockInput.dataset.warningConsent = "false";
  });
}
