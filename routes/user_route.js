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

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const { username, email } = req.body;

        const exituser = await User.findOne({ username });
        if (exituser) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
        }

        const exitEmail = await User.findOne({ email });
        if (exitEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        const user = new User(req.body);

        await user.save();
        res.status(201).json({ user, message: "Tạo thành công" });
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
                created_time: user.created_time,
                role: user.role
            });
        } else {
            res.json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
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
                    message: 'Truy cập thành công',
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    created_time: user.created_time
                });
            } else {
                res.status(403).json({ success: false, message: 'Cần quyền admin' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Lỗi ' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi sever' });
    }
});




//check register
// router.post('/check_signup', async (req, res) => {
//     const { username, email } = req.body;
//     try {
//         const user = await User.findOne({ $or: [{ username }, { email }] });
//         if (user) {
//             let message = '';
//             if (user.username === username) message = 'Tài khoản tồn tại';
//             if (user.email === email) message = 'Email đã tồn tại';
//             if (user.username === username && user.email === email) {
//                 message = 'Cả 2 bị trùng';
//             }
//             res.json({
//                 success: false,
//                 message
//             });
//         } else {
//             res.json({
//                 success: true,
//                 message: 'Tạo thành công'
//             });
//         }
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Lỗi' });
//     }
// });

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
   <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">Yêu cầu đặt lại mật khẩu</h2>

    <p>Xin chào <strong>${user.username}</strong>,</p>

    <p>Bạn đã gửi yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>

    <p>Vui lòng nhấn vào nút bên dưới để tiến hành đặt lại mật khẩu:</p>

    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}"
            style="background-color: #007bff; color: white; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px;">
            Đặt lại mật khẩu
        </a>
    </div>

    <p>Nếu nút không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
    <p style="word-break: break-all;"><a href="${resetLink}">${resetLink}</a></p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 14px; color: #555;">Email này được gửi từ hệ thống của <strong>MusicStream</strong>.</p>
    <p style="font-size: 14px; color: #555;">Người gửi: <strong>Admin</strong></p>
</div>


   
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