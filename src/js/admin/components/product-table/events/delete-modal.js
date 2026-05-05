/**
 * Handles the cancellation of the delete modal.
 * * @param {HTMLElement} deleteModal - The modal container element to be hidden.
 */
function handleModelCancelAction(deleteModal, dispatch, modalUI) {
  modalUI.hideModalState(deleteModal);
  dispatch({
    type: "PRODUCT_CANCEL_DELETION",
    payload:{
      action: "delete"
    }
  });
}

/**
 * Handles the confirmation of the delete action by dispatching a confirm event.
 * * @param {HTMLElement} deleteModal - The modal container element to be hidden.
 * @param {Function} dispatch - The dispatcher function to trigger state changes.
 */
function handleModelConfirmAction(deleteModal, dispatch, modalUI) {
  dispatch({
    type: "PRODUCT_DELETE_CONFIRMED",
  });

  modalUI.hideModalState(deleteModal);
}

/**
 * Initializes event delegation for the delete modal's buttons.
 * * @description Listens for click events on the modal container and identifies
 * actions (cancel/confirm) based on the button's `data-action` attribute.
 * * @param {Function} dispatch - The dispatcher function used to communicate user actions back to the state.
 */
export function initDeleteModalEvents({
  dispatch = {},
  tableEl = {},
  uiToolkit = {},
}) {
  const { deleteModal } = tableEl;
  const { modalUI } = uiToolkit;
  deleteModal.addEventListener("click", (e) => {
    const el = e.target.closest("button");
    if (!el) return;
    const action = el.dataset.action;

    if (action === "cancel") {
      handleModelCancelAction(deleteModal, dispatch, modalUI);
    } else if (action === "confirm") {
      handleModelConfirmAction(deleteModal, dispatch, modalUI);
    }
  });
}
