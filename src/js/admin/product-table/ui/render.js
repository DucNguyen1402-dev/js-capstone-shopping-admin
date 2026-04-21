import { getProductListTableDOM } from "../../dom-factory.js";

/**
 * CSS classes for product status badges based on inventory levels.
 * @type {Object.<string, string>}
 */
const STATUS_CLASSES = {
  inStock: "bg-green-500",
  lowStock: "bg-yellow-500",
  outOfStock: "bg-rose-500",
  discontinuted: "bg-gray-500",
};

/**
 * Generates the HTML string for a single table row.
 * * @param {Object} item - The product data object.
 * @param {string|number} item.id - The unique identifier for the product.
 * @returns {string} The HTML representative of a table row.
 */
const ProductRow = (item) => `
   <tr class="product-item transition-colors duration-200 hover:bg-gray-50" data-product-id="${item.id}">
    <td class="product-id px-6 py-4 text-sm text-gray-700">${item.id}</td>
    <td class="px-6 py-4 text-sm font-medium text-gray-900">${item.name}</td>
    <td class="px-6 py-4 text-left text-sm text-gray-700">${item.price}</td>
    <td class="px-6 py-4 text-sm text-gray-600">
      <div
        class="flex h-6 w-20 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
        <span>${item.type}</span>
      </div>
    </td>
    <td class="px-6 py-4">
      <div class="flex items-center gap-2">
  <span class="${STATUS_CLASSES[item.status]} h-3 w-3 rounded-full"></span>
        <span
          class="inline-flex h-6 w-8 items-center justify-center rounded-sm bg-slate-100 text-xs font-medium text-slate-700">
          <span> ${item.stock} </span>
        </span>
      </div>
    </td>
    <td class="px-6 py-4 text-center">
      <button class="mr-3 cursor-pointer text-blue-500 transition-colors duration-300 hover:text-blue-600"
        data-action="edit">
        <span class="fa-solid fa-pen-to-square"></span>
      </button>
      <button class="cursor-pointer text-red-500 transition-colors duration-300 hover:text-red-600" 
      data-action="delete">
        <span class="fa-solid fa-trash"></span>
      </button>
    </td>
  </tr>
  `;

/**
 * Renders the entire product list into the table body.
 * * @description
 * - Clears existing content.
 * - Maps the product array to HTML row strings.
 * - Injects the joined string into the DOM container.
 * * @param {Array<Object>} productList - The array of product objects to display.
 */
export function renderProductList(list) {
  const { productListTable } = getProductListTableDOM();

  productListTable.innerHTML = list.map((item) => ProductRow(item)).join("");
}

/**
 * Generates the HTML string for a skeleton loading row.
 * * @returns {string} The HTML representative of a table row placeholder.
 */
const SkeletonRow = () => `
   <tr class="animate-pulse border-b border-gray-100 last:border-none">
      <td class="px-6 py-4">
        <div class="h-4 bg-gray-200 rounded w-8"></div>
      </td>

      <td class="px-6 py-4">
        <div class="h-4 bg-gray-200 rounded w-40"></div>
      </td>

      <td class="px-6 py-4">
        <div class="h-4 bg-gray-200 rounded w-20"></div>
      </td>

      <td class="px-6 py-4">
        <div class="h-6 bg-gray-100 rounded-full w-24"></div>
      </td>

      <td class="px-6 py-4 ">
      <div class="h-7 bg-gray-100 rounded w-2/5"></div>
      </td>

      <td class="px-6 py-4 text-right">
        <div class="flex items-center justify-center gap-2">
          <div class="w-9 h-9 bg-gray-100 rounded-lg"></div>
          <div class="w-9 h-9 bg-gray-100 rounded-lg"></div>
        </div>
      </td>
    </tr>
  `;

/**
 * Renders skeleton placeholders in the product table to indicate a loading state.
 * * @description
 * Replaces the current table content with a specified number of pulse-animated
 * skeleton rows to improve perceived performance during data fetching.
 * * @param {number} [preCount=8] - The number of skeleton rows to display.
 */
export function renderSkeleton(preCount = 8) {
  const { productListTable } = getProductListTableDOM();

  productListTable.innerHTML = SkeletonRow().repeat(preCount);
}

export function renderNotFoundProduct() {
  const { productListTable } = getProductListTableDOM();

  productListTable.innerHTML = `
    <tr class="not-found-row">
      <td colspan="100%" style="text-align: center; padding: 40px;">
        <div class="not-found-container">
          <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
          <h3 style="color: #555; margin-bottom: 8px;">No products found</h3>
          <p style="color: #888;">Sorry, we couldn't find any results matching your search.</p>
      </td>
    </tr>
  `;
}
