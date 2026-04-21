import { productListTableUI } from "../dom.js";

/**
 * Bootstraps the category-based filtering interface.
 * @description
 * Listens for selection changes on the filter dropdown to trigger
 * specific product category view updates.
 * @param {Function} dispatch - The central action dispatcher.
 */
export function initProductTableFilterEvent(filterState,dispatch) {
  const { filterInput } = productListTableUI;
  filterInput.addEventListener("change", () => {
    dispatch({
      type: "TABLE_FILTER_REQUEST",
      payload: {
        productType: filterInput.value,
        onFilter: true
      },
    });
  });
}
