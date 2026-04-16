import { getProductListTableDOM } from "../dom.js";

export function renderProductList(productList) {
  const { productListTable } = getProductListTableDOM();

  productListTable.innerHTML = productList
    .map(
      (item) => `
    <tr class="hover:bg-gray-50 transition-colors duration-200">
      <td class="px-6 py-4 text-sm text-gray-700">${item.id}</td>
      <td class="px-6 py-4 text-sm font-medium text-gray-900">${item.name}</td>
      <td class="px-6 py-4 text-sm text-left text-gray-700">${item.price}</td>
      <td class="px-6 py-4 text-sm text-gray-600">
        <div class=" w-20 h-6  flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          <span>${item.type}<span>
        </div>
      </td>
      <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${item.desc}</td>
      <td class="px-6 py-4 text-center">
        <button class="js-product-edit-action text-blue-500 hover:text-blue-600 mr-3 cursor-pointer transition-colors duration-300"><span class="fa-solid fa-pen-to-square"></span></button>
        <button class="js-product-remove-action text-red-500 hover:text-red-600 cursor-pointer transition-colors duration-300 "><span class="fa-solid fa-trash"></span></button>
      </td>
    </tr>
  `,
    )
    .join("");
}

