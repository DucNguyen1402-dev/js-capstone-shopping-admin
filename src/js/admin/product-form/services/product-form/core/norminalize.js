/**
 * Iterates through form data and converts specific field values to numbers 
 * based on the field utility rules.
 * 
 * @param {Object} data - The raw form data object with string values.
 * @param {Object} context - The service context.
 * @param {Object} context.fieldUtils - Utility containing rules for field type checking.
 * @returns {Object} A new data object with normalized types (strings or numbers).
 */
export function normalizeFormDataTypes(data, {fieldUtils}) {
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = fieldUtils.isNumberField(key) ? Number(data[key]) : data[key];
    return acc;
  }, {});
}
