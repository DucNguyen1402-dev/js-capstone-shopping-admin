/**
 * Initialize the form reset event to sync custom input behaviors.
 * 
 * @param {Object} context
 * @param {Object} context.productFormEl - Object containing the form element.
 * @param {HTMLFormElement} context.productFormEl.form - The target form.
 * @param {Object.<string, HTMLElement>} context.productFormInputEl - Collection of form input elements.
 */
export function initFormResetEvent({ productFormEl, productFormInputEl }) {
  const { form } = productFormEl;
  const inputs = Object.values(productFormInputEl);

  form.addEventListener("reset", () => {
    setTimeout(() => {
      inputs.forEach((input) => {
        input.dispatchEvent(
          new CustomEvent("reset", {
            bubbles: false,
          }),
        );
      });
    }, 0);
  });
}
