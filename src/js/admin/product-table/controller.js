// import {initProductListTableEvent} from "./event.js";
import {renderProductList, renderSkeleton} from "./ui/render.js";
import {triggerEditEvent, initProductListTableEvent} from "./event.js";

export const productTable = {
  showSkeleton: renderSkeleton,
  render: renderProductList,
  bindProductListTableEvent: initProductListTableEvent,
  event: triggerEditEvent
};



















