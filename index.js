const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')
const crypto = require('crypto');
require('dotenv').config()
// Import router từ file index.js
const apiRouter = require('./api/index')

// Sử dụng router với prefix /api

//model require
const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')));
// Phân tích nội dung yêu cầu từ dạng JSON
app.use(bodyParser.json());
app.use(cors());
// Phân tích nội dung yêu cầu từ dạng x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
const botName = 'Thông báo';
app.use('/api', apiRouter);
// Khi có một kết nối mới được thiết lập
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
