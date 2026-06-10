// ===== 暖家生活馆 · 主程序 =====

// ---------- 商品数据（使用本地图片）----------
const products = [
    { id: 1, name: "🍵 手作陶瓷马克杯", price: 68, category: "餐具", image: "images/product1.jpg", desc: "手工釉色，温润手感，每一只都是独一无二的艺术品。采用优质陶土，经过1200度高温烧制，釉面光滑易清洗。" },
    { id: 2, name: "🕯️ 暖光香薰蜡烛", price: 45, category: "香氛", image: "images/product2.jpg", desc: "薰衣草香，助眠舒缓，燃烧时间约30小时。天然大豆蜡制作，不含石蜡，香味温和不刺鼻。" },
    { id: 3, name: "🧸 软糯抱枕", price: 89, category: "布艺", image: "images/product3.jpg", desc: "天鹅绒面料，舒适柔软，45x45cm。可作为腰靠或抱枕，给居家时光增添一份温暖。" },
    { id: 4, name: "🪴 北欧风小盆栽", price: 35, category: "绿植", image: "images/product4.jpg", desc: "好养活，净化空气，适合摆放在书桌或窗台。配简约陶瓷盆，送营养土。" },
    { id: 5, name: "💡 温馨小夜灯", price: 59, category: "灯具", image: "images/product5.jpg", desc: "暖黄光，可调亮度，USB充电。触摸开关，三档亮度调节，夜晚起夜不刺眼。" },
    { id: 6, name: "🧺 编织收纳篮", price: 49, category: "收纳", image: "images/product6.jpg", desc: "手工编织，自然风，大容量可收纳杂物。采用天然水草编织，环保耐用。" },
    { id: 7, name: "☕ 手冲咖啡壶", price: 99, category: "餐具", image: "images/product7.jpg", desc: "玻璃+不锈钢，新手友好，600ml容量。适合家庭手冲咖啡，享受慢生活。" },
    { id: 8, name: "🧦 毛绒家居拖鞋", price: 39, category: "布艺", image: "images/product8.jpg", desc: "厚底防滑，保暖舒适，均码35-40码。内里加厚绒毛，冬天不冻脚。" }
];

// 轮播图图片（使用本地图片）
const bannerImages = [
    "images/banner1.jpg",
    "images/banner2.jpg",
    "images/banner3.jpg"
];

// ---------- 全局变量 ----------
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 'home';
let currentCategory = 'all';
let searchKeyword = '';
let currentSort = 'default';
let currentPageNum = 1;      // 当前页码
const pageSize = 6;           // 每页显示数量

// ---------- DOM 元素 ----------
let app, cartCountSpan, userNameSpan, loginBtn;

// ---------- 辅助函数 ----------
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartSpan = document.getElementById('cartCount');
    if (cartSpan) cartSpan.innerText = count;
}

function updateUserUI() {
    if (userNameSpan) {
        userNameSpan.innerText = currentUser ? currentUser.name : '游客';
    }
    if (loginBtn) {
        loginBtn.innerText = currentUser ? '退出' : '登录';
    }
}

// 添加购物车（需要登录）
function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        alert('💗 请先登录后再添加商品到购物车~');
        document.getElementById('loginModal').style.display = 'flex';
        return false;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return false;
    
    const existItem = cart.find(item => item.id === productId);
    if (existItem) {
        existItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    saveCart();
    alert(`✨ ${product.name} 已加入购物车`);
    return true;
}

// ---------- 轮播图 ----------
let currentSlide = 0;
let slideInterval;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!slides.length || !dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    
    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (dotsContainer.children[i]) {
                dotsContainer.children[i].classList.remove('active');
            }
        });
        slides[index].classList.add('active');
        if (dotsContainer.children[index]) {
            dotsContainer.children[index].classList.add('active');
        }
        currentSlide = index;
    }
    
    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }
    
    function prevSlide() {
        let prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        const newPrevBtn = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        newPrevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }
    
    if (nextBtn) {
        const newNextBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        newNextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }
    
    function resetInterval() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
    }
    
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4000);
}

