import { productFormInputUI } from "../../dom.js";

/**
 * Threshold rules for determining product status based on stock quantity.
 * @type {Array<{max: number, value: string}>}
 */
const STATUS_RULES = [
  { max: 0, value: "outOfStock" },
  { max: 8, value: "lowStock" },
  { max: Infinity, value: "inStock" },
];

/**
 * Determines the appropriate status string based on the provided stock quantity.
 * * @param {number} value - The current stock count.
 * @returns {string} The matching status value (e.g., "outOfStock", "lowStock", "inStock").
 */
function getStatusFromStock(value) {
  return STATUS_RULES.find((rule) => value <= rule.max).value;
}

/**
 * Binds a change event to the stock input to automatically update the status field.
 * * @description
 * When the stock value changes, it calculates the new status and updates
 * the status dropdown. It also triggers a 'change' event on the status
 * element to ensure any dependent UI styling is updated.
 */
export function bindStockInputEvent() {
  const { stock, status } = productFormInputUI;

  stock.addEventListener("change", () => {
    const value = stock.valueAsNumber;
    const statusValue = getStatusFromStock(value);

    status.value = statusValue;
    status.dispatchEvent(new Event("change"));
  });
}
