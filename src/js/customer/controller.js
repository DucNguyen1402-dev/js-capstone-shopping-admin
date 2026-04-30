// ========== IMPORT CÁC HÀM HELPER ==========
import { $, $all, $e } from '/admin-main/src/js/shared/dom-utils.js';

// ========== CẤU HÌNH ==========
const API_URL = "https://69ca679fba5984c44bf31927.mockapi.io/api/v1/phone";

// ========== BIẾN LƯU TRỮ ==========
let danhSachSP = [];
let gioHang = [];

// ========== LẤY CÁC PHẦN TỬ DOM ==========
const productGrid = $('#productGrid');
const loadingSpinner = $('#loadingSpinner');
const noProductsMsg = $('#noProductsMsg');
const searchInput = $('#searchInput');
const filterSelect = $('#filterSelect');
const cartCountSpan = $('#cartCount');
const cartOverlay = $('#cartOverlay');
const cartSidebar = $('#cartSidebar');
const cartItemsList = $('#cartItemsList');
const cartTotalSpan = $('#cartTotal');
const closeCartBtn = $('#closeCartBtn');
const cartIconBtn = $('#cartIconBtn');
const checkoutBtn = $('#checkoutBtn');
const toast = $('#toast');
const toastMsg = $('#toastMsg');

// ========== HIỂN THỊ THÔNG BÁO ==========
const showToast = (message) => {
    toastMsg.textContent = message;
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
    }, 2000);
};

// ========== LƯU VÀ ĐỌC GIỎ HÀNG ==========
const saveCartToLocalStorage = () => {
    localStorage.setItem('phoneShopCart', JSON.stringify(gioHang));
};

const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('phoneShopCart');
    if (savedCart) {
        try {
            gioHang = JSON.parse(savedCart);
        } catch(e) {
            gioHang = [];
        }
    }
    updateCartUI();
};

// ========== TÍNH TỔNG TIỀN ==========
const tinhTongTien = () => {
    return gioHang.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// ========== CẬP NHẬT UI GIỎ HÀNG ==========
const updateCartUI = () => {
    const totalItems = gioHang.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartCountSpan.classList.remove('hidden');
        cartCountSpan.textContent = totalItems;
    } else {
        cartCountSpan.classList.add('hidden');
    }
    cartTotalSpan.textContent = `${tinhTongTien().toLocaleString('vi-VN')}₫`;
    renderCartItems();
};

// ========== HIỂN THỊ GIỎ HÀNG TRONG SIDEBAR ==========
const renderCartItems = () => {
    if (gioHang.length === 0) {
        cartItemsList.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-shopping-basket text-5xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">Giỏ hàng trống</p>
                <p class="text-sm text-gray-400 mt-1">Hãy thêm sản phẩm nào!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    for (let i = 0; i < gioHang.length; i++) {
        const item = gioHang[i];
        html += `
            <div class="flex gap-3 bg-gray-50 rounded-lg p-3">
                <img src="${item.image}" class="w-16 h-16 object-contain bg-white rounded" onerror="this.src='https://placehold.co/80x80?text=Phone'">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm">${item.name}</h4>
                    <p class="text-xs text-gray-500">${item.type || 'Điện thoại'}</p>
                    <p class="text-red-600 font-bold text-sm mt-1">${item.price.toLocaleString('vi-VN')}₫</p>
                </div>
                <div class="flex flex-col items-end gap-2">
                    <div class="flex items-center gap-2">
                        <button class="decrement-cart w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 transition" data-id="${item.id}">-</button>
                        <span class="w-8 text-center font-semibold">${item.quantity}</span>
                        <button class="increment-cart w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 transition" data-id="${item.id}">+</button>
                    </div>
                    <button class="delete-cart text-red-500 text-xs hover:text-red-700" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i> Xóa
                    </button>
                </div>
            </div>
        `;
    }
    cartItemsList.innerHTML = html;
    
    document.querySelectorAll('.increment-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = gioHang.find(i => i.id === id);
            if (item) {
                item.quantity++;
                saveCartToLocalStorage();
                updateCartUI();
            }
        });
    });
    
    document.querySelectorAll('.decrement-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = gioHang.find(i => i.id === id);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    gioHang = gioHang.filter(i => i.id !== id);
                }
                saveCartToLocalStorage();
                updateCartUI();
            }
        });
    });
    
    document.querySelectorAll('.delete-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            gioHang = gioHang.filter(i => i.id !== id);
            saveCartToLocalStorage();
            updateCartUI();
            showToast('Đã xóa sản phẩm khỏi giỏ hàng');
        });
    });
};

// ========== THÊM VÀO GIỎ HÀNG ==========
const themVaoGioHang = (product) => {
    const existingItem = gioHang.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        gioHang.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            type: product.type,
            quantity: 1
        });
    }
    
    saveCartToLocalStorage();
    updateCartUI();
    showToast(`Đã thêm ${product.name} vào giỏ hàng`);
};

