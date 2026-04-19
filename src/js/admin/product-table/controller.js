// import {initProductListTableEvent} from "./event.js";
import {renderProductList, renderSkeleton, handleItemsSorting} from "./ui/render.js";
import { initProductTableEvents} from "./events/index.js";


/**
 * Controller object for managing product table UI and behavior.
 * * @type {Object}
 * @property {Function} showSkeleton - Displays the loading placeholder (skeleton screen).
 * @property {Function} render - Renders the actual product list into the table.
 * @property {Function} initProductTable - Sets up table-related events.
 */
export const productTable = {
  showSkeleton: renderSkeleton,
  render: renderProductList,
  initProductTable: initProductTableEvents,
  handleSorting: handleItemsSorting
};



















