import { getProductListTableDOM } from "../../dom.js";

const STATUS_CLASSES = {
  inStock: "bg-green-500",
  lowStock: "bg-yellow-500",
  outOfStock: "bg-red-500 animate-pulse",
};

 function getStatusClasses(stockValue) {
  if (stockValue <= 0) return STATUS_CLASSES.outOfStock;
  if (stockValue <= 8) return STATUS_CLASSES.lowStock;
  return STATUS_CLASSES.inStock;
}
export function renderProductList(productList) {
  const { productListTable } = getProductListTableDOM();

  productListTable.innerHTML = productList
    .map(
      (item) => `
   <tr class="product-row transition-colors duration-200 hover:bg-gray-50" data-product-id="${item.id}">
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
        <span class="${getStatusClasses(item.stock)} h-3 w-3 rounded-full"></span>
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
  `,
    )
    .join("");
}

export function renderSkeleton() {
  const { productListTable } = getProductListTableDOM();
  productListTable.innerHTML = `
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
  `.repeat(5);
}
