// ดึงค่า Param จาก URL
const urlParams = new URLSearchParams(window.location.search);
const tableParam = urlParams.get('table');
const typeParam = urlParams.get('type');

let currentTable = "โต๊ะ 1";
let defaultOption = "eat-in";

if (typeParam === 'takeaway' || tableParam === 'takeaway') {
    currentTable = "สั่งกลับบ้าน";
    defaultOption = "takeaway";
} else if (tableParam) {
    currentTable = `โต๊ะ ${tableParam}`;
    defaultOption = "eat-in";
}

document.addEventListener("DOMContentLoaded", () => {
    const optionRadio = document.querySelector(`input[name="dining-option"][value="${defaultOption}"]`);
    if (optionRadio) optionRadio.checked = true;
});

let menuData = [];
let cart = [];
let currentStep = 'cart';
let currentOrderId = null;
let statusCheckInterval = null;
let selectedPaymentMethod = 'promptpay';

async function fetchMenus() {
    try {
        const response = await fetch('/api/menus');
        menuData = await response.json();
        renderMenu(menuData);
    } catch (error) {
        console.error("ไม่สามารถโหลดเมนูได้:", error);
    }
}

function renderMenu(items) {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = `food-card ${!item.isAvailable ? 'out-of-stock' : ''}`;
        
        const actionButton = item.isAvailable 
            ? `<button class="add-btn" onclick="addToCart(${item.id})">+</button>`
            : `<span style="color: red; font-size: 0.8rem; font-weight: bold;">สินค้าหมด</span>`;

        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" style="${!item.isAvailable ? 'filter: grayscale(1); opacity: 0.6;' : ''}">
            <div class="food-info">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="price-row">
                    <span class="price">${item.price} ฿</span>
                    ${actionButton}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function addToCart(id) {
    const product = menuData.find(item => item.id === id);
    if (!product || !product.isAvailable) return;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) cartItem.quantity++;
    else cart.push({ ...product, quantity: 1 });
    
    updateCart();
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('cart-count').innerText = `${totalItems} รายการ`;
    document.getElementById('cart-total').innerText = `${totalPrice} ฿`;
}

function filterMenu(category) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (category === 'all') renderMenu(menuData);
    else renderMenu(menuData.filter(item => item.category === category));
}

function openCartModal() {
    if (cart.length === 0) {
        alert("กรุณาเลือกรายการอาหารก่อนเปิดตะกร้าค่ะ 🦊");
        return;
    }
    document.getElementById('checkout-modal').classList.add('active');
    switchStep('cart');
    renderCartModalItems();
}

function closeCartModal() {
    if (currentStep === 'status' && document.getElementById('finish-order-btn').style.display === 'none') {
        alert("กำลังทำอาหารอยู่ กรุณารอสักครู่นะคะ!");
        return;
    }
    document.getElementById('checkout-modal').classList.remove('active');
}

function switchStep(step) {
    currentStep = step;
    document.getElementById('step-cart-view').style.display = step === 'cart' ? 'block' : 'none';
    document.getElementById('step-payment-view').style.display = step === 'payment' ? 'block' : 'none';
    document.getElementById('step-status-view').style.display = step === 'status' ? 'block' : 'none';
    
    const closeBtn = document.querySelector('.close-modal');
    if (step === 'payment' || (step === 'status' && document.getElementById('finish-order-btn').style.display === 'none')) {
        closeBtn.style.display = 'none';
    } else {
        closeBtn.style.display = 'flex';
    }
}

function renderCartModalItems() {
    const container = document.getElementById('cart-items-list');
    container.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const itemRow = document.createElement('div');
        itemRow.className = 'modal-cart-item';
        itemRow.innerHTML = `
            <div class="modal-item-details">
                <h4>${item.name}</h4>
                <p>${item.price} ฿</p>
            </div>
            <div class="modal-item-qty">
                <button onclick="changeModalQty(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeModalQty(${item.id}, 1)">+</button>
            </div>
        `;
        container.appendChild(itemRow);
    });

    document.getElementById('modal-total-price').innerText = `${totalPrice} ฿`;
}

function changeModalQty(id, change) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) cart = cart.filter(item => item.id !== id);
    }
    updateCart();
    if (cart.length === 0) closeCartModal();
    else renderCartModalItems();
}

function goToPaymentView() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('payment-amount').innerText = `${totalPrice} ฿`;
    switchStep('payment');
    selectPaymentMethod('promptpay');
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    const qrBox = document.getElementById('qr-code-box');
    qrBox.style.display = method === 'promptpay' ? 'block' : 'none';
}

async function submitOrderToBackend() {
    const diningOption = document.querySelector('input[name="dining-option"]:checked').value;
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderPayload = {
        table: currentTable,
        diningOption: diningOption,
        paymentMethod: selectedPaymentMethod,
        items: cart,
        totalPrice: totalPrice
    };

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });
        const data = await res.json();

        if (data.success) {
            currentOrderId = data.order.id;
            switchStep('status');
            startPollingOrderStatus();
        }
    } catch (err) {
        alert("เกิดข้อผิดพลาดในการส่งออเดอร์ กรุณาลองใหม่อีกครั้ง");
    }
}

function startPollingOrderStatus() {
    updateStatusUI('pending');
    
    statusCheckInterval = setInterval(async () => {
        if (!currentOrderId) return;
        try {
            const res = await fetch(`/api/orders/${currentOrderId}`);
            const order = await res.json();
            updateStatusUI(order.status);

            if (order.status === 'completed') {
                clearInterval(statusCheckInterval);
            }
        } catch (err) {
            console.error("เช็คสถานะล้มเหลว:", err);
        }
    }, 2000);
}

function updateStatusUI(status) {
    const s1 = document.getElementById('status-1');
    const s2 = document.getElementById('status-2');
    const s3 = document.getElementById('status-3');
    const l1 = document.getElementById('line-1');
    const l2 = document.getElementById('line-2');
    const desc = document.getElementById('status-description');
    const finishBtn = document.getElementById('finish-order-btn');

    if (status === 'pending') {
        s1.className = "status-step active";
        s2.className = "status-step";
        s3.className = "status-step";
        l1.className = "status-line";
        l2.className = "status-line";
        desc.innerText = "📩 ส่งรายการอาหารเข้าครัวเรียบร้อยแล้ว กรอยืนยันสักครู่...";
        finishBtn.style.display = 'none';
    } else if (status === 'cooking') {
        s1.className = "status-step active";
        s2.className = "status-step active";
        s3.className = "status-step";
        l1.className = "status-line active";
        l2.className = "status-line";
        desc.innerText = "🍳 เชฟกำลังปรุงเมนูของคุณอยู่ในครัว...";
        finishBtn.style.display = 'none';
    } else if (status === 'completed') {
        s1.className = "status-step active";
        s2.className = "status-step active";
        s3.className = "status-step active";
        l1.className = "status-line active";
        l2.className = "status-line active";
        desc.innerText = "✨ อาหารของคุณเสร็จเรียบร้อยแล้ว เชิญรับประทานได้เลยค่ะ! 🦊☕";
        finishBtn.style.display = 'block';
        document.querySelector('.close-modal').style.display = 'flex';
    }
}

function resetCartAndClose() {
    cart = [];
    updateCart();
    closeCartModal();
}

fetchMenus();
// รีเฟรชเช็คเมนูโดนปิด/เปิด ทุก 5 วินาที
setInterval(fetchMenus, 5000);