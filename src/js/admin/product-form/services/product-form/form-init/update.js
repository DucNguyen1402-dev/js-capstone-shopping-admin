/**
 * Orchestrates the UI transition to 'Update Mode'.
 * @description
 * Reveals the form, switches its internal state to update-specific logic,
 * and populates all fields with existing product data.
 * @param {Object} product - The raw product entity to be edited.
 */
export function initProductFormUpdateVersion(
  product,
  { productFormEl, formUI, productToFormModel, productFormInputEl },
) {
  const { productFormContainer, form } = productFormEl;
  form.reset();
  formUI.showForm(productFormContainer, true);
  formUI.setUpdateMode(productFormEl);
  const formData = productToFormModel(product);

  setTimeout(() => {
    formUI.fillForm(productFormInputEl, formData);
  }, 0);
}


