/**
 * Resets and conceals the product form interface.
 *
 * @param {Object} context - The service context.
 * @param {Object} context.productFormEl - Object containing references to form elements.
 * @param {Object} context.formUI - UI utility for form visibility and mode management.
 */
export function hideForm({ productFormEl, formUI }) {
  const { productFormContainer } = productFormEl;
  formUI.showForm(productFormContainer, false);
}

/**
 * Displays the product form in edit mode while preserving its current state.
 *
 * @param {Object} context - The service context.
 * @param {Object} context.productFormEl - Object containing references to form elements.
 * @param {Object} context.formUI - UI utility for form visibility and mode management.
 */
export function openEditFormWithState({ productFormEl, formUI }) {
  const { productFormContainer } = productFormEl;
  formUI.showForm(productFormContainer, true);
  formUI.setUpdateMode(productFormEl);
}

/**
 * Displays the product form in add mode while preserving its current state.
 *
 * @param {Object} context - The service context.
 * @param {Object} context.productFormEl - Object containing references to form elements.
 * @param {Object} context.formUI - UI utility for form visibility and mode management.
 */
export function openAddFormWithState({ productFormEl, formUI }) {
  const { productFormContainer } = productFormEl;
  formUI.showForm(productFormContainer, true);
  formUI.setAddMode(productFormEl);
}
