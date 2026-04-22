import { productListTableUI } from "./dom.js";
import {
  renderRawOrderOfList,
  renderSkeleton,
  renderNotFoundState,
} from "./ui/render.js";

/**
 * Renders the initial table view with a default sorting order.
 * @description
 * Sorts the provided list by price (descending) as the baseline view
 * before any user interaction. Creates a shallow copy to preserve data integrity.
 * @param {Array} list - The dataset to be rendered initially.
 */
function sortByPriceDesc(list) {
  return [...list].sort((a, b) => b.price - a.price);
}



/**
 * Create Product Table UI bound to given DOM elements.
 *
 * @param {Object} tableElements
 * @returns {{
 *   renderSkeleton: (expectedCount: number) => void,
 *   renderDefaultTableOrder: (list: Array) => void,
 *   renderRawOrderOfList: (list: Array) => void,
 *   renderNotFoundState: () => void
 * }}
 */
const createProductTableUI = (tableElements) => ({
  renderSkeleton: (expectedCount) => {
    renderSkeleton(expectedCount, tableElements);
  },
  renderDefaultTableOrder: (list) => {
    const sortedList = sortByPriceDesc(list);
    renderRawOrderOfList(sortedList, tableElements);
  },
  renderRawOrderOfList: (list) => {
    renderRawOrderOfList(list, tableElements);
  },
  renderNotFoundState: () => {
    renderNotFoundState(tableElements);
  },
});


export const productTableUI = createProductTableUI(productListTableUI);
