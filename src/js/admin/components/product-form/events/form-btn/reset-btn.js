/**
 * Initializes the form reset listener.
 * @description
 * Attaches a click event to the reset trigger to restore all
 * form fields to their initial state.
 * @param {Object} productFormUI - UI elements mapping for the product form.
 */
export function initResetBtnEvent({productFormEl, productFormInputEl}) {
  const { resetBtn, form } = productFormEl;
  const {status }  = productFormInputEl;
  resetBtn.addEventListener("click", () => {
    form.reset();
    status.dispatchEvent(new Event("change"));
  });
}
