/**
 * CSS class mapping for different product stock statuses.
 * @type {Object.<string, string[]>}
 */
const STATUS_CLASSES = {
  inStock: ["bg-green-500"],
  lowStock: ["bg-yellow-500"],
  outOfStock: ["bg-rose-500"],
  discontinuted: ["bg-gray-500"],
  comingSoon: ["bg-blue-500"],
  unknown: ["bg-slate-900/50"],
};

/**
 * Removes all status-specific CSS classes from an element.
 * * @param {HTMLElement} el - The element to clear classes from.
 */
function clearCurrentStatusClasses(el, statusState) {
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
function renderStatusInputState(el) {
  clearCurrentStatusClasses(el, currentStatusState);
  const value = el.value;
  const classes = STATUS_CLASSES[value];
  if (!classes) return;

  el.classList.add("text-white", ...classes);
  currentStatusState = value;
}

/**
 * Interface for status-related UI updates.
 */
export const statusUIHandler = {
  renderStatusInputState,
};
