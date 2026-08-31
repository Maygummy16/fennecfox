process.env.TZ = "Asia/Bangkok"; // ตั้งค่าเวลาเซิร์ฟเวอร์ให้เป็นเวลาประเทศไทย (GMT+7)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ข้อมูลเมนูอาหาร (เพิ่มสถานะ isAvailable)
let menuData = [
    { 
        id: 1, 
        name: "ปลาลุยสวน", 
        category: "ปลา", 
        options: [
            { label: "ปลาช่อน", price: 380 },
            { label: "ปลากะพง", price: 400 }
        ],
        desc: "สูตรพิเศษ", img: "", isAvailable: true 
    },

    { id: 2, name: "ปลาทับทิม/ปลากระพง ทอดนํ้าปลา", category: "ปลา", price: (350,380), desc: "", img: "", isAvailable: true },
    { id: 3, name: "ปลาดุกฟู", category: "ปลา", price: 129, desc: "น้ำจิ้มรสเด็ด", img: "", isAvailable: true },
    { id: 4, name: "ต้มยําทะเล ถ้วย/หม้อไฟ", category: "ต้ม", price: (159,229), desc: "", img: "", isAvailable: true },
    { id: 5, name: "เเกงเลียงกุ้งสด ถ้วย/หม้อไฟ", category: "ต้ม", price: (159,199), desc: "", img: "", isAvailable: true },
    { id: 6, name: "เเกงส้มชะอมกุ้ง ถ้วย/หม้อไฟ", category: "ต้ม", price: (139,199), desc: "", img: "", isAvailable: true },
    { id: 7, name: "เเป๊ะซะปลาซ่อน", category: "ต้ม", price: 349, desc: "", img: "", isAvailable: true },
    { id: 8, name: "ต้มเเซ่บกระดูกอ่อน", category: "ต้ม", price: 139, desc: "", img: "", isAvailable: true },
    { id: 9, name: "ฉู่ฉี่ปลาทู", category: "ต้ม", price: 139, desc: "", img: "", isAvailable: true },
    { id: 10, name: "ต้มจืดเต้าหู้หมูสับ", category: "ต้ม", price: 129, desc: "", img: "", isAvailable: true },
    { id: 11, name: "ไก่ผัดเม็ดมะม่วง", category: "ผัด", price: 149, desc: "", img: "", isAvailable: true },
    { id: 12, name: "ไก่คั่วพริกเกลือ", category: "ผัด", price: 119, desc: "", img: "", isAvailable: true },
    { id: 13, name: "ปีกไก่คั่วพริกเกลือ", category: "ผัด", price: 119, desc: "", img: "", isAvailable: true },
    { id: 14, name: "สามชั้นคั่วพริกเกลือ", category: "ผัด", price: 119, desc: "", img: "", isAvailable: true },
    { id: 15, name: "ผัดพริกไทยดํา หมู,ไก่/ทะเล", category: "ผัด", price: (119,129), desc: "", img: "", isAvailable: true },
    { id: 16, name: "กุ้ง,หมึกผัดซอสมะขาม", category: "ผัด", price: 159, desc: "", img: "", isAvailable: true },
    { id: 17, name: "ผัดบล็อคโคลี่กุ้ง", category: "ผัด", price: 119, desc: "", img: "", isAvailable: true },
    { id: 18, name: "ปลาช่อนผัดขึ้นฉ่าย", category: "ผัด", price: 159, desc: "", img: "", isAvailable: true },
    { id: 19, name: "ปลาช่อนผัดฉ่า", category: "ผัด", price: 159, desc: "", img: "", isAvailable: true },
    { id: 20, name: "ทะเลผัดฉ่า", category: "ผัด", price: 159, desc: "", img: "", isAvailable: true },
    { id: 21, name: "หมึกผัดไข่เค็ม", category: "ผัด", price: 149, desc: "", img: "", isAvailable: true },
    { id: 22, name: "กุ้งอบวุ้นเส้น", category: "นึ่ง", price: 159, desc: "", img: "", isAvailable: true },
    { id: 23, name: "ปลากระพง/ปลาทับทิม นึ่งมะนาว", category: "นึ่ง", price: (350,320), desc: "", img: "", isAvailable: true },
    { id: 24, name: "ปลากระพงนึ่งซีอิ้ว", category: "นึ่ง", price: 370, desc: "", img: "", isAvailable: true },
    { id: 25, name: "หมึกนึ่งมะนาว", category: "นึ่ง", price: 199, desc: "", img: "", isAvailable: true },
    { id: 26, name: "ห่อหมกทะเล", category: "นึ่ง", price: 159, desc: "", img: "", isAvailable: true },
    { id: 27, name: "ไข่ตุ๋นหม้อไฟทะเล", category: "นึ่ง", price: 199, desc: "", img: "", isAvailable: true },
    { id: 28, name: "สเต็กสันคอหมูพริกไทยดํา", category: "สเต๊ก", price: 139, desc: "", img: "", isAvailable: true },
    { id: 29, name: "สเต็กสันคอ นํ้าจิ้มเเจ่ว", category: "สเต๊ก", price: 139, desc: "", img: "", isAvailable: true },
    { id: 30, name: "สเต็กไก่พริกไทยดํา", category: "สเต๊ก", price: 139, desc: "", img: "", isAvailable: true },
    { id: 31, name: "สเต็กไก่ นํ้าจิ้มเเจ่ว", category: "สเต๊ก", price: 139, desc: "", img: "", isAvailable: true },
    { id: 32, name: "สเต็กพอร์คชอป", category: "สเต๊ก", price: 179, desc: "", img: "", isAvailable: true },
    { id: 33, name: "สเต็กเนื้อ", category: "สเต๊ก", price: 179, desc: "", img: "", isAvailable: true },
    { id: 34, name: "สปาเก็ตตี้คาโบนาร่า", category: "สปาเก็ตตี้", price: 139, desc: "", img: "", isAvailable: true },
    { id: 35, name: "สปาเก็ตตี้ขี้เมา หมู,ไก่/ทะเล", category: "สปาเก็ตตี้", price: (139, 159), desc: "", img: "", isAvailable: true },
    { id: 36, name: "สปาเก็ตตี้ซอสมะเขือเทศ", category: "สปาเก็ตตี้", price: 139, desc: "", img: "", isAvailable: true },
    { id: 37, name: "สปาเก็ตตี้เบคอนพริกเเห้ง", category: "สปาเก็ตตี้", price: 149, desc: "", img: "", isAvailable: true },
    { id: 38, name: "ยําวุ้นเส้นทะเล", category: "ยํา", price: 129, desc: "", img: "", isAvailable: true },
    { id: 39, name: "ยําวุ้นเส้นโบราณ", category: "ยํา", price: 100, desc: "", img: "", isAvailable: true },
    { id: 40, name: "ยําวสามกรอบ", category: "ยํา", price: 129, desc: "", img: "", isAvailable: true },
    { id: 41, name: "ยําผักบุ้งกรอบ", category: "ยํา", price: 129, desc: "", img: "", isAvailable: true },
    { id: 42, name: "ยําคะน้ากุ้งสด", category: "ยํา", price: 129, desc: "", img: "", isAvailable: true },
    { id: 43, name: "กุ้งเเช่นํ้าปลา", category: "ยํา", price: 149, desc: "", img: "", isAvailable: true },
    { id: 44, name: "พล่ากุ้ง", category: "ยํา", price: 139, desc: "", img: "", isAvailable: true },
    { id: 45, name: "ลาบหมู", category: "ยํา", price: 100, desc: "", img: "", isAvailable: true },
    { id: 46, name: "หมูมะนาว", category: "ยํา", price: 100, desc: "", img: "", isAvailable: true },
    { id: 47, name: "หลนปู", category: "ยํา", price: 220, desc: "", img: "", isAvailable: true },
    { id: 48, name: "สลัดผักรวม", category: "สลัด", price: 139, desc: "", img: "", isAvailable: true },
    { id: 49, name: "สลัดผักทูน่า", category: "สลัด", price: 159, desc: "", img: "", isAvailable: true },
    { id: 50, name: "สลัดกุ้งทอด", category: "สลัด", price: 159, desc: "", img: "", isAvailable: true },
    { id: 51, name: "สลัด อกไก่ฉีก", category: "สลัด", price: 149, desc: "", img: "", isAvailable: true },
    { id: 52, name: "สลัดไข่", category: "สลัด", price: 139, desc: "", img: "", isAvailable: true },
    { id: 53, name: "สลัดเนื้อจิ้มเเจ่ว", category: "สลัด", price: 149, desc: "", img: "", isAvailable: true },
    { id: 54, name: "ปลาทูบิน", category: "ทอด", price: 139, desc: "", img: "", isAvailable: true },
    { id: 55, name: "เเหนมกระดูกอ่อน", category: "ทอด", price: 149, desc: "", img: "", isAvailable: true },
    { id: 56, name: "เเหนมสามชั้นทอด", category: "ทอด", price: 149, desc: "", img: "", isAvailable: true },
    { id: 57, name: "ทอดมันกุ้ง", category: "ทอด", price: 149, desc: "", img: "", isAvailable: true },
    { id: 58, name: "กุ้งชุบเเป้งทอด", category: "ทอด", price: 129, desc: "", img: "", isAvailable: true },
    { id: 59, name: "ปีกไก่ทอด", category: "ทอด", price: 129, desc: "", img: "", isAvailable: true },
    { id: 60, name: "ปีกไก่ทอดนํ้าปลา", category: "ทอด", price: 129, desc: "", img: "", isAvailable: true },
    { id: 61, name: "ปีกไก่ทอดนํ้าปลา", category: "ทอด", price: 129, desc: "", img: "", isAvailable: true },
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

// API สำหรับเคลียร์ประวัติออเดอร์ของโต๊ะนั้นๆ เมื่อลูกค้าเช็คบิล
app.delete('/api/orders/clear/:table', (req, res) => {
    const tableName = req.params.table;
    // กรองเอาเฉพาะออเดอร์ที่ "ไม่ใช่" ของโต๊ะนี้เก็บไว้ (เท่ากับลบของโต๊ะนี้ทิ้ง)
    orders = orders.filter(o => o.table !== tableName);
    res.json({ success: true, message: `ล้างโต๊ะ ${tableName} เรียบร้อย` });
});

app.listen(PORT, () => console.log(`🚀 เซิร์ฟเวอร์ทำงานที่พอร์ต ${PORT}`));