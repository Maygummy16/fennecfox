
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
    updateOrdersBadge();
});

let menuData = [];
let cart = [];
let currentStep = 'cart';
let selectedPaymentMethod = 'promptpay';
let statusCheckInterval = null;

// ฟังก์ชันช่วยสร้างชื่อ Key ให้แยกตามโต๊ะ เช่น my_cafe_orders_โต๊ะ 1
function getStorageKey() {
    return `my_cafe_orders_${currentTable}`;
}

function getMyOrderIds() {
    // เปลี่ยนมาดึงข้อมูลตาม Key ของโต๊ะนั้นๆ
    return JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
}

function saveMyOrderId(id) {
    const ids = getMyOrderIds();
    if (!ids.includes(id)) {
        ids.push(id);
        // บันทึกข้อมูลแยกตาม Key ของโต๊ะ
        localStorage.setItem(getStorageKey(), JSON.stringify(ids));
    }
    updateOrdersBadge();
}

function updateOrdersBadge() {
    const ids = getMyOrderIds();
    const badge = document.getElementById('orders-badge');
    if (ids.length > 0) {
        badge.innerText = ids.length;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

async function fetchMenus() {
    try {
        const response = await fetch('/api/menus');
        menuData = await response.json();
        renderMenu(menuData);
    } catch (error) {}
}

function renderMenu(items) {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = `food-card ${!item.isAvailable ? 'out-of-stock' : ''}`;
        
        const actionButton = item.isAvailable 
            ? `<button class="add-btn" onclick="addToCart(${item.id})">+</button>`
            : `<span style="color: red; font-size: 0.8rem; font-weight: bold;">หมด</span>`;

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
    if (cart.length === 0) return alert("ตะกร้าว่างเปล่าค่ะ 🦊");
    document.getElementById('checkout-modal').classList.add('active');
    switchStep('cart');
    renderCartModalItems();
}

function openMyOrdersModal() {
    if (getMyOrderIds().length === 0) return alert("ยังไม่มีรายการออเดอร์ค่ะ");
    document.getElementById('checkout-modal').classList.add('active');
    switchStep('status');
    startPollingAllOrders();
}

function closeCartModal() {
    document.getElementById('checkout-modal').classList.remove('active');
    if (statusCheckInterval) clearInterval(statusCheckInterval);
}

function switchStep(step) {
    currentStep = step;
    document.getElementById('step-cart-view').style.display = step === 'cart' ? 'block' : 'none';
    document.getElementById('step-status-view').style.display = step === 'status' ? 'block' : 'none';
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

async function submitOrderToBackend() {
    const diningOption = document.querySelector('input[name="dining-option"]:checked').value;
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderPayload = {
        table: currentTable,
        diningOption: diningOption,
        paymentMethod: "ชำระภายหลัง", // หรือใส่เป็นอย่างอื่นตามต้องการ
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
            cart = [];
            updateCart();
            switchStep('status');
            startPollingAllOrders();
        }
    } catch (err) {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
}

function startPollingAllOrders() {
    fetchAndRenderAllOrders();
    if (statusCheckInterval) clearInterval(statusCheckInterval);
    statusCheckInterval = setInterval(fetchAndRenderAllOrders, 3000);
}

async function fetchAndRenderAllOrders() {
    const container = document.getElementById('my-orders-list-container');
    
    try {
        // ดึงออเดอร์ทั้งหมดของโต๊ะปัจจุบันจากเซิร์ฟเวอร์
        const res = await fetch(`/api/orders?table=${encodeURIComponent(currentTable)}`);
        if (!res.ok) return;
        const tableOrders = await res.json();

        if (tableOrders.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 20px;">ยังไม่มีออเดอร์สำหรับโต๊ะนี้</p>';
            return;
        }

        let html = '';
        // วนลูปจากหลังมาหน้า เพื่อให้ออเดอร์ล่าสุดอยู่บนสุด
        for (let i = tableOrders.length - 1; i >= 0; i--) {
            const order = tableOrders[i];

            let statusText = "📩 กำลังส่งรายการเข้าครัว...";
            let s1 = "active", s2 = "", s3 = "", l1 = "", l2 = "";

            if (order.status === 'cooking') {
                statusText = "🍳 เชฟกำลังปรุงเมนู...";
                s2 = "active"; l1 = "active";
            } else if (order.status === 'completed') {
                statusText = "✨ อาหารเสร็จเรียบร้อยแล้ว!";
                s2 = "active"; s3 = "active"; l1 = "active"; l2 = "active";
            }

            const itemsStr = order.items.map(item => `${item.name} x${item.quantity}`).join(', ');

            html += `
                <div class="multi-order-card">
                    <div class="multi-order-header"><b>ออเดอร์ #${order.id}</b> <span>${order.time}</span></div>
                    <p class="multi-order-items">${itemsStr}</p>
                    <div class="status-stepper" style="margin: 15px 0;">
                        <div class="status-step ${s1}"><div class="step-icon">🛒</div></div>
                        <div class="status-line ${l1}"></div>
                        <div class="status-step ${s2}"><div class="step-icon">🔥</div></div>
                        <div class="status-line ${l2}"></div>
                        <div class="status-step ${s3}"><div class="step-icon">✅</div></div>
                    </div>
                    <div class="status-box" style="margin-bottom: 0; padding: 10px;"><p id="status-description">${statusText}</p></div>
                </div>
            `;
        }
        container.innerHTML = html;
    } catch (err) {
        console.error("Fetch orders error:", err);
    }
}

// อัปเดตตัวเลขแจ้งเตือนบนปุ่ม "ออเดอร์ของโต๊ะ"
async function updateOrdersBadge() {
    try {
        const res = await fetch(`/api/orders?table=${encodeURIComponent(currentTable)}`);
        const tableOrders = await res.json();
        const badge = document.getElementById('orders-badge');
        
        if (tableOrders.length > 0) {
            badge.innerText = tableOrders.length;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    } catch (err) {}
}

// ปรับให้ปุ่มเปิด Modal ไม่ต้องเช็ค localStorage แล้ว
function openMyOrdersModal() {
    document.getElementById('checkout-modal').classList.add('active');
    switchStep('status');
    startPollingAllOrders();
}

fetchMenus();
setInterval(fetchMenus, 5000);

async function clearTableOrders() {
    if (!confirm(`ต้องการล้างประวัติออเดอร์ของ ${currentTable} เพื่อรับลูกค้าใหม่ใช่ไหม?`)) return;
    
    try {
        const res = await fetch(`/api/orders/clear/${encodeURIComponent(currentTable)}`, { method: 'DELETE' });
        if (res.ok) {
            alert("เคลียร์โต๊ะเรียบร้อย เตรียมรับลูกค้าใหม่ได้เลย ✨");
            fetchAndRenderAllOrders(); 
            updateOrdersBadge(); 
            closeCartModal();
        }
    } catch (err) {
        alert("เกิดข้อผิดพลาดในการล้างโต๊ะ");
    }
}