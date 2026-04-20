import { productListTableUI } from "../dom.js";

export function initSearchProductInputEvent(dispatch) {
  const { searchInput } = productListTableUI;

  searchInput.addEventListener("input", () => {
    dispatch({
      type: "SEARCH_PRODUCT_REQUEST",
      payload: {
        inputValue: searchInput.value
      }
    });
  });
}
