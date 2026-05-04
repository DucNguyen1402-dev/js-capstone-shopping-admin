/**
 * Resets and conceals the product form interface.
 * @description
 * Executes the visibility transition to hide the form container
 * from the active viewport.
 */
export function hideForm({ productFormEl, formUI }) {
  const { productFormContainer } = productFormEl;
  formUI.showForm(productFormContainer, false);
}


export function openEditFormWithState({ productFormEl, formUI }){
    const { productFormContainer } = productFormEl;
  formUI.showForm(productFormContainer, true);
  formUI.setUpdateMode(productFormEl);
}


export function openAddFormWithState({ productFormEl, formUI }){
    const { productFormContainer } = productFormEl;
  formUI.showForm(productFormContainer, true);
  formUI.setAddMode(productFormEl);
}


