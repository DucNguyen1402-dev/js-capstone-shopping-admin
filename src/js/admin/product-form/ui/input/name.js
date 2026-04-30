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
function renderNameValidationState({ isValid, issue, inputEl }) {
      
  clearNameInputHighlight(inputEl);

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
function clearNameInputHighlight(inputEl) {
  inputEl.classList.remove(...ALL_SEVERITY_CLASSES);
}

export const nameUIHandler = {
  renderNameValidationState,
};


/**
 * ==================================================
 *   2. SUBMIT VALIDATION LOGIC (Event-based)
 * ===================================================
 */