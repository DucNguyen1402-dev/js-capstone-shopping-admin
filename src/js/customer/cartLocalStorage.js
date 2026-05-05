// ========== LƯU / ĐỌC GIỎ HÀNG ==========
export function saveCartToLocalStorage(gioHang) {
  localStorage.setItem("phoneShopCart", JSON.stringify(gioHang));
}

export function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("phoneShopCart");
  return savedCart ? JSON.parse(savedCart) : [];
}
