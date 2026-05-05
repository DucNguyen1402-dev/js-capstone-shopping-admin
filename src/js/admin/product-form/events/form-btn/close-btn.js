/**
 * Attaches a click event listener to the close button to hide the product form.
 * * @function
 * @description Listens for a click on the close button and toggles 
 * the visibility of the form container to hidden.
 */
export function initProductFormCloseEvent({dispatch, productFormEl}) {
  const { closeBtn } = productFormEl;
  closeBtn.addEventListener("click", () => {
     dispatch({
      type: "CLOSE_FORM"
    })
  });
}