import {renderValidationMessage,resetValidationMessage} from "./shared.js";
/**
 * Removes all status-specific CSS classes from an element.
 * * @param {HTMLElement} el - The element to clear classes from.
 */
function clearCurrentTypeClasses(el, statusState) {
  if (!statusState) return;
  el.classList.remove("text-white",...STATUS_CLASSES[statusState]);
}

/** @type {string|null} Tracks the current status value to clear specific classes. */
let currentStatusState = null;

/**
 * Updates the status input's visual state by applying value-specific CSS classes.
 * 
 * @param {HTMLSelectElement|HTMLInputElement} el - The status input element.
 */
function renderTypeInputState(el) {
  clearCurrentTypeClasses(el, currentStatusState);
  const value = el.value;
  const classes = STATUS_CLASSES[value];
  if (!classes) return;

  el.classList.add("text-white", ...classes);
  currentStatusState = value;
}

/**
 * Interface for status-related UI updates.
 */
export const typeUIHandler = {
  renderTypeInputState,
  renderValidationMessage,
  resetValidationMessage
  
};