// ========== HIỂN THỊ DANH SÁCH SẢN PHẨM ==========
const renderDanhSachSP = (danhSach) => {
    if (danhSach.length === 0) {
        productGrid.innerHTML = '';
        noProductsMsg.classList.remove('hidden');
        return;
    }
    
    noProductsMsg.classList.add('hidden');
    
    let html = '';
    for (let i = 0; i < danhSach.length; i++) {
        const phone = danhSach[i];
        const imgUrl = phone.img || phone.image || 'https://placehold.co/300x200?text=Phone';
        const price = Number(phone.price) || 0;
        const type = phone.type || phone.category || 'Điện thoại';
        const desc = phone.desc || phone.description || 'Sản phẩm chất lượng cao';
        
        html += `
            <div class="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300">
                <div class="bg-gray-50 p-4 h-48 flex items-center justify-center">
                    <img src="${imgUrl}" alt="${phone.name}" class="max-h-36 object-contain" onerror="this.src='https://placehold.co/300x200?text=Phone'">
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg truncate" title="${phone.name}">${phone.name}</h3>
                    <p class="text-sm text-gray-500 mt-1">${desc}</p>
                    <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <span class="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">${type}</span>
                        <span class="text-xl font-bold text-red-600">${price.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <button class="add-to-cart-btn w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2" data-id="${phone.id}" data-name="${phone.name}" data-price="${price}" data-image="${imgUrl}" data-type="${type}">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        `;
    }
    productGrid.innerHTML = html;
    
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = {
                id: parseInt(btn.dataset.id),
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price),
                image: btn.dataset.image,
                type: btn.dataset.type
            };
            themVaoGioHang(product);
        });
    });
};

// ========== LỌC SẢN PHẨM ==========
const filterProducts = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filterType = filterSelect.value;
    
    let filtered = [...danhSachSP];
    
    if (filterType !== 'all') {
        filtered = filtered.filter(phone => 
            (phone.type === filterType) || (phone.category === filterType)
        );
    }
    
    if (searchTerm !== '') {
        filtered = filtered.filter(phone => 
            phone.name?.toLowerCase().includes(searchTerm) ||
            phone.desc?.toLowerCase().includes(searchTerm) ||
            phone.description?.toLowerCase().includes(searchTerm)
        );
    }
    
    renderDanhSachSP(filtered);
};

// ========== LẤY DỮ LIỆU TỪ API ==========
const layDanhSachSP = async () => {
    loadingSpinner.classList.remove('hidden');
    productGrid.classList.add('hidden');
    noProductsMsg.classList.add('hidden');
    
    try {
        const response = await axios.get(API_URL);
        danhSachSP = response.data;
        
        loadingSpinner.classList.add('hidden');
        productGrid.classList.remove('hidden');
        renderDanhSachSP(danhSachSP);
        
    } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        loadingSpinner.classList.add('hidden');
        productGrid.classList.add('hidden');
        noProductsMsg.classList.remove('hidden');
        noProductsMsg.innerHTML = '<i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-3"></i><p class="text-red-500">Lỗi tải dữ liệu! Vui lòng thử lại sau.</p>';
    }
};

// ========== MỞ/ĐÓNG GIỎ HÀNG ==========
const openCartSidebar = () => {
    cartOverlay.classList.remove('hidden');
    setTimeout(() => {
        cartSidebar.classList.remove('translate-x-full');
        cartSidebar.classList.add('translate-x-0');
    }, 10);
    renderCartItems();
};

const closeCartSidebar = () => {
    cartSidebar.classList.remove('translate-x-0');
    cartSidebar.classList.add('translate-x-full');
    setTimeout(() => {
        cartOverlay.classList.add('hidden');
    }, 300);
};

// ========== KHỞI TẠO SỰ KIỆN ==========
const initEvents = () => {
    searchInput.addEventListener('input', filterProducts);
    filterSelect.addEventListener('change', filterProducts);
    cartIconBtn.addEventListener('click', openCartSidebar);
    closeCartBtn.addEventListener('click', closeCartSidebar);
    
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) closeCartSidebar();
    });
    
    checkoutBtn.addEventListener('click', () => {
        if (gioHang.length === 0) {
            showToast('Giỏ hàng trống! Hãy thêm sản phẩm.');
            return;
        }
        showToast('Cảm ơn bạn đã mua hàng! (Demo)');
        gioHang = [];
        saveCartToLocalStorage();
        updateCartUI();
        closeCartSidebar();
    });
};

// ========== KHỞI CHẠY ==========
const init = () => {
    initEvents();
    loadCartFromLocalStorage();
    layDanhSachSP();
};

init();