// ---------- 分页函数 ----------
function getPaginatedProducts(productsArray) {
    const start = (currentPageNum - 1) * pageSize;
    const end = start + pageSize;
    return productsArray.slice(start, end);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return '';
    
    let paginationHtml = '<div class="pagination">';
    
    paginationHtml += `<button class="page-btn ${currentPageNum === 1 ? 'disabled' : ''}" data-page="${currentPageNum - 1}" ${currentPageNum === 1 ? 'disabled' : ''}>‹ 上一页</button>`;
    
    const maxVisible = 5;
    let startPage = Math.max(1, currentPageNum - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        paginationHtml += `<button class="page-btn" data-page="1">1</button>`;
        if (startPage > 2) paginationHtml += `<span class="page-ellipsis">...</span>`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `<button class="page-btn ${currentPageNum === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) paginationHtml += `<span class="page-ellipsis">...</span>`;
        paginationHtml += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    paginationHtml += `<button class="page-btn ${currentPageNum === totalPages ? 'disabled' : ''}" data-page="${currentPageNum + 1}" ${currentPageNum === totalPages ? 'disabled' : ''}>下一页 ›</button>`;
    
    paginationHtml += '</div>';
    return paginationHtml;
}

// ---------- 首页渲染（带分页）----------
function renderHome() {
    let filteredProducts = [...products];
    
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }
    
    if (searchKeyword) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }
    
    if (currentSort !== 'default') {
        if (currentSort === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }
    }
    
    const totalItems = filteredProducts.length;
    const paginatedProducts = getPaginatedProducts(filteredProducts);
    
    const categoriesHtml = `
        <div class="categories">
            <button class="cat-btn ${currentCategory === 'all' ? 'active' : ''}" data-cat="all">全部</button>
            <button class="cat-btn ${currentCategory === '餐具' ? 'active' : ''}" data-cat="餐具">🍽️ 餐具</button>
            <button class="cat-btn ${currentCategory === '香氛' ? 'active' : ''}" data-cat="香氛">🌸 香氛</button>
            <button class="cat-btn ${currentCategory === '布艺' ? 'active' : ''}" data-cat="布艺">🧵 布艺</button>
            <button class="cat-btn ${currentCategory === '绿植' ? 'active' : ''}" data-cat="绿植">🌿 绿植</button>
            <button class="cat-btn ${currentCategory === '灯具' ? 'active' : ''}" data-cat="灯具">💡 灯具</button>
            <button class="cat-btn ${currentCategory === '收纳' ? 'active' : ''}" data-cat="收纳">📦 收纳</button>
        </div>
    `;
    
    const sortHtml = `
        <div class="sort-bar">
            <span class="sort-label">排序：</span>
            <button class="sort-btn ${currentSort === 'default' ? 'active' : ''}" data-sort="default">默认</button>
            <button class="sort-btn ${currentSort === 'price-asc' ? 'active' : ''}" data-sort="price-asc">价格 ↑ 低到高</button>
            <button class="sort-btn ${currentSort === 'price-desc' ? 'active' : ''}" data-sort="price-desc">价格 ↓ 高到低</button>
        </div>
    `;
    
    const productsHtml = `
        <div class="products-grid">
            ${paginatedProducts.map(p => `
                <div class="product-card" data-id="${p.id}">
                    <img class="product-img" src="${p.image}" alt="${p.name}" onerror="this.src='https://picsum.photos/id/20/300/200'">
                    <div class="product-info">
                        <div class="product-title">${p.name}</div>
                        <div class="product-price">¥${p.price}</div>
                        <button class="add-cart" data-id="${p.id}">🛒 加入购物车</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    const emptyHtml = `<div class="empty-cart">😊 没有找到相关商品，试试其他关键词吧</div>`;
    const paginationHtml = totalItems > pageSize ? renderPagination(totalItems) : '';
    
    const carouselSlidesHtml = bannerImages.map((img, index) => `
        <div class="carousel-slide ${index === 0 ? 'active' : ''}">
            <img src="${img}" alt="轮播图${index + 1}" onerror="this.src='https://picsum.photos/id/13/1200/400'">
        </div>
    `).join('');
    
    app.innerHTML = `
        <div class="carousel">
            <div class="carousel-container" id="carouselContainer">
                ${carouselSlidesHtml}
            </div>
            <button class="carousel-btn prev" id="prevBtn">◀</button>
            <button class="carousel-btn next" id="nextBtn">▶</button>
            <div class="carousel-dots" id="carouselDots"></div>
        </div>
        
        <div class="search-section">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="搜索暖心好物..." value="${searchKeyword}">
                <button id="searchBtn">🔍 搜索</button>
            </div>
        </div>
        
        ${categoriesHtml}
        ${sortHtml}
        
        <div class="section-title">
            <span>✨ 今日暖心推荐</span>
            <span style="font-size:14px; color:#b08a6a;">共 ${totalItems} 件商品</span>
        </div>
        ${paginatedProducts.length > 0 ? productsHtml : emptyHtml}
        ${paginationHtml}
    `;
    
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.cat;
            currentPageNum = 1;
            renderHome();
        });
    });
    
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentSort = e.target.dataset.sort;
            currentPageNum = 1;
            renderHome();
        });
    });
    
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = parseInt(e.target.dataset.page);
            if (page && !isNaN(page) && page !== currentPageNum) {
                currentPageNum = page;
                renderHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    
    document.querySelectorAll('.add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.id));
        });
    });
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-cart')) return;
            const id = parseInt(card.dataset.id);
            showProductDetail(id);
        });
    });
    
    document.getElementById('searchBtn')?.addEventListener('click', () => {
        searchKeyword = document.getElementById('searchInput').value;
        currentPageNum = 1;
        renderHome();
    });
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchKeyword = e.target.value;
            currentPageNum = 1;
            renderHome();
        }
    });
    
    initCarousel();
}

// ---------- 商品详情页 ----------
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('app').style.display = 'none';
    document.getElementById('productDetailPage').style.display = 'block';
    
    let quantity = 1;
    
    const detailHtml = `
        <button class="detail-back-btn" id="detailBackBtn">← 返回首页</button>
        <div class="product-detail">
            <div class="detail-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://picsum.photos/id/20/500/500'">
            </div>
            <div class="detail-info">
                <h1>${product.name}</h1>
                <div class="detail-price">¥${product.price}</div>
                <div class="detail-desc">${product.desc}</div>
                <div class="detail-quantity">
                    <label>数量：</label>
                    <div class="quantity-control">
                        <button id="detailMinusBtn">-</button>
                        <span id="detailQuantity">1</span>
                        <button id="detailPlusBtn">+</button>
                    </div>
                </div>
                <button class="detail-add-cart" id="detailAddCartBtn">🛒 加入购物车</button>
            </div>
        </div>
    `;
    
    document.getElementById('productDetailContainer').innerHTML = detailHtml;
    
    document.getElementById('detailBackBtn').addEventListener('click', () => {
        document.getElementById('app').style.display = 'block';
        document.getElementById('productDetailPage').style.display = 'none';
        renderHome();
    });
    
    document.getElementById('detailMinusBtn').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            document.getElementById('detailQuantity').innerText = quantity;
        }
    });
    
    document.getElementById('detailPlusBtn').addEventListener('click', () => {
        quantity++;
        document.getElementById('detailQuantity').innerText = quantity;
    });
    
    document.getElementById('detailAddCartBtn').addEventListener('click', () => {
        addToCart(productId, quantity);
    });
}

// ---------- 结算页面相关函数 ----------
function showCheckoutPage() {
    document.getElementById('app').style.display = 'none';
    document.getElementById('checkoutPage').style.display = 'block';
    renderCheckoutItems();
    
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateTotalAmount();
        });
    });
    
    const submitBtn = document.getElementById('submitOrderBtn');
    if (submitBtn) {
        submitBtn.onclick = submitOrder;
    }
    
    const backBtn = document.getElementById('backToCartBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            document.getElementById('app').style.display = 'block';
            document.getElementById('checkoutPage').style.display = 'none';
            renderCart();
        };
    }
}

function renderCheckoutItems() {
    const container = document.getElementById('checkoutItemsList');
    if (!container) return;
    
    let subtotal = 0;
    container.innerHTML = '';
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checkout-item';
        itemDiv.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>¥${item.price * item.quantity}</span>
        `;
        container.appendChild(itemDiv);
    });
    
    document.getElementById('subtotal').innerText = `¥${subtotal}`;
    
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    let deliveryFee = 8;
    if (selectedDelivery) {
        if (selectedDelivery.value === '同城闪送') deliveryFee = 15;
        else if (selectedDelivery.value === '到店自提') deliveryFee = 0;
        else deliveryFee = 8;
    }
    document.getElementById('deliveryFee').innerText = `¥${deliveryFee}`;
    document.getElementById('totalAmount').innerText = `¥${subtotal + deliveryFee}`;
}

function updateTotalAmount() {
    const subtotalText = document.getElementById('subtotal').innerText;
    const subtotal = parseInt(subtotalText.replace('¥', '')) || 0;
    
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    let deliveryFee = 8;
    if (selectedDelivery) {
        if (selectedDelivery.value === '同城闪送') deliveryFee = 15;
        else if (selectedDelivery.value === '到店自提') deliveryFee = 0;
        else deliveryFee = 8;
    }
    
    document.getElementById('deliveryFee').innerText = `¥${deliveryFee}`;
    document.getElementById('totalAmount').innerText = `¥${subtotal + deliveryFee}`;
}

// 提交订单 - 显示扫码支付弹窗
function submitOrder() {
    const receiverName = document.getElementById('receiverName')?.value.trim();
    const receiverPhone = document.getElementById('receiverPhone')?.value.trim();
    const receiverAddress = document.getElementById('receiverAddress')?.value.trim();
    
    if (!receiverName) {
        alert('请填写收货人姓名');
        return;
    }
    if (!receiverPhone) {
        alert('请填写手机号码');
        return;
    }
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(receiverPhone)) {
        alert('请填写正确的11位手机号码');
        return;
    }
    if (!receiverAddress) {
        alert('请填写详细地址');
        return;
    }
    
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    const deliveryMethod = selectedDelivery ? selectedDelivery.value : '快递配送';
    
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = selectedPayment ? selectedPayment.value : '微信支付';
    
    const totalText = document.getElementById('totalAmount').innerText;
    const totalAmount = parseInt(totalText.replace('¥', '')) || 0;
    
    const orderNo = 'ORD' + new Date().getTime() + Math.floor(Math.random() * 1000);
    
    window.pendingOrder = {
        orderNo: orderNo,
        date: new Date().toLocaleString(),
        items: [...cart],
        receiver: {
            name: receiverName,
            phone: receiverPhone,
            address: receiverAddress
        },
        delivery: deliveryMethod,
        payment: paymentMethod,
        total: totalAmount,
        status: '待支付'
    };
    
    const payModal = document.getElementById('payModal');
    if (payModal) {
        payModal.style.display = 'flex';
    }
    
    const payCompleteBtn = document.getElementById('payCompleteBtn');
    const payCancelBtn = document.getElementById('payCancelBtn');
    const closePayModal = document.getElementById('closePayModal');
    
    const onPayComplete = () => {
        // 计算本次订单获得的积分（每消费1元得1积分）
        const earnedPoints = Math.floor(window.pendingOrder.total);
        
        // 获取当前用户积分
        let userPoints = JSON.parse(localStorage.getItem('userPoints')) || {};
        let currentPoints = userPoints[currentUser.phone] || 0;
        let newPoints = currentPoints + earnedPoints;
        userPoints[currentUser.phone] = newPoints;
        localStorage.setItem('userPoints', JSON.stringify(userPoints));
        
        // 保存订单（使用当前登录用户的手机号关联）
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        window.pendingOrder.status = '待发货';
        window.pendingOrder.earnedPoints = earnedPoints;
        window.pendingOrder.userPhone = currentUser.phone;  // 用登录用户手机号关联订单
        orders.push(window.pendingOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // 清空购物车
        cart = [];
        saveCart();
        
        // 关闭弹窗
        payModal.style.display = 'none';
        
        // 显示成功信息（包含积分）
        alert(`🎉 支付成功！订单已提交\n\n订单号：${window.pendingOrder.orderNo}\n实付金额：¥${window.pendingOrder.total}\n获得积分：+${earnedPoints}分\n\n我们会尽快为您发货~`);
        
        // 返回购物车页面（已清空）
        document.getElementById('app').style.display = 'block';
        document.getElementById('checkoutPage').style.display = 'none';
        renderCart();
        updateCartCount();
        
        // 清理临时订单
        window.pendingOrder = null;
        
        // 移除事件监听
        payCompleteBtn.removeEventListener('click', onPayComplete);
        payCancelBtn.removeEventListener('click', onPayCancel);
        closePayModal.removeEventListener('click', onPayCancel);
    };
    
    const onPayCancel = () => {
        payModal.style.display = 'none';
        window.pendingOrder = null;
        payCompleteBtn.removeEventListener('click', onPayComplete);
        payCancelBtn.removeEventListener('click', onPayCancel);
        closePayModal.removeEventListener('click', onPayCancel);
    };
    
    payCompleteBtn.addEventListener('click', onPayComplete);
    payCancelBtn.addEventListener('click', onPayCancel);
    closePayModal.addEventListener('click', onPayCancel);
    
    const closeModalOnBg = (e) => {
        if (e.target === payModal) {
            onPayCancel();
            window.removeEventListener('click', closeModalOnBg);
        }
    };
    window.addEventListener('click', closeModalOnBg);
}

// ---------- 购物车页面 ----------
function renderCart() {
    if (!currentUser) {
        app.innerHTML = `
            <div class="empty-cart">
                🛒 购物车需要先登录~<br><br>
                <button class="checkout-btn" id="loginFirstBtn">立即登录</button>
            </div>
        `;
        document.getElementById('loginFirstBtn')?.addEventListener('click', () => {
            document.getElementById('loginModal').style.display = 'flex';
        });
        return;
    }
    
    if (cart.length === 0) {
        app.innerHTML = `
            <div class="empty-cart">
                🛒 购物车还是空的~<br><br>
                <button class="go-home-btn" id="goHomeFromCartBtn">🏠 去首页逛逛</button>
            </div>
        `;
        document.getElementById('goHomeFromCartBtn')?.addEventListener('click', () => {
            renderPage('home');
        });
        return;
    }
    
    let total = 0;
    const itemsHtml = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item" data-id="${item.id}">
                <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://picsum.photos/id/20/70/70'">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">¥${item.price}</div>
                </div>
                <div class="cart-quantity">
                    <button class="cart-dec" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-inc" data-id="${item.id}">+</button>
                </div>
                <button class="cart-remove" data-id="${item.id}" style="background:none;border:none;font-size:20px;cursor:pointer;">🗑️</button>
            </div>
        `;
    }).join('');
    
    app.innerHTML = `
        <div class="cart-container">
            ${itemsHtml}
            <div class="cart-total">
                <strong>合计：¥${total}</strong>
                <div><button class="checkout-btn" id="checkoutBtn">去结算 🎁</button></div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.cart-dec').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                if (item.quantity > 1) item.quantity--;
                else cart = cart.filter(i => i.id !== id);
                saveCart();
                renderCart();
            }
        });
    });
    
    document.querySelectorAll('.cart-inc').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) item.quantity++;
            saveCart();
            renderCart();
        });
    });
    
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            cart = cart.filter(i => i.id !== id);
            saveCart();
            renderCart();
        });
    });
    
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('购物车是空的~');
            return;
        }
        showCheckoutPage();
    });
}

