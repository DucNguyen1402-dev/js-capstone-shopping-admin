/**
 * Retrieves the unique product identifier from the nearest parent row element.
 * * @param {HTMLElement} actionEl - The child element (typically a button) that triggered the action.
 * @returns {string} The product ID stored in the row's 'data-product-id' attribute.
 */
function getProductId(actionEl) {
  const productRowEl = actionEl.closest(".product-item");
  return productRowEl.dataset.productId;
}

export const itemActionUI = {
   getProductId
}