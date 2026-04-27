/**
 * State transition map for cycling through sorting types.
 * @type {Object.<string, string>}
 */
const NEXT_SORT_TYPE = {
  price_asc: "price_desc",
  price_desc: "price_asc",
};

const sortBtnState = {
  descending: true,
};
/**
 *
 * Handles the click event on the price sort button.
 * Updates the UI icon, toggles the sort direction state, and dispatches the sort action.
 * * @param {HTMLElement} sortPriceIcon - The icon element that indicates sort direction.
 * @param {Function} dispatch - The dispatcher function to trigger the sorting logic.
 */
function handleSortPriceOnClick(sortPriceIcon, dispatch) {
  const current = sortPriceIcon.dataset.sortType;
  const next = NEXT_SORT_TYPE[current];
  if (!next) return;

  // Update UI State
  sortPriceIcon.dataset.sortType = next;
  sortPriceIcon.classList.toggle("rotate-180");

  // Dispatch action with the strategy matching the NEW state
  dispatch({
    type: "PRODUCT_SORT_CHANGED",
    payload: { sortStrategy: next },
  });
}
/**
 * Initializes the click event listener for the price sorting button.
 * * @param {Function} dispatch - The dispatcher function for state communication.
 */
export function initSortPriceBtn({
  filteredList = {},
  dispatch,
  tableEl = {},
}) {
  const { sortPriceBtn, sortPriceIcon } = tableEl;

  sortPriceBtn.addEventListener("click", (e) => {
    if (filteredList.length <= 1) return;
    handleSortPriceOnClick(sortPriceIcon, dispatch);
  });
}
