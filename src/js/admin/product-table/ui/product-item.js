/**
 * UI Interface for individual Product Items (rows).
 * @module productItemUI
 * @description 
 * Manages DOM access and styling for specific product rows.
 * Focuses on item-level visual states and element retrieval.
 */
export const productItemUI ={
    setDeleteProductRowUI,
    getProductItemById,
    

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
 * Configuration for deletion visual states mapped by interaction events.
 * @description 
 * Centralizes styling for 'pending' (mouseenter) and 'default' (mouseleave) states.
 * Using an object makes it easy to add more interaction states in the future.
 */
const PENDING_DELETE_CLASSES = {
  mouseenter: ["bg-rose-500/80", "text-white"],
  mouseleave: ["bg-white", "text-slate-700"]
}

const ALL_CLASS = Object.values(PENDING_DELETE_CLASSES).flat();
/**
 * Updates the product row UI based on the interaction phase.
 * @description 
 * Dynamically switches classes by first clearing all possible state-related classes 
 * and then applying the specific set for the current event type.
 * @param {HTMLElement|null} product - The target product row element.
 * @param {string} eventType - The state key ('mouseenter' or 'mouseleave'). Defaults to 'mouseleave'.
 */
function setDeleteProductRowUI(product, eventType = "mouseleave"){
    if(!product) return;
    product.classList.remove(...ALL_CLASS);
    product.classList.add(...PENDING_DELETE_CLASSES[eventType]);
}