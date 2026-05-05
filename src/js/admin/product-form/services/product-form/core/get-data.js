/**
 * Collects and aggregates current values from all form input elements 
 * defined in the product fields constant.
 * 
 * @param {Object} context - The service context.
 * @param {Object} context.productFormInputEl - Object containing references to the actual DOM input elements.
 * @param {string[]} context.PRODUCT_FIELDS - An array of keys representing the fields to be extracted.
 * @returns {Object} An object mapping field keys to their current string values.
 */
export function getFormData({ productFormInputEl, PRODUCT_FIELDS  }) {
  return PRODUCT_FIELDS.reduce((acc, key) => {
    acc[key] = productFormInputEl[key].value;
    return acc;
  }, {});
}
