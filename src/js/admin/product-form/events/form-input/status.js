/**
 * CSS class mapping for different product stock statuses.
 * @type {Object.<string, string[]>}
 */
const STATUS_CLASSES = {
  inStock: ["bg-green-500", "text-white"],
  lowStock: ["bg-yellow-500", "text-white"],
  outOfStock: ["bg-rose-500", "text-white"],
  discontinuted: ["bg-gray-500", "text-white"],
  comingSoon: ["bg-blue-500", "text-white"]
};

/**
 * A flattened array of all possible status-related CSS classes.
 * Used for resetting the element's class list.
 * @type {string[]}
 */
const ALL_STATUS_CLASSES = Object.values(STATUS_CLASSES).flat();

/**
 * Removes all status-specific CSS classes from an element.
 * * @param {HTMLElement} el - The element to clear classes from.
 */
function clearStatusClasses(el) {
  el.classList.remove(...ALL_STATUS_CLASSES);
}

/**
 * Applies the corresponding CSS classes to an element based on its status value.
 * * @param {HTMLElement} el - The element to style.
 * @param {string} value - The status value (e.g., 'inStock', 'lowStock').
 */
function applyStatusClasses(el, value) {
  const classes = STATUS_CLASSES[value];
  if (!classes) return;
  el.classList.add(...classes);
}

/**
 * Binds change and focus events to the status input field to handle dynamic styling.
 * * @description
 * - 'change': Updates the background color based on the selected status.
 * - 'focus': Temporarily clears styling for better readability during selection.
 */
export function initProductFormStatusInputEvent(productFormInputUI) {
  const { status } = productFormInputUI;

  status.addEventListener("change", () => {
    clearStatusClasses(status);
    applyStatusClasses(status, status.value);
  });

  status.addEventListener("mousedown", () => {
    clearStatusClasses(status);
  });
}
