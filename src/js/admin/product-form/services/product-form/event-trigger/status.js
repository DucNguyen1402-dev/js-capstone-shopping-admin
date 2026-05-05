/**
 * Programmatically updates the value of the status input and triggers 
 * a "change" event to notify listeners.
 * 
 * @param {string|number} value - The new value to set for the status field.
 * @param {Object} context - The service context.
 * @param {Object} context.productFormInputEl - Object containing references to form input elements.
 * @param {HTMLInputElement|HTMLSelectElement} context.productFormInputEl.status - The status input element.
 */
export function triggerStatusEvent(value, { productFormInputEl }) {
  const { status } = productFormInputEl;
  status.value = value;
  status.dispatchEvent(new Event("change"));
}

