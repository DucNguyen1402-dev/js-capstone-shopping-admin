/**
 * Utility object for handling field-specific logic and metadata.
 *
 * @type {Object}
 */
export const fieldUtils = {
  /**
   * A set of field names that should be treated as numeric types.
   * @type {Set<string>}
   */
  numberFields: new Set(["price", "stock"]),
  /**
   * Checks if a given field key is classified as a numeric field.
   *
   * @param {string} key - The field name/key to check.
   * @returns {boolean} True if the field is in the numberFields set, false otherwise.
   */
  isNumberField(key) {
    return this.numberFields.has(key);
  },
};
