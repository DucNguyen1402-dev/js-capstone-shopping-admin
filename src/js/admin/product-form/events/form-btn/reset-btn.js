/**
 * Initializes the form reset listener.
 * @description
 * Attaches a click event to the reset trigger to restore all
 * form fields to their initial state.
 * @param {Object} productFormUI - UI elements mapping for the product form.
 */
export function initResetBtnEvent(productFormUI, productFormInputUI) {
  const { resetBtn, form } = productFormUI;
  const {status }  = productFormInputUI;
  resetBtn.addEventListener("click", () => {
    form.reset();
    status.dispatchEvent(new Event("change"));
  });
}
