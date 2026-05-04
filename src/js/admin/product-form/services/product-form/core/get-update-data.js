
/**
 * Executes a schema-based data extraction from the form UI.
 * @description
 * Iterates through the defined PRODUCT_FIELDS to map DOM values
 * into a structured data object.
 * @returns {Object} A clean product entity for API or state updates.
 */

export function getUpdatedProduct({ productFormInputEl, fieldUtils, PRODUCT_FIELDS }) {
  return PRODUCT_FIELDS.reduce((acc, key) => {
    if (fieldUtils.isNumberField(key)) {
      const value = productFormInputEl[key].valueAsNumber;
      acc[key] = Number.isNaN(value) ? null : value;
    } else {
      acc[key] = productFormInputEl[key].value;
    }
    return acc;
  }, {});
}

  