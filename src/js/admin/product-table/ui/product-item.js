/**
 * UI Interface for individual Product Items (rows).
 * @module productItemUI
 * @description 
 * Manages DOM access and styling for specific product rows.
 * Focuses on item-level visual states and element retrieval.
 */
export const productItemUI ={
    applyActionFeedbackUI,
    getProductItemById,
    setRowEditorialMode
}
/**
 * Finds a product row in the DOM using its ID.
 * @param {string|number} id - The product ID to search for.
 * @returns {HTMLElement|null} The matching DOM element or null if not found.
 */
function getProductItemById(id){
  const product = document.querySelector(`[data-product-id="${id}"]`);
  return product;
}


/**
 * ===========================================
 *   GROUP 1: Interaction Feedback (Temporary)
 * ===========================================
 */

/**
 * @typedef {'delete' | 'edit'} ActionType
 * @typedef {'mouseenter' | 'mouseleave'} UIEventType
 */

/**
 * Configuration of Tailwind CSS classes for each action's UI states.
 * @type {Object.<ActionType, {hover: string[], default: string[]}>}
 */
const ACTION_FEEDBACK_CLASSES = {
  delete: {
    hover: ["bg-rose-500/80", "text-white"],
    default: ["bg-white", "text-slate-700"],
  },
  edit: {
    hover: ["bg-indigo-500/80", "text-white"],
    default: ["bg-white", "text-slate-700"],
  },
};

/**
 * Aggregated list of all CSS classes per action, used for UI resetting.
 * @type {Object.<ActionType, string[]>}
 */
const ALL_FEEDBACK_CLASSES = {
  delete: Object.values(ACTION_FEEDBACK_CLASSES.delete).flat(),
  edit: Object.values(ACTION_FEEDBACK_CLASSES.edit).flat()
}

/**
 * Mapping between mouse events and their corresponding UI states.
 * @type {Object.<UIEventType, string>}
 */
const EVENT_TO_UI_STATE = {
  mouseenter: "hover",
  mouseleave: "default",
};

/**
 * Updates the highlight UI for a product row based on the action and user event.
 * @param {HTMLElement} product - The DOM element of the product row.
 * @param {ActionType} action - The type of action being performed (e.g., 'delete', 'edit').
 * @param {UIEventType} [eventType="mouseleave"] - The mouse event type to determine the UI state.
 * @returns {void}
 */
function applyActionFeedbackUI(product, action,  eventType = "mouseleave"){
    if(!product) return;
    const state = EVENT_TO_UI_STATE[eventType];
    product.classList.remove(...ALL_FEEDBACK_CLASSES[action]);
    product.classList.add(...ACTION_FEEDBACK_CLASSES[action][state]);
}



/**
 * ===========================================
 *  GROUP 2: Editorial State (Persistent)
 * ===========================================
 */

/**
 * UI configuration for the editorial states of a product row.
 * Defines styles for when a row is in active editing mode versus its inactive state.
 * @type {{default: string[], highlight: string[]}}
 */
const EDITORIAL_UI_CLASSES ={
  default : ["bg-white", "text-slate-700"],
  highlight: ["bg-indigo-500/80", "text-white"]
}
/**
 * A flattened list of all CSS classes used in editorial states.
 * Utilized to perform a clean UI reset before switching modes.
 * @type {string[]}
 */
const ALL_EDITORIAL_CLASSES = Object.values(EDITORIAL_UI_CLASSES).flat();
/**
 * Toggles the editorial mode for a product row.
 * This state is persistent and typically reflects whether the row is currently being edited.
 * @param {HTMLElement} product - The product row element to update.
 * @param {boolean} [isHighlight=true] - If true, applies the highlight (active) style; otherwise, resets to default.
 * @returns {void}
 */
function setRowEditorialMode(product, isHighlight = true){
   if(!product) return;
   product.classList.remove(...ALL_EDITORIAL_CLASSES);
   const state = isHighlight ? "highlight" : "default";
   product.classList.add(...EDITORIAL_UI_CLASSES[state])
}