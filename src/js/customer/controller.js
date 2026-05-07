import * as DOMElements from "./dom.js";
import {
  saveCartToLocalStorage,
  loadCartFromLocalStorage,
} from "./cartLocalStorage.js";
import { store } from "./state.js";
import { PHONE_API_URL } from "../config/api-config.js";
import { renderCartItems, renderDanhSachSP } from "./ui-render.js";

// ========== HIỂN THỊ THÔNG BÁO ==========
const showToast = (message) => {
  DOMElements.toastMsg.textContent = message;
  DOMElements.toast.classList.remove("opacity-0");
  DOMElements.toast.classList.add("opacity-100");
  setTimeout(() => {
    DOMElements.toast.classList.remove("opacity-100");
    DOMElements.toast.classList.add("opacity-0");
  }, 2000);
};

// ========== TÍNH TỔNG TIỀN ==========
const tinhTongTien = () => {
  return store.gioHang.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

// ========== CẬP NHẬT UI GIỎ HÀNG ==========
const updateCartUI = () => {
  const totalItems = store.gioHang.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  if (totalItems > 0) {
    DOMElements.cartCountSpan.classList.remove("hidden");
    DOMElements.cartCountSpan.textContent = totalItems;
  } else {
    DOMElements.cartCountSpan.classList.add("hidden");
  }
  DOMElements.cartTotalSpan.textContent = `${tinhTongTien().toLocaleString("en-US", { style: "currency", currency: "USD" })}`;
  renderCartItems({
    state: { store },
    uiHanlders: { updateCartUI, showToast },
  });
};

// ========== XÓA TẤT CẢ GIỎ HÀNG ==========
const clearAllCart = () => {
  if (store.gioHang.length === 0) {
    showToast("Cart is already empty!");
    return;
  }
  store.gioHang = [];
  saveCartToLocalStorage(store.gioHang);
  updateCartUI();
  showToast("Cleared all items from cart");
};

// ========== THÊM VÀO GIỎ HÀNG ==========
const themVaoGioHang = (product) => {
  const existingItem = store.gioHang.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    store.gioHang.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: product.type,
      quantity: 1,
    });
  }

  saveCartToLocalStorage(store.gioHang);
  updateCartUI();
  showToast(`Added ${product.name} to cart`);
};

// ========== LỌC SẢN PHẨM ==========
const filterProducts = () => {
  const searchTerm = DOMElements.searchInput.value.toLowerCase();
  const filterType = DOMElements.filterSelect.value;
  const priceRange = DOMElements.priceRangeFilter.value;

  let filtered = [...store.danhSachSP];

  // Lọc theo danh mục
  if (filterType !== "all") {
    filtered = filtered.filter(
      (phone) => phone.type === filterType || phone.category === filterType,
    );
  }

  // Lọc theo giá
  if (priceRange !== "all") {
    filtered = filtered.filter((phone) => {
      const price = phone.price;

      if (priceRange === "under300") return price < 300;
      if (priceRange === "300-700") return price >= 300 && price <= 700;
      if (priceRange === "700-1000") return price > 700 && price <= 1000;
      if (priceRange === "above1000") return price > 1000;

      return true;
    });
  }
  // Lọc theo tìm kiếm
  if (searchTerm !== "") {
    filtered = filtered.filter(
      (phone) =>
        phone.name?.toLowerCase().includes(searchTerm) ||
        phone.desc?.toLowerCase().includes(searchTerm) ||
        phone.description?.toLowerCase().includes(searchTerm),
    );
  }

  // Sắp xếp
  const sortValue = DOMElements.sortSelect.value;
  if (sortValue === "priceAsc") {
    filtered.sort((a, b) => {
      if (a.price === null) return -1;
      if (b.price === null) return 1;
      return a.price - b.price;
    });
  } else if (sortValue === "priceDesc") {
    filtered.sort((a, b) => {
      if (a.price === null) return -1;
      if (b.price === null) return 1;
      return b.price - a.price;
    });
  } else {
    filtered.sort((a, b) => b.id - a.id);
  }

  renderDanhSachSP({
    state: { danhSach: filtered },
    handlers: { themVaoGioHang },
  });
};

// ========== LẤY DỮ LIỆU TỪ API ==========
const layDanhSachSP = async () => {
  DOMElements.loadingSpinner.classList.remove("hidden");
  DOMElements.productGrid.classList.add("hidden");
  DOMElements.noProductsMsg.classList.add("hidden");

  try {
    const response = await axios.get(PHONE_API_URL);
    store.danhSachSP = response.data;

    DOMElements.loadingSpinner.classList.add("hidden");
    DOMElements.productGrid.classList.remove("hidden");

    filterProducts();
  } catch (error) {
    console.error("Lỗi tải dữ liệu:", error);
    DOMElements.loadingSpinner.classList.add("hidden");
    DOMElements.productGrid.classList.add("hidden");
    DOMElements.noProductsMsg.classList.remove("hidden");
    DOMElements.noProductsMsg.innerHTML =
      '<i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-3"></i><p class="text-red-500">Failed to load data! Please try again later.</p>';
  }
};

// ========== MỞ/ĐÓNG GIỎ HÀNG ==========
const openCartSidebar = () => {
  DOMElements.cartOverlay.classList.remove("hidden");
  setTimeout(() => {
    DOMElements.cartSidebar.classList.remove("translate-x-full");
    DOMElements.cartSidebar.classList.add("translate-x-0");
  }, 10);
  renderCartItems({
    state: { store },
    uiHanlders: { updateCartUI, showToast },
  });
};

const closeCartSidebar = () => {
  DOMElements.cartSidebar.classList.remove("translate-x-0");
  DOMElements.cartSidebar.classList.add("translate-x-full");
  setTimeout(() => {
    DOMElements.cartOverlay.classList.add("hidden");
  }, 300);
};

// ========== KHỞI TẠO SỰ KIỆN ==========
const initEvents = () => {
  DOMElements.searchInput.addEventListener("input", filterProducts);
  DOMElements.filterSelect.addEventListener("change", filterProducts);
  DOMElements.priceRangeFilter.addEventListener("change", filterProducts);
  DOMElements.sortSelect.addEventListener("change", filterProducts);

  DOMElements.cartIconBtn.addEventListener("click", openCartSidebar);
  DOMElements.closeCartBtn.addEventListener("click", closeCartSidebar);
  DOMElements.clearCartBtn.addEventListener("click", clearAllCart);

  DOMElements.cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) closeCartSidebar();
  });

  DOMElements.checkoutBtn.addEventListener("click", () => {
    if (store.gioHang.length === 0) {
      showToast("Cart is empty! Add some products first.");
      return;
    }
    showToast("Thank you for your purchase! (Demo)");
    store.gioHang = [];
    saveCartToLocalStorage(store.gioHang);
    updateCartUI();
    closeCartSidebar();
  });

  // ========== USER ICON - TÍNH NĂNG ĐANG PHÁT TRIỂN ==========
  if (userIconBtn) {
    DOMElements.userIconBtn.addEventListener("click", () => {
      showToast("🔐 Login feature is coming soon!");
    });
  }
};

// ========== KHỞI CHẠY ==========
const init = () => {
  store.gioHang = loadCartFromLocalStorage();
  initEvents();
  updateCartUI();
  layDanhSachSP();
};

init();
