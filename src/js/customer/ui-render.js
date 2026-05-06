import * as DOMElements from "./dom.js";
import {
  saveCartToLocalStorage,
  loadCartFromLocalStorage,
} from "./cartLocalStorage.js";

// ========== HIỂN THỊ GIỎ HÀNG TRONG SIDEBAR ==========
export function renderCartItems({
  state: { store },
  uiHanlders: { updateCartUI, showToast },
}) {
  if (store.gioHang.length === 0) {
    DOMElements.cartItemsList.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-shopping-basket text-5xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">Cart is empty</p>
                <p class="text-sm text-gray-400 mt-1">Add some products!</p>
            </div>
        `;
    return;
  }

  let html = "";
  for (let i = 0; i < store.gioHang.length; i++) {
    const item = store.gioHang[i];
    html += `
            <div class="flex gap-3 bg-gray-50 rounded-lg p-3">
                <img src="${item.image}" class="w-16 h-16 object-contain bg-white rounded" onerror="this.src='https://placehold.co/80x80?text=Phone'">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm">${item.name}</h4>
                    <p class="text-xs text-gray-500">${item.type || "Phone"}</p>
                    <p class="text-red-600 font-bold text-sm mt-1">${item.price.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}</p>
                </div>
                <div class="flex flex-col items-end gap-2">
                    <div class="flex items-center gap-2">
                        <button class="decrement-cart w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer" data-id="${item.id}">-</button>
                        <span class="w-8 text-center font-semibold">${item.quantity}</span>
                        <button class="increment-cart w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer" data-id="${item.id}">+</button>
                    </div>
                    <button class="delete-cart text-red-500 text-xs hover:text-red-700 cursor-pointer" data-id="${item.id}">
                        <i class="fas fa-trash-alt "></i> Remove
                    </button>
                </div>
            </div>
        `;
  }
  DOMElements.cartItemsList.innerHTML = html;

  // Xử lý tăng số lượng
  document.querySelectorAll(".increment-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = store.gioHang.find((i) => i.id === id);
      if (item) {
        item.quantity++;
        saveCartToLocalStorage(store.gioHang);
        updateCartUI();
      }
    });
  });

  // Xử lý giảm số lượng
  document.querySelectorAll(".decrement-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = store.gioHang.find((i) => i.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          store.gioHang = store.gioHang.filter((i) => i.id !== id);
        }
        saveCartToLocalStorage(store.gioHang);
        updateCartUI();
      }
    });
  });

  // Xóa 1 sản phẩm
  document.querySelectorAll(".delete-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      store.gioHang = store.gioHang.filter((i) => i.id !== id);
      saveCartToLocalStorage(store.gioHang);
      updateCartUI();
      showToast("Removed item from cart");
    });
  });
}

// ========== RENDER DANH SÁCH SẢN PHẨM ==========

function getPriceLabel(price, status) {
  if (status === "comingSoon") return "Coming soon";
  if (price == null) return "N/A";
  return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
const STAR_RULES = [
  { max: 0, value: 0 },
  { max: 50, value: 4 },
  { max: 100, value: 4.5 },
  { max: 150, value: 4.9 },
  { max: Infinity, value: 5 },
];

function getStarLabel(sold) {
  const rule = STAR_RULES.find((r) => sold <= r.max);
  return rule?.value ?? 0;
}

export function renderDanhSachSP({
  state: { danhSach },
  handlers: { themVaoGioHang },
}) {
  if (danhSach.length === 0) {
    DOMElements.productGrid.innerHTML = "";
    DOMElements.noProductsMsg.classList.remove("hidden");
    return;
  }

  DOMElements.noProductsMsg.classList.add("hidden");

  let html = "";
  for (let i = 0; i < danhSach.length; i++) {
    const phone = danhSach[i];
    const imgUrl =
      phone.img || phone.image || "https://placehold.co/300x200?text=Phone";
    const price = Number(phone.price) || 0;
    const type = phone.type || phone.category || "Phone";
    const desc = phone.desc || phone.description || "High quality product";

    html += `
           <div class="product-card overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
  <div class="flex h-48 items-center justify-center p-4">
    <img src="${imgUrl}" alt="${phone.name}" class="max-h-36 object-contain"
      onerror="this.src = 'https://placehold.co/300x200?text=Phone'" />
  </div>
  <div class="bg-gray-50 p-4 min-h-85 flex flex-col justify-between">
    <div>
    <div class="min-h-14">
    <h3 class= text-lg font-bold line-clamp-2" title="${phone.name}">
      ${phone.name}
    </h3>
    </div>
    <div class="mt-1 min-h-15">
    <p class="text-sm text-gray-500">
      ${desc.substring(0, 60)}${desc.length > 60 ? "..." : ""}
    </p>
    </div>
    <div class ="mt-2 flex gap-2 text-sm text-gray-500 min-h-10 rounded-sm overflow-hidden">
    <span class="bg-gray-200/60 p-0.75 w-full">${phone.screen}</span>
    </div>
    <div class="mt-6 flex flex-wrap items-center justify-between gap-2 ">
      <span class="rounded-full bg-blue-50 px-2 py-0.5 text-sm text-blue-600">${type}</span>
     <span class="${
       phone.status === "comingSoon"
         ? "text-green-500 font-medium"
         : "text-xl font-bold text-red-600"
     }"> ${getPriceLabel(phone.price, phone.status)}</span>
    </div>
    <div class="mt-8 flex items-center gap-3 text-sm">
      <div class="flex items-center gap-1 font-medium text-yellow-500">
        <i class="fa-solid fa-star text-xs"></i>
        <span class="text-gray-800"> ${getStarLabel(phone.sold)} </span>
      </div>

      <span class="text-gray-300">|</span>

      <span class="text-gray-500"> ${phone.sold} sold </span>
    </div>
    </div>
    <button
      class="add-to-cart-btn mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
      data-id="${phone.id}" data-name="${phone.name}" data-price="${price}" data-image="${imgUrl}" data-type="${type}">
      <span class="fas fa-cart-plus"></span>
      <span>Add to Cart</span>
    </button>
  </div>
</div>
        `;
  }
  DOMElements.productGrid.innerHTML = html;

  // Gắn sự kiện cho nút Add to Cart
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = {
        id: parseInt(btn.dataset.id),
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price),
        image: btn.dataset.image,
        type: btn.dataset.type,
      };
      themVaoGioHang(product);
    });
  });
}
