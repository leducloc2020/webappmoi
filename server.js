const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Import multer để lưu file
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Dùng để serve ảnh từ thư mục images

// Kết nối tới MongoDB
mongoose.connect('mongodb+srv://leducloc2307:rkieMhHrWPNoh7dX@database.3e42j.mongodb.net/?retryWrites=true&w=majority&appName=database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Định nghĩa schema
const entrySchema = new mongoose.Schema({
  licensePlate: String,
  timeIn: String,
  timeOut: String,
  imagePath: String,
   // Lưu đường dẫn ảnh
});

const Entry = mongoose.model('Entry', entrySchema);
// Cấu hình multer để lưu file ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // Lưu ảnh vào thư mục images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}.png`); // Đặt tên file theo timestamp
  },
});

const upload = multer({ storage: storage });

// API lưu thông tin xe vào bãi và ảnh
app.post('/entries', upload.single('image'), async (req, res) => {
  const { licensePlate, timeIn } = req.body;
  const imagePath = req.file ? `/images/${req.file.filename}` : null;

  const entry = new Entry({ licensePlate, timeIn, imagePath });
  await entry.save();

  res.send({ message: 'Lưu thành công', entry });
});

// API cập nhật thời gian ra bãi theo biển số xe
app.put('/entries/exit', async (req, res) => {
  const { licensePlate } = req.body;
  const entry = await Entry.findOneAndUpdate(
    { licensePlate, timeOut: { $exists: false } },
    { timeOut:new Date().toLocaleString('vi-VN',{ hour12: false ,  timeZone: 'Asia/Ho_Chi_Minh'})},
    { new: true }
  );

  if (entry) {
    res.send({ success: true, message: 'Cập nhật thời gian ra thành công', entry });

  } else {
    res.send({ success: false, message: 'Không tìm thấy xe' });
  }
});
app.put('/entries/total-price', async (req, res) => {
  const { licensePlate, totalPrice } = req.body;

  try {
    // Tìm entry dựa trên biển số xe
    const entry = await Entry.findOne({ licensePlate });

    if (!entry) {
      return res.status(404).json({ message: 'Không tìm thấy biển số xe' });
    }

    // Cập nhật tổng tiền
    entry.totalPrice = totalPrice;
    await entry.save();

    // Trả về kết quả sau khi cập nhật
    res.json({ success: true, entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});
// Khởi động server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

