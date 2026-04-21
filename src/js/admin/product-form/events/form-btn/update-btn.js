/**
 * Attaches click listener to the update action.
 * * @description Dispatches an `UPDATE` action to trigger form data persistence
 * and state synchronization.
 * * @param {Function} dispatch - The application's action dispatcher.
 */
export function initUpdateBtnEvent(dispatch, productFormUI) {
  const { updateBtn } = productFormUI;
  updateBtn.addEventListener("click", () => {
    dispatch({
      type: "PRODUCT_UPDATE_SUBMITTED",
    });
  });
}
