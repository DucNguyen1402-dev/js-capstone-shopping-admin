import {productFormInputUI} from "../../dom.js";



const STATUS_RULES = [
  { max: 0, value: "outOfStock" },
  { max: 8, value: "lowStock" },
  { max: Infinity, value: "inStock" },
];

function getStatusFromStock(value) {
  return STATUS_RULES.find(rule => value <= rule.max).value;
}

 export function bindStockInputEvent() {
  const { stock, status } = productFormInputUI;

  stock.addEventListener("change", () => {
    const value = stock.valueAsNumber;
    const statusValue = getStatusFromStock(value);

    status.value = statusValue;
    status.dispatchEvent(new Event("change"));
  });
}
