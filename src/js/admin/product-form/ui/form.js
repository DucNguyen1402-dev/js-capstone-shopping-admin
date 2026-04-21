/**
 * Toggles the visibility of the main product form container.
 * * @param {HTMLElement} productForm - The form container element.
 * @param {boolean} [visible=true] - Whether the form should be shown.
 */

export function setProductFormToVisible(productForm, visible = true) {
  productForm.classList.toggle("hidden", !visible);
}

/**
 * Toggles the visibility of the "Submit" (Add) button.
 * * @param {HTMLElement} submitBtn - The submit button element.
 * @param {boolean} [visible=true] - Whether the button should be shown.
 */
function setProductFormSubmitBtnToVisible(submitBtn, visible = true) {
  submitBtn.classList.toggle("hidden", !visible);
}

/**
 * Toggles the visibility of the "Update" button.
 * * @param {HTMLElement} updateBtn - The update button element.
 * @param {boolean} [visible=true] - Whether the button should be shown.
 */
function setProductFormUpdateBtnToVisible(updateBtn, visible = true) {
  updateBtn.classList.toggle("hidden", !visible);
}

/**
 * Configures the UI state for updating an existing product.
 * * @param {Object} elements - The UI elements to update.
 * @param {HTMLElement} elements.productForm - The form container.
 * @param {HTMLElement} elements.submitBtn - The add button.
 * @param {HTMLElement} elements.updateBtn - The update button.
 * @param {HTMLElement} elements.title - The form heading element.
 */
export function setProductFormStateForUpdate({
  submitBtn,
  updateBtn,
  title,
}) {
  setProductFormSubmitBtnToVisible(submitBtn, false);
  setProductFormUpdateBtnToVisible(updateBtn, true);
  title.textContent = "Update Product";
}

/**
 * Configures the UI state for adding a new product.
 * * @param {Object} elements - The UI elements to update.
 * @param {HTMLElement} elements.productForm - The form container.
 * @param {HTMLElement} elements.submitBtn - The add button.
 * @param {HTMLElement} elements.updateBtn - The update button.
 * @param {HTMLElement} elements.title - The form heading element.
 */
export function setProductFormStateForAdd({
  submitBtn,
  updateBtn,
  title,
}) {
  setProductFormSubmitBtnToVisible(submitBtn, true);
  setProductFormUpdateBtnToVisible(updateBtn, false);
  title.textContent = "Add New Product";
}

/**
 * Populates form inputs with data from a product model.
 * * @param {Object.<string, HTMLInputElement|HTMLSelectElement>} form - An object containing form input elements.
 * @param {Object} formData - The data object to fill into the form.
 */
export function fillForm(form, formData) {
  Object.entries(formData).forEach(([k, v]) => {
    form[k].value = v ?? "";
  });

  form.status.dispatchEvent(new Event("change"));
}

