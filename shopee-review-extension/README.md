# 🛍️ Shopee Review Auto Reply Extension

Chrome Extension สำหรับช่วยตอบรีวิว Shopee อัตโนมัติด้วย Template ที่กำหนดเอง

## ✨ Features

- ✅ แสดงรายการรีวิวที่ยังไม่ได้ตอบกลับ
- ✅ ตอบรีวิวทีละรายการแบบต่อเนื่อง
- ✅ มี Template ข้อความสำเร็จรูป
- ✅ ปรับแต่ง Template ได้ตามต้องการ
- ✅ UI แบบ Side Panel ใช้งานง่าย
- ✅ นับจำนวนรีวิวที่ตอบแล้ว
- ✅ บันทึก Template ที่ใช้บ่อย

## 📋 Requirements

- Google Chrome Browser (Version 114 ขึ้นไป)
- บัญชี Shopee Seller Centre

## 🚀 การติดตั้ง

### 1. เตรียม Icons

เปิดไฟล์ `icons/create-icons.html` ในเบราว์เซอร์ แล้วคลิก "สร้างและดาวน์โหลด Icons"
- จะได้ไฟล์ `icon16.png`, `icon48.png`, `icon128.png`
- นำไฟล์ทั้งหมดไปใส่ในโฟลเดอร์ `icons/`

**หรือ** สร้าง icons ด้วยตัวเอง (PNG 16x16, 48x48, 128x128)

### 2. โหลด Extension ลงใน Chrome

1. เปิด Chrome แล้วไปที่ `chrome://extensions/`
2. เปิด "Developer mode" ที่มุมบนขวา
3. คลิก "Load unpacked"
4. เลือกโฟลเดอร์ `shopee-review-extension`
5. Extension จะถูกติดตั้งและพร้อมใช้งาน

## 📖 วิธีการใช้งาน

### ขั้นตอนที่ 1: เปิดหน้าจัดการรีวิว

