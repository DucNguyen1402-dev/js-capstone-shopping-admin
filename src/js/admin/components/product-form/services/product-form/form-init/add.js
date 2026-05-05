/**
 * Prepares the product form state for adding a new product.
 * * @param {Object} [product] - Optional initial data for the new product.
 */
export function initProductFormAddVersion({ productFormEl, formUI }) {
  const { productFormContainer, form } = productFormEl;
  form.reset();
  formUI.showForm(productFormContainer, true);
  formUI.setAddMode(productFormEl);
}
