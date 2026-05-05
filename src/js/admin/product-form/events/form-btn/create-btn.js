/**
 * Initialize click event for the create product button.
 * 
 * @param {Object} context
 * @param {Function} context.dispatch - Function to trigger state changes.
 * @param {Object} context.productFormEl - Object containing form elements.
 * @param {HTMLButtonElement} context.productFormEl.createBtn - The button to trigger creation.
 */
export function initCreateNewBtnEvent({ dispatch, productFormEl }) {
  const { createBtn } = productFormEl;

  createBtn.addEventListener("click", () => {
    dispatch({
      type: "CREATE_NEW_PRODUCT",
    });
  });
}
