import {productFormInputUI} from "../../dom.js";


const STATUS_CLASSES = {
  inStock: ["bg-green-500", "text-white"],
  lowStock: ["bg-yellow-500", "text-white"],
  outOfStock: ["bg-rose-500", "text-white"],
  discontinuted: ["bg-gray-500", "text-white"],
};

const ALL_STATUS_CLASSES = Object.values(STATUS_CLASSES).flat();

function clearStatusClasses(el) {
  el.classList.remove(...ALL_STATUS_CLASSES);
}

function applyStatusClasses(el, value) {
  const classes = STATUS_CLASSES[value];
  if (!classes) return;
  el.classList.add(...classes);
}

export function bindProductFormStatusInputEvent() {
  const { status } = productFormInputUI;

  status.addEventListener("change", () => {
    clearStatusClasses(status);
    applyStatusClasses(status, status.value);
  });

  status.addEventListener("focus", () => {
    clearStatusClasses(status);
  });
}
