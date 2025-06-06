const express = require('express');
const router = express.Router();
const User = require('../models/user_model');
const bcrypt = require('bcrypt');

require('dotenv').config();

const nodemailer = require("nodemailer");
const crypto = require('crypto');
const API_URL = process.env.API_URL;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
//get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//insert a user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Cập nhật người dùng theo ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');
        res.json({ message: 'Cập nhật thành công', user: updatedUser });
    } catch (err) {
        res.status(400).json({ error: 'Cập nhật thất bại' });
    }
});

// Xóa người dùng theo ID
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa người dùng thành công' });
    } catch (err) {
        res.status(400).json({ error: 'Xóa thất bại' });
    }
});

//check login
router.post('/check_login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({
                success: true,
                message: 'Login successful',
                __id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                created_time: user.created_time

            });
        } else {
            res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//check login admin
router.post('/check_login_admin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            if (user.role === 'admin') {
                res.json({
                    success: true,
                    message: 'Login successful',
                    __id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    created_time: user.created_time
                });
            } else {
                res.status(403).json({ success: false, message: 'Not Admin' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});




//check register
router.post('/check_signup', async (req, res) => {
    const { username, email } = req.body;
    try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            // Kiểm tra cụ thể trùng username hay email
            let message = '';
            if (user.username === username) message = 'Username already exists';
            if (user.email === email) message = 'Email already exists';
            if (user.username === username && user.email === email) {
                message = 'Cả 2 bị trùng';
            }
            res.json({
                success: false,
                message
            });
        } else {
            res.json({
                success: true,
                message: 'Username and email are available'
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//reset pass


const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"MusicStreamApp" <${EMAIL_USER}>`,
        to,
        subject,
        html,
    });
}
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // 1 giờ
    await user.save();
    const resetLink = `${API_URL}/resetpass/${token}`;
    const html = `
    <p>Bạn đã yêu cầu đặt lại mật khẩu tài khoản: ${user.username} </P>
   <p >Vui lòng nhấn vào link bên dưới </P>
   <p style="text-align: center;">
  
  <a href="${resetLink}"  style="display: inline-block; background-color: #007bff; color: white; font-weight: bold; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
    Đặt lại mật khẩu
  </a>
  
</p>

<p>Hoặc truy cập link: <a href="${resetLink}">musicstream.com/reset-password</a></p>
<p>Người gửi <strong>Admin</strong></p>

   
  `;

    await sendEmail(email, "Đặt lại mật khẩu", html);
    res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
});

router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    // user.password = await bcrypt.hash(password, 10);
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: "Mật khẩu đã được đặt lại thành công!" });
});

//
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;