import {renderValidationMessage, resetValidationMessage, hideWarningMessage} from "./shared.js";
/**
 * ==================================================
 *   1. REAL-TIME VALIDATION LOGIC (Event-based)
 * ===================================================
 */

/* =============== 1.1 UI CONFIGURATION & UTILITIES ==================== */
/**
 * CSS utility classes mapped by validation severity levels.
 * @type {Object.<string, string[]>}
 */
const SEVERITY_CLASSES = {
  warning: ["ring-1", "ring-yellow-500"],
  error: ["ring-1", "ring-red-500"],
};
/**
 * A flattened array of all possible severity classes for easy cleanup.
 * @type {string[]}
 */
const ALL_SEVERITY_CLASSES = Object.values(SEVERITY_CLASSES).flat();

/**
 * UI Handlers for input validation states.
 */
/**
 * Updates the input element's visual state based on validation severity.
 * 
 * @param {Object} params - The validation state.
 * @param {boolean} params.isValid - Whether the input is valid.
 * @param {Object} params.issue - The issue details (contains severity).
 * @param {HTMLElement} params.inputEl - The target input element.
 */

/* =============== 1.1 VALIDATION LOGIC ==================== */
function renderFrontCameraValidationState({ isValid, issue, inputEl }) {
      
  clearFrontCameraInputHighlight(inputEl);

  if (isValid) return;

  const classes = SEVERITY_CLASSES[issue.severity];
  if (!classes) return;

  inputEl.classList.add(...classes);
}

/**
 * Removes all validation-related CSS classes from the input element.
 * 
 * @param {HTMLElement} inputEl - The target input element.
 */
function clearFrontCameraInputHighlight(inputEl) {
    if (!inputEl) return;
  inputEl.classList.remove(...ALL_SEVERITY_CLASSES);
}



/**
 * Removes all validation severity classes from an input element.
 * Typically used during form reset events to revert the UI to its initial state.
 * 
 * @param {HTMLInputElement|null} inputEl - The input element to clear the validation state from.
 * @returns {void}
 */
function clearInputValidationState(inputEl) {
  if (!inputEl) return;
  inputEl.classList.remove(...ALL_SEVERITY_CLASSES);
}


function resetInputValidationState(field){
  const inputEl = document.querySelector(`[data-field-input="${field}"]`);
  if(!inputEl) return;
 inputEl.classList.remove(...ALL_SEVERITY_CLASSES);
}


/**
 * Interface for status-related UI updates.
 */
export const frontCameraUIHandler = {
  renderFrontCameraValidationState,
  clearInputValidationState,
  renderValidationMessage,
  resetValidationMessage, 
  hideWarningMessage,
  resetInputValidationState
};
