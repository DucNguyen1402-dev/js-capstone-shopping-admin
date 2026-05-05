/**
 * Normalizes a string by trimming whitespace and converting to lowercase.
 * Returns an empty string if the value is null or undefined.
 * @function normalizeString
 * @param {any} value - The value to normalize.
 * @returns {string} The normalized string.
 */
const normalizeString = (value) => {
  if (value == null) return "";
  return String(value).trim().toLowerCase();
};
/**
 * Compares current product data with new data to identify changed fields.
 * Supports strict comparison for numbers and normalized string comparison for other types.
 * @function diffFields
 * @param {Object} currentProduct - The existing product object.
 * @param {Object} normalizedData - The new data to compare against.
 * @returns {string[]} An array of keys representing the fields that have changed.
 */
export function diffFields(currentProduct, normalizedData) {
  const changedFields = [];

  for (const key in normalizedData) {
    const oldValue = currentProduct[key];
    const newValue = normalizedData[key];

    const isNumberField = typeof oldValue === "number";

    if (isNumberField) {
      if (oldValue !== newValue) {
        changedFields.push(key);
      }
    } else {
      if (normalizeString(oldValue) !== normalizeString(newValue)) {
        changedFields.push(key);
      }
    }
  }
  return changedFields;
}


/**
 * Creates a new object composed of the selected object properties.
 * @function pickFields
 * @param {string[]} fields - An array of property names to pick.
 * @param {Object} data - The source object to extract values from.
 * @returns {Object} A new object containing only the specified fields.
 */
export function pickFields(fields, data) {
  const result = {};
  for (const key of fields) {
    if (key in data) {
      result[key] = data[key];
    }
  }
  return result;
}

/**
 * Normalizes form data by converting specific fields to numbers and trimming strings.
 * - Fields in `NUMBER_FIELDS` are converted to Numbers (or null if empty).
 * - All other string values are trimmed.
 * @function normalizeFormDataTypes
 * @param {Object} data - The raw form data object.
 * @returns {Object} A new object with normalized data types and trimmed strings.
 */
const NUMBER_FIELDS = ["price", "stock"];

export function normalizeFormDataTypes(data) {
  const result = {};

  for (const key in data) {
    let value = data[key];

    if (NUMBER_FIELDS.includes(key)) {
      result[key] = value === "" ? null : Number(value);
    } else if (typeof value === "string") {
      result[key] = value.trim();
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Extracts an array of product names from a list of product objects.
 * @function getNameProductList
 * @param {Object[]} productList - The array of product objects.
 * @param {string} productList[].name - The name of the product.
 * @returns {string[]} An array containing only the names of the products.
 */
export function getNameProductList(productList){
   const nameList = productList.map(item => item.name);
   return nameList;
}