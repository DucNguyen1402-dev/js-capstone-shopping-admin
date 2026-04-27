/**
 * Retrieves the unique product identifier from the nearest parent row element.
 * * @param {HTMLElement} actionEl - The child element (typically a button) that triggered the action.
 * @returns {string} The product ID stored in the row's 'data-product-id' attribute.
 */
function getProductId(actionEl) {
  const productRowEl = actionEl.closest(".product-item");
  return productRowEl.dataset.productId;
}

/**
 * Extracts action buttons from a specific product row.
 * @description
 * Scopes the search within the provided product element to retrieve
 * the 'Edit' and 'Delete' buttons based on their data attributes.
 * @param {HTMLElement} product - The parent product row element.
 * @returns {Object} An object containing references to the editBtn and deleteBtn.
 */
function getActionBtns(product) {
  const editBtn = product.querySelector('[data-action="edit"]');
  const deleteBtn = product.querySelector('[data-action="delete"]');
  return { editBtn, deleteBtn };
}

/**
 * Configuration for Action Buttons contrast based on interaction states.
 * @description
 * Manages color transitions for Edit and Delete buttons to ensure legibility
 * when the parent row changes background color (e.g., during deletion hover).
 */
const ACTION_BTN_CLASSES = {
  edit: {
    mouseleave: ["text-blue-500"],
    mouseenter: ["text-white"],
  },
  delete: {
    mouseleave: ["text-rose-500"],
    mouseenter: ["text-white"],
  },
};

/**
 * Adjusts the contrast of action buttons to match the row's visual state.
 * @description
 * Dynamically toggles button colors by reading the 'data-action' attribute.
 * Ensures that both buttons remain visible when the row background darkens.
 * @param {Object} buttons - Destination buttons.
 * @param {HTMLElement} buttons.editBtn - The edit action element.
 * @param {HTMLElement} buttons.deleteBtn - The delete action element.
 * @param {string} eventType - The interaction phase ('mouseenter' | 'mouseleave').
 */
function setActionButtonsContrast(
  { editBtn, deleteBtn },
  eventType = "mouseleave",
) {
  const addState = (btn) => {
    if (!btn) return;

    // Identifies whether the button is 'edit' or 'delete' via data attribute
    const action = btn.dataset.action;
    const config = ACTION_BTN_CLASSES[action];
    if (!config) return;

    // Clean slate: Removes all possible theme classes for this specific action
    const allClasses = Object.values(config).flat();
    btn.classList.remove(...allClasses);

    // Apply the theme corresponding to the current event (e.g., white text on hover)
    if (config[eventType]) {
      btn.classList.add(...config[eventType]);
    }
  };

  [editBtn, deleteBtn].forEach((btn) => addState(btn));
}

/**
 * UI Interface for product action components.
 * @module itemActionUI
 * @description
 * Provides methods to interact with and style action elements (Edit/Delete).
 * Acts as a bridge between the row's state and the user's interactive tools.
 */
export const itemActionUI = {
  getProductId,
  setActionButtonsContrast,
  getActionBtns,
};
