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
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 2, 
        name: "ปลาทอดนํ้าปลา", 
        category: "ปลา", 
        options: [
            { label: "ปลาทับทิม", price: 350 },
            { label: "ปลากะพง", price: 380 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { id: 3, name: "ปลาดุกฟู", category: "ปลา", price: 129, desc: "น้ำจิ้มรสเด็ด", img: "", isAvailable: true },

    { 
        id: 4, 
        name: "ต้มยําทะเล", 
        category: "ปลา", 
        options: [
            { label: "ถ้วย", price: 159 },
            { label: "หม้อไฟ", price: 229 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 5, 
        name: "เเกงเลียงกุ้งสด", 
        category: "ปลา", 
        options: [
            { label: "ถ้วย", price: 159 },
            { label: "หม้อไฟ", price: 199 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 6, 
        name: "เเกงส้มชะอมกุ้ง", 
        category: "ปลา", 
        options: [
            { label: "ถ้วย", price: 139 },
            { label: "หม้อไฟ", price: 199 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { id: 7, name: "เเป๊ะซะปลาซ่อน", category: "ต้ม", price: 349, desc: "", img: "", isAvailable: true },
    { id: 8, name: "ต้มเเซ่บกระดูกอ่อน", category: "ต้ม", price: 139, desc: "", img: "", isAvailable: true },
    { id: 9, name: "ฉู่ฉี่ปลาทู", category: "ต้ม", price: 139, desc: "", img: "", isAvailable: true },
    { id: 10, name: "ต้มจืดเต้าหู้หมูสับ", category: "ต้ม", price: 129, desc: "", img: "", isAvailable: true },
    { id: 11, name: "ไก่ผัดเม็ดมะม่วง", category: "ผัด", price: 149, desc: "", img: "", isAvailable: true },
    { id: 12, name: "ไก่คั่วพริกเกลือ", category: "ผัด", price: 119, desc: "", img: "", isAvailable: true },
    { id: 13, name: "ปีกไก่คั่วพริกเกลือ", category: "ผัด", price: 119, desc: "", img: "", isAvailable: true },
    { id: 14, name: "สามชั้นคั่วพริกเกลือ", category: "ผัด", price: 119, desc: "", img: "", isAvailable: true },

    { 
        id: 15, 
        name: "ผัดพริกไทยดํา", 
        category: "ปลา", 
        options: [
            { label: "หมูมไก่", price: 119 },
            { label: "ทะเล", price: 129 }
        ],
        desc: "", img: "", isAvailable: true 
    },

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

    { 
        id: 35, 
        name: "สปาเก็ตตี้ขี้เมา", 
        category: "ปลา", 
        options: [
            { label: "หมู,ไก่", price: 139 },
            { label: "ทะเล", price: 159 }
        ],
        desc: "", img: "", isAvailable: true 
    },

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

    { 
        id: 62, 
        name: "เอสเปรสโซ่", 
        category: "coffee", 
        options: [
            { label: "ร้อน", price: 40 },
            { label: "เย็น", price: 65 },
            { label: "ปั่น", price: 70 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 63, 
        name: "อเมริกาโน่", 
        category: "coffee", 
        options: [
            { label: "ร้อน", price: 60 },
            { label: "เย็น", price: 65 },
        ],
        desc: "", img: "", isAvailable: true 
    }, 

    { 
        id: 64, 
        name: "เเบล็คคอฟฟี่", 
        category: "coffee", 
        options: [
            { label: "ร้อน", price: 55 },
            { label: "เย็น", price: 65 },
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 65, 
        name: "คาปูชิโน่", 
        category: "coffee", 
        options: [
            { label: "ร้อน", price: 60 },
            { label: "เย็น", price: 65 },
            { label: "ปั่น", price: 70 }
        ],
        desc: "", img: "", isAvailable: true 
    }, 

    { 
        id: 66, 
        name: "ลาเต้", 
        category: "coffee", 
        options: [
            { label: "ร้อน", price: 60 },
            { label: "เย็น", price: 65 },
            { label: "ปั่น", price: 70 }
        ],
        desc: "", img: "", isAvailable: true 
    }, 

    { 
        id: 67, 
        name: "มอคค่า", 
        category: "coffee", 
        options: [
            { label: "ร้อน", price: 65 },
            { label: "เย็น", price: 70 },
            { label: "ปั่น", price: 75 }
        ],
        desc: "", img: "", isAvailable: true 
    }, 

    { 
        id: 68, 
        name: "คาลาเมลมัคคิอาโต", 
        category: "coffee", 
        options: [
            { label: "เย็น", price: 70 },
            { label: "ปั่น", price: 80 }
        ],
        desc: "", img: "", isAvailable: true 
    }, 

    { id: 69, name: "เเอโร่วกาโน่", category: "coffee", price: 70, desc: "", img: "", isAvailable: true },
    
    { 
        id: 70, 
        name: "โกโก้", 
        category: "drink", 
        options: [
            { label: "ร้อน", price: 45 },
            { label: "เย็น", price: 55 },
            { label: "ปั่น", price: 60 }
        ],
        desc: "", img: "", isAvailable: true 
    },
    
     { 
        id: 71, 
        name: "ชาเขียวนมสด", 
        category: "drink", 
        options: [
            { label: "เย็น", price: 55 },
            { label: "ปั่น", price: 60 }
        ],
        desc: "", img: "", isAvailable: true 
    },   

     { 
        id: 72, 
        name: "ชานม(ชาไทย)", 
        category: "drink", 
        options: [
            { label: "เย็น", price: 55 },
            { label: "ปั่น", price: 60 }
        ],
        desc: "", img: "", isAvailable: true 
    }, 

    { id: 73, name: "ชาดําเย็น", category: "drink", price: 45, desc: "", img: "", isAvailable: true },
    { id: 74, name: "ชามะนาว", category: "drink", price: 50, desc: "", img: "", isAvailable: true },
    { id: 75, name: "เพียวมัทฉะ", category: "drink", price: 60, desc: "", img: "", isAvailable: true },
    { id: 76, name: "มัทฉะลาเต้", category: "drink", price: 60, desc: "", img: "", isAvailable: true },
    { id: 77, name: "มัทฉะยูซุ", category: "drink", price: 70, desc: "", img: "", isAvailable: true },
    { id: 78, name: "บลูฮาวายโซดา", category: "drink", price: 60, desc: "", img: "", isAvailable: true },
    { id: 79, name: "ส้มยูซุโซดา", category: "drink", price: 60, desc: "", img: "", isAvailable: true },
    { id: 80, name: "บ๊วยโซดา", category: "drink", price: 60, desc: "", img: "", isAvailable: true },
    { id: 81, name: "สตรอว์เบอร์รีโซดา", category: "drink", price: 60, desc: "", img: "", isAvailable: true },
    { id: 82, name: "เลมอนโซดา", category: "drink", price: 60, desc: "", img: "", isAvailable: true },
    { id: 83, name: "สตรอว์เบอร์รีปั่น", category: "drink", price: 70, desc: "", img: "", isAvailable: true },   
    { id: 84, name: "ส้มปั่น", category: "drink", price: 70, desc: "", img: "", isAvailable: true },
    { id: 85, name: "มะม่วงปั่น", category: "drink", price: 70, desc: "", img: "", isAvailable: true },   
    { id: 86, name: "มิกซ์เบอร์รีปั่น", category: "drink", price: 70, desc: "", img: "", isAvailable: true },
    { id: 87, name: "ข้าวผัดสับปะรด", category: "ข้าว", price: 259, desc: "", img: "", isAvailable: true },
    { id: 88, name: "ข้าวผัดรถไฟ", category: "ข้าว", price: 80, desc: "", img: "", isAvailable: true },

    { 
        id: 89, 
        name: "ข้าวผัดหมู", 
        category: "ข้าว", 
        options: [
            { label: "เล็ก", price: 80 },
            { label: "กลาง", price: 160 },
            { label: "ใหญ่", price: 320 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 90, 
        name: "ข้าวผัดไก่", 
        category: "ข้าว", 
        options: [
            { label: "เล็ก", price: 80 },
            { label: "กลาง", price: 160 },
            { label: "ใหญ่", price: 320 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 91, 
        name: "ข้าวผัดทะเล", 
        category: "ข้าว", 
        options: [
            { label: "เล็ก", price: 90 },
            { label: "กลาง", price: 180 },
            { label: "ใหญ่", price: 360 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 92, 
        name: "สุกี้เเห้ง", 
        category: "อาหารจานเดียว", 
        options: [
            { label: "หมู", price: 80 },
            { label: "ไก่", price: 70 },
            { label: "ทะเล", price: 90 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 93, 
        name: "ข้าวไข่เจียว", 
        category: "อาหารจานเดียว", 
        options: [
            { label: "หมู", price: 60 },
            { label: "ไก่", price: 70 },
            { label: "ทะเล", price: 90 }
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 94, 
        name: "ผัดซีอิ้ว", 
        category: "อาหารจานเดียว", 
        options: [
            { label: "หมู", price: 80 },
            { label: "ไก่", price: 80 },
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 95, 
        name: "ราดหน้า", 
        category: "อาหารจานเดียว", 
        options: [
            { label: "หมู", price: 80 },
            { label: "ไก่", price: 80 },
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 96, 
        name: "ข้าวหน้ากะเพรา", 
        category: "อาหารจานเดียว", 
        options: [
            { label: "หมู,ไก่", price: 80 },
            { label: "ทะเล", price: 100 }         
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 97, 
        name: "ข้าวหน้าผัดพริกเเกง", 
        category: "อาหารจานเดียว", 
        options: [
            { label: "หมู,ไก่", price: 80 },
            { label: "ทะเล", price: 100 }         
        ],
        desc: "", img: "", isAvailable: true 
    },

    { 
        id: 98, 
        name: "ข้าว...กระเทียม", 
        category: "อาหารจานเดียว", 
        options: [
            { label: "หมู,ไก่", price: 80 },
            { label: "ทะเล", price: 100 }         
        ],
        desc: "", img: "", isAvailable: true 
    },

    { id: 99, name: "เอ็นไก่ทอด", category: "ของทานเล่น", price: 99, desc: "", img: "", isAvailable: true },
    { id: 100, name: "นักเก็ตไก่ทอด", category: "ของทานเล่น", price: 99, desc: "", img: "", isAvailable: true },
    { id: 101, name: "เฟรนช์ฟรายทอด", category: "ของทานเล่น", price: 80, desc: "", img: "", isAvailable: true },
    { id: 102, name: "ปอเปี้ยชีส", category: "ของทานเล่น", price: 90, desc: "", img: "", isAvailable: true },
    { id: 103, name: "ชีสเค้ก", category: "ของหวาน", price: 90, desc: "", img: "", isAvailable: true },
    { id: 104, name: "เค้กสตอว์เบอร์รี", category: "ของหวาน", price: 80, desc: "", img: "", isAvailable: true },
    { id: 105, name: "เค้กบลูเบอร์รี", category: "ของหวาน", price: 80, desc: "", img: "", isAvailable: true },
    { id: 106, name: "เค้กช็อกโกเเลต", category: "ของหวาน", price: 80, desc: "", img: "", isAvailable: true },
    { id: 107, name: "ท็อปฟี่เค้ก", category: "ของหวาน", price: 50, desc: "", img: "", isAvailable: true },
    { id: 108, name: "บราวนี่", category: "ของหวาน", price: 45, desc: "", img: "", isAvailable: true },
    { id: 109, name: "มัฟฟีน", category: "ของหวาน", price: 45, desc: "", img: "", isAvailable: true },
    { id: 110, name: "ครัวซองต์", category: "ของหวาน", price: 45, desc: "", img: "", isAvailable: true },
    { id: 111, name: "ครัวซองต์ช็อกโกเเลต", category: "ของหวาน", price: 75, desc: "", img: "", isAvailable: true },
    { id: 112, name: "เเซนถ์วิชไส้ครีมผลไม้", category: "ของหวาน", price: 70, desc: "", img: "", isAvailable: true },
    { id: 109, name: "เเซนถ์วิช เเฮมชีส", category: "ของหวาน", price: 75, desc: "", img: "", isAvailable: true },
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