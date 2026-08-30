process.env.TZ = "Asia/Bangkok"; // ตั้งค่าเวลาเซิร์ฟเวอร์ให้เป็นเวลาประเทศไทย (GMT+7)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ข้อมูลเมนูอาหาร (เพิ่มสถานะ isAvailable)
let menuData = [
    { id: 1, name: "ข้าวผัดสับปะรด", category: "food", price: 259, desc: "สูตรพิเศษ", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80", isAvailable: true },
    { id: 2, name: "ข้าวผัดรถไฟ", category: "food", price: 80, desc: "ข้าวหอมมะลิ", img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80", isAvailable: true },
    { id: 3, name: "สุกี้แห้งหมู", category: "food", price: 80, desc: "น้ำจิ้มรสเด็ด", img: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=300&q=80", isAvailable: true },
    { id: 4, name: "สปาเก็ตตี้", category: "food", price: 139, desc: "คาโบนาร่า", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=300&q=80", isAvailable: true },
    { id: 5, name: "อเมริกาโน่", category: "coffee", price: 65, desc: "คั่วกลาง", img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=300&q=80", isAvailable: true },
    { id: 6, name: "ชาไทยเย็น", category: "drinks", price: 55, desc: "เข้มข้นหอมชา", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80", isAvailable: true }
];

let orders = [];

// API เมนูอาหาร
app.get('/api/menus', (req, res) => res.json(menuData));

// API ปิด/เปิด เมนูอาหาร (ของหมด)
app.put('/api/menus/:id/toggle', (req, res) => {
    const item = menuData.find(m => m.id === parseInt(req.params.id));
    if (item) {
        item.isAvailable = !item.isAvailable;
        res.json({ success: true, item });
    } else {
        res.status(404).json({ message: "ไม่พบเมนู" });
    }
});

// API ออเดอร์
app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: orders.length + 1,
        table: req.body.table || "โต๊ะ 1",
        diningOption: req.body.diningOption || "eat-in",
        paymentMethod: req.body.paymentMethod || "promptpay",
        items: req.body.items,
        totalPrice: req.body.totalPrice,
        status: "pending",
        time: new Date().toLocaleTimeString('th-TH')
    };
    orders.push(newOrder);
    res.json({ success: true, order: newOrder });
});

app.get('/api/orders', (req, res) => {
    // ถ้ามีการส่งชื่อโต๊ะมา ให้กรองส่งกลับไปเฉพาะออเดอร์ของโต๊ะนั้น
    const tableQuery = req.query.table;
    if (tableQuery) {
        const tableOrders = orders.filter(o => o.table === tableQuery);
        return res.json(tableOrders);
    }
    // ถ้าไม่มี ให้ส่งออเดอร์ทั้งหมด
    res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (order) res.json(order);
    else res.status(404).json({ message: "ไม่พบออเดอร์" });
});

app.put('/api/orders/:id/status', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (order) {
        order.status = req.body.status;
        res.json({ success: true, order });
    } else {
        res.status(404).json({ message: "ไม่พบออเดอร์" });
    }
});

// ใช้ process.env.PORT สำหรับขึ้น Render.com
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 เซิร์ฟเวอร์ทำงานที่พอร์ต ${PORT}`));