// import {initProductListTableEvent} from "./event.js";
import {renderProductList, renderSkeleton} from "./ui/render.js";
import { initProductListTableEvent, initDeleteModelEvent} from "./event.js";

export const productTable = {
  showSkeleton: renderSkeleton,
  render: renderProductList,
  bindProductListTableEvent: initProductListTableEvent,
  bindDeleteModelEvent: initDeleteModelEvent
};



















