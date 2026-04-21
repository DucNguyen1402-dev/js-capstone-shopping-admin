/**
 * Validation patterns for different search strategies.
 */
const REGEX = {
  isID: (value) => /^\d+$/.test(value),
  isName: (value) => /^[a-zA-ZÀ-ỹ0-9\s]+$/.test(value),
};

/**
 * Resolves the search query against the product database.
 * @description
 * Implements a multi-strategy search (ID-based or Tokenized Name-based).
 * Supports fuzzy multi-word matching for product names.
 * * @param {string} inputValue - The raw string from search input.
 * @param {Array} productList - The current list of product entities.
 * @returns {Object} result - { state: string, list: Array }
 */
export function resolveProductSearch(inputValue, productList) {
  const value = inputValue.trim();

  // Case 1: Empty input
  if (inputValue === "") {
    return {
      state: "EMPTY",
      list: [],
    };
  }

  // Case 2: Numeric ID search
  if (REGEX.isID(inputValue)) {
    const list = productList.filter((p) => String(p.id) === value);

    return {
      state: list.length ? "ID" : "NOT_FOUND",
      list,
    };
  }

  // Case 3: Tokenized name search (AND logic across words)
  if (REGEX.isName(inputValue)) {
    const tokens = inputValue.toLowerCase().split(/\s+/);

    const list = productList.filter((p) => {
      return tokens.every((word) => p.nameLower.includes(word));
    });

    return {
      state: list.length ? "NAME" : "NOT_FOUND",
      list,
    };
  }

  return {
    state: "NOT_FOUND",
    list: [],
  };
}