// ---------- 个人中心（带积分和订单）----------
function renderProfile() {
    if (!currentUser) {
        app.innerHTML = `
            <div class="profile-card">
                <div class="avatar">👤</div>
                <h3>未登录</h3>
                <p>登录后可以查看订单和收藏哦~</p>
                <button class="logout-btn" id="goLoginBtn">去登录</button>
            </div>
        `;
        document.getElementById('goLoginBtn')?.addEventListener('click', () => {
            document.getElementById('loginModal').style.display = 'flex';
        });
        return;
    }
    
    // 获取用户积分
    let userPoints = JSON.parse(localStorage.getItem('userPoints')) || {};
    let currentPoints = userPoints[currentUser.phone] || 0;
    
    // 获取当前用户的订单（使用 userPhone 字段关联）
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(o => o.userPhone === currentUser.phone);
    
    let ordersHtml = '';
    if (userOrders.length > 0) {
        ordersHtml = `
            <div class="order-list">
                <h3>📦 我的订单 <span style="font-size:14px; color:#b08a6a;">(${userOrders.length}个订单)</span></h3>
                ${userOrders.map((order, index) => `
                    <div class="order-item" data-order-index="${index}">
                        <div class="order-header">
                            <span class="order-no">订单号：${order.orderNo}</span>
                            <span class="order-status ${order.status === '已完成' ? 'status-completed' : 'status-pending'}">${order.status}</span>
                        </div>
                        <div class="order-date">📅 下单时间：${order.date}</div>
                        <div class="order-info">
                            <span>📦 共 ${order.items.reduce((sum, i) => sum + i.quantity, 0)} 件商品</span>
                            <span>💰 实付：¥${order.total}</span>
                            ${order.earnedPoints ? `<span>⭐ +${order.earnedPoints}分</span>` : ''}
                        </div>
                        <button class="view-order-btn" data-order-id="${order.orderNo}">查看详情 ∨</button>
                        <div class="order-detail" id="orderDetail-${order.orderNo}" style="display:none;">
                            <div class="order-detail-title">商品清单：</div>
                            ${order.items.map(item => `
                                <div class="order-detail-item">
                                    <span>${item.name}</span>
                                    <span>x ${item.quantity}</span>
                                    <span>¥${item.price * item.quantity}</span>
                                </div>
                            `).join('')}
                            <div class="order-address">
                                <div>🏠 收货信息：</div>
                                <div>${order.receiver.name} ${order.receiver.phone}</div>
                                <div>${order.receiver.address}</div>
                            </div>
                            <div class="order-delivery">🚚 配送方式：${order.delivery}</div>
                            <div class="order-payment">💳 支付方式：${order.payment}</div>
                            ${order.status === '待发货' ? `<button class="confirm-order-btn" data-order-no="${order.orderNo}">✓ 确认收货</button>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        ordersHtml = `
            <div class="order-list">
                <h3>📦 我的订单</h3>
                <div class="empty-orders">
                    <p>🛒 暂无订单</p>
                    <p class="empty-hint">去首页挑选几件暖心好物吧~</p>
                    <button class="go-shop-btn" id="goShopBtn">去逛逛</button>
                </div>
            </div>
        `;
    }
    
    app.innerHTML = `
        <div class="profile-card">
            <div class="avatar">🧸</div>
            <h3>${currentUser.name}</h3>
            <p>📞 ${currentUser.phone}</p>
            <p>⭐ 暖心会员 · 积分 <span id="userPoints">${currentPoints}</span> 分</p>
            <p class="points-tip" style="font-size:12px; color:#b08a6a; margin-top:5px;">💡 消费 ¥1 = 1积分</p>
            <button class="logout-btn" id="logoutBtn">退出登录</button>
        </div>
        <div class="profile-card">
            ${ordersHtml}
        </div>
    `;
    
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUserUI();
        renderProfile();
        alert('已退出登录，期待你下次光临~');
    });
    
    document.getElementById('goShopBtn')?.addEventListener('click', () => {
        renderPage('home');
    });
    
    document.querySelectorAll('.view-order-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderId = btn.dataset.orderId;
            const detailDiv = document.getElementById(`orderDetail-${orderId}`);
            if (detailDiv) {
                if (detailDiv.style.display === 'none') {
                    detailDiv.style.display = 'block';
                    btn.innerHTML = '收起详情 ∧';
                } else {
                    detailDiv.style.display = 'none';
                    btn.innerHTML = '查看详情 ∨';
                }
            }
        });
    });
    
    document.querySelectorAll('.confirm-order-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderNo = btn.dataset.orderNo;
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const orderIndex = orders.findIndex(o => o.orderNo === orderNo);
            if (orderIndex !== -1) {
                orders[orderIndex].status = '已完成';
                localStorage.setItem('orders', JSON.stringify(orders));
                renderProfile();
                alert('🎉 已确认收货，感谢你的支持！');
            }
        });
    });
}

// ---------- 页面路由 ----------
function renderPage(page) {
    const checkoutPage = document.getElementById('checkoutPage');
    const productDetailPage = document.getElementById('productDetailPage');
    const appDiv = document.getElementById('app');
    
    if (checkoutPage) checkoutPage.style.display = 'none';
    if (productDetailPage) productDetailPage.style.display = 'none';
    if (appDiv) appDiv.style.display = 'block';
    
    currentPage = page;
    if (page === 'home') {
        currentPageNum = 1;
        renderHome();
    } else if (page === 'cart') renderCart();
    else if (page === 'profile') renderProfile();
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) link.classList.add('active');
    });
}

// ---------- 登录注册逻辑 ----------
function initAuth() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginBtn.addEventListener('click', () => {
        if (currentUser) {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUserUI();
            renderPage(currentPage);
            alert('已退出登录，期待你下次光临~');
        } else {
            loginModal.style.display = 'flex';
        }
    });
    
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
    });
    
    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });
    
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const account = document.getElementById('loginAccount').value;
        const password = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => (u.phone === account || u.name === account) && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateUserUI();
            loginModal.style.display = 'none';
            renderPage(currentPage);
            alert(`欢迎回来，${user.name}~ 🏠`);
        } else {
            alert('账号或密码错误，请重试');
        }
    });
    
    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        
        if (!name) {
            alert('请填写昵称');
            return;
        }
        
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phone) {
            alert('请填写手机号');
            return;
        }
        if (!phoneRegex.test(phone)) {
            alert('手机号必须是11位有效数字（以13-19开头）');
            return;
        }
        
        if (!password) {
            alert('请填写密码');
            return;
        }
        if (password.length < 6) {
            alert('密码长度不能少于6位，请重新输入');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.phone === phone)) {
            alert('该手机号已注册，请直接登录');
            return;
        }
        
        const newUser = { name, phone, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('🎉 注册成功！请登录~');
        
        document.getElementById('regName').value = '';
        document.getElementById('regPhone').value = '';
        document.getElementById('regPassword').value = '';
        
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === registerModal) registerModal.style.display = 'none';
    });
}

// ---------- 初始化 ----------
document.addEventListener('DOMContentLoaded', () => {
    app = document.getElementById('app');
    cartCountSpan = document.getElementById('cartCount');
    userNameSpan = document.getElementById('userName');
    loginBtn = document.getElementById('loginBtn');
    
    updateCartCount();
    updateUserUI();
    initAuth();
    renderPage('home');
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            if ((page === 'cart' || page === 'profile') && !currentUser) {
                alert('💗 请先登录后再访问~');
                document.getElementById('loginModal').style.display = 'flex';
                return;
            }
            
            if (page) renderPage(page);
        });
    });
    
    // 回到顶部按钮
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});