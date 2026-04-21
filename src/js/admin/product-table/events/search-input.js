import { productListTableUI } from "../dom.js";

/**
 * Utility to delay function execution until typing pauses.
 */
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Bootstraps the optimized live search interface.
 * @description
 * Uses debounce (300ms) to prevent excessive dispatching
 * during rapid user input.
 * @param {Function} dispatch - The central action dispatcher.
 */
export function initSearchProductInputEvent(dispatch) {
  const { searchInput } = productListTableUI;

  const debouncedDispatch = debounce((value) => {
    dispatch({
      type: "SEARCH_PRODUCT_REQUEST",
      payload: { inputValue: value },
    });
  }, 200);

  searchInput.addEventListener("input", () => {
    debouncedDispatch(searchInput.value);
  });
}
