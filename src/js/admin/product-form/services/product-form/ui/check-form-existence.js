/**
 * Checks if the product form is currently visible in the UI based on its opacity class.
 * 
 * @param {Object} context - The service context.
 * @param {Object} context.productFormEl - Object containing references to form elements.
 * @param {HTMLElement} context.productFormEl.productFormContainer - The container element of the form.
 * @returns {boolean} True if the form is visible (has 'opacity-100' class), false otherwise.
 */
export function checkFormExistence({ productFormEl }) {
  const { productFormContainer } = productFormEl;
  return productFormContainer.classList.contains("opacity-100");
}

