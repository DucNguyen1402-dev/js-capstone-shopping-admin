import { productListTableUI } from "../dom.js";
import { hideModalState } from "../ui/shared.js";

/**
 * Handles the cancellation of the delete modal.
 * * @param {HTMLElement} deleteModal - The modal container element to be hidden.
 */
function handleModelCancelAction(deleteModal) {
  hideModalState(deleteModal);
}

/**
 * Handles the confirmation of the delete action by dispatching a confirm event.
 * * @param {HTMLElement} deleteModal - The modal container element to be hidden.
 * @param {Function} dispatch - The dispatcher function to trigger state changes.
 */
function handleModelConfirmAction(deleteModal, dispatch) {
  dispatch({
    type: "PRODUCT_DELETE_CONFIRMED",
  });

  hideModalState(deleteModal);
}

/**
 * Initializes event delegation for the delete modal's buttons.
 * * @description Listens for click events on the modal container and identifies
 * actions (cancel/confirm) based on the button's `data-action` attribute.
 * * @param {Function} dispatch - The dispatcher function used to communicate user actions back to the state.
 */
export function initDeleteModalEvents(dispatch) {
  const { deleteModal } = productListTableUI;

  deleteModal.addEventListener("click", (e) => {
    const el = e.target.closest("button");
    if (!el) return;
    const action = el.dataset.action;

    if (action === "cancel") {
      handleModelCancelAction(deleteModal, dispatch);
    } else if (action === "confirm") {
      handleModelConfirmAction(deleteModal, dispatch);
    }
  });
}