1. เข้า [Shopee Seller Centre](https://seller.shopee.co.th)
2. ไปที่เมนู **จัดการร้านค้า > จัดการรีวิว**
3. คลิกที่ไอคอน Extension หรือเปิด Side Panel

### ขั้นตอนที่ 2: โหลดรีวิว

1. ในหน้า Side Panel คลิก **"📥 โหลดรีวิว"**
2. Extension จะดึงรายการรีวิวที่ยังไม่ได้ตอบกลับ
3. รีวิวแรกจะแสดงในพื้นที่ "รีวิวปัจจุบัน"

### ขั้นตอนที่ 3: ตอบรีวิว

#### วิธีที่ 1: ใช้ Template
1. เลือก Template จากดรอปดาวน์
2. ข้อความจะถูกใส่อัตโนมัติ
3. แก้ไขข้อความได้ตามต้องการ
4. คลิก **"✉️ ส่งคำตอบ"**

#### วิธีที่ 2: พิมพ์เอง
1. พิมพ์ข้อความตอบกลับในช่อง "ข้อความตอบกลับ"
2. คลิก **"✉️ ส่งคำตอบ"**

#### ข้าม Review
- คลิก **"⏭️ ข้าม"** เพื่อข้ามไปรีวิวถัดไป

### ขั้นตอนที่ 4: จัดการ Template

1. คลิก **"จัดการ Template"**
2. เพิ่ม Template ใหม่:
   - ใส่ชื่อ Template (เช่น "ขอบคุณลูกค้า")
   - ใส่ข้อความ
   - คลิก "+ เพิ่ม Template"
3. ลบ Template: คลิกปุ่ม "ลบ" ข้าง Template ที่ต้องการลบ

## 📊 Default Templates

Extension มาพร้อม Template สำเร็จรูป 4 แบบ:

1. **ขอบคุณลูกค้า (5 ดาว)**
   ```
   ขอบคุณมากๆ ค่ะที่อุดหนุนร้านของเรา 🙏💖
   ดีใจมากที่คุณพอใจกับสินค้านะคะ
   หวังว่าจะได้รับใช้อีกนะคะ 😊
   ```

2. **ขอบคุณ + ส่วนลด**
   ```
   ขอบคุณที่อุดหนุนร้านเราค่ะ 🙏
   ดีใจมากที่ลูกค้าชอบสินค้า
   รอเจอกันใหม่นะคะ มีโปรโมชั่นดีๆ รออยู่เสมอค่า 💝
   ```

3. **ขออภัย (รีวิวไม่ดี)**
   ```
   ขออภัยมากๆ ค่ะสำหรับความไม่สะดวก 🙏
   ทางร้านจะนำไปปรับปรุงให้ดีขึ้นค่ะ
   หากมีปัญหาอื่นๆ สามารถแจ้งทางร้านได้เลยนะคะ
   ```

4. **ตอบสั้นๆ**
   ```
   ขอบคุณมากค่ะ 🙏💖
   ```

## 🎨 UI Components

### Side Panel Layout

```
┌─────────────────────────────────┐
│  🛍️ Shopee Review Reply        │
│  ตอบรีวิวอัตโนมัติด้วย Template │
├─────────────────────────────────┤
│  รีวิวที่ค้าง │ ตอบแล้ว         │
│      10      │    5            │
├─────────────────────────────────┤
│  รีวิวปัจจุบัน                  │
│  ┌───────────────────────────┐ │
│  │ ⭐⭐⭐⭐⭐                  │ │
│  │ สินค้าดีมาก คุณภาพเยี่ยม  │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  เลือก Template                 │
│  [-- เลือก Template --]        │
│  [จัดการ Template]              │
├─────────────────────────────────┤
│  ข้อความตอบกลับ                 │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │                           │ │
│  └───────────────────────────┘ │
│  0 / 500 ตัวอักษร              │
├─────────────────────────────────┤
│  [📥 โหลดรีวิว]                │
│  [✉️ ส่งคำตอบ] [⏭️ ข้าม]      │
└─────────────────────────────────┘
```

## 🛠️ โครงสร้างโปรเจค

```
shopee-review-extension/
├── manifest.json           # Extension configuration
├── icons/                  # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon.svg
│   └── create-icons.html  # Icon generator
├── sidepanel/             # Side panel UI
│   ├── sidepanel.html    # UI structure
│   ├── sidepanel.css     # Styling
│   └── sidepanel.js      # UI logic & state
├── scripts/              # Extension scripts
│   ├── background.js    # Service worker
│   └── content.js       # Shopee page script
└── README.md            # This file
```

## 🔧 Technical Details

### Technologies Used
- **Manifest V3** - Latest Chrome Extension API
- **Side Panel API** - Modern UI approach
- **Chrome Storage API** - Store templates & stats
- **Content Scripts** - Interact with Shopee DOM

### Permissions
- `storage` - Save templates and statistics
- `sidePanel` - Use Side Panel UI
- `activeTab` - Access current Shopee tab
- `scripting` - Inject scripts to Shopee pages

### Browser Support
- Chrome 114+
- Edge 114+

## ⚠️ ข้อควรระวัง

1. **อยู่ในหน้าจัดการรีวิว**: Extension ทำงานได้เฉพาะในหน้า Shopee Seller Centre > จัดการรีวิว
2. **ตรวจสอบก่อนส่ง**: ควรตรวจสอบข้อความก่อนกดส่งทุกครั้ง
3. **ข้อจำกัดของ Shopee**: หาก Shopee เปลี่ยน UI อาจต้องปรับปรุง Extension
4. **ความเร็วในการส่ง**: ไม่ควรส่งคำตอบเร็วเกินไป อาจถูก Shopee ระงับ

## 🐛 Troubleshooting

### Extension ไม่ทำงาน
- ตรวจสอบว่าเปิด Developer Mode แล้ว
- Reload Extension ที่หน้า `chrome://extensions/`
- ตรวจสอบ Console สำหรับ errors (F12)

### ไม่พบรีวิว
- ตรวจสอบว่าอยู่ในหน้าจัดการรีวิวที่ถูกต้อง
- Refresh หน้าเว็บ Shopee
- ลอง reload Extension

### ส่งคำตอบไม่ได้
- ตรวจสอบว่ารีวิวนี้ยังไม่ได้ตอบ
- ลองตอบด้วยตนเองผ่าน Shopee UI ดู
- ตรวจสอบ Console สำหรับ errors

## 🔮 Future Enhancements

- [ ] รองรับตอบหลายรีวิวพร้อมกัน (Bulk Reply)
- [ ] ตัวแปรแบบ Dynamic (เช่น {ชื่อลูกค้า}, {ชื่อสินค้า})
- [ ] ประวัติการตอบรีวิว
- [ ] Export/Import Templates
- [ ] Keyboard Shortcuts
- [ ] Dark Mode

## 📝 License

MIT License - ใช้งานได้อย่างอิสระ

## 👨‍💻 Developer

สร้างโดย Claude Code Assistant

---

**Happy Reviewing! 🎉**

หากพบปัญหาหรือต้องการความช่วยเหลือ สามารถติดต่อได้ที่ [GitHub Issues](https://github.com/your-repo/issues)
