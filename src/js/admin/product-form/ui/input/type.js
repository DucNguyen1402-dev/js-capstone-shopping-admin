import {
  renderValidationMessage,
  resetValidationMessage,
  hideWarningMessage,
} from "./shared.js";

/**
 * Resets the validation state and UI feedback for a specific input element.
 * 
 * @param {HTMLElement} inputEl - The input element to be reset.
 */
function reset(inputEl) {
  resetValidationMessage("type");
  hideWarningMessage("type");
  inputEl.dataset.warningConsent = "false";
}

/**
 * Interface for status-related UI updates.
 */
export const typeUIHandler = {
  renderValidationMessage,
  resetValidationMessage,
  hideWarningMessage,
  reset
};
