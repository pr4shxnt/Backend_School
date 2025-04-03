const NewContactMail = require("../Models/newContactMail")
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

export const sendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = generateOTP();
    await redisClient.setEx(`otp:${email}`, 300, otp); // Store OTP for 5 minutes

    // Send OTP via email
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP" });
    }
};


export const verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    const storedOTP = await redisClient.get(`otp:${email}`);
    if (!storedOTP) return res.status(400).json({ error: "OTP expired or invalid" });

    if (storedOTP !== otp) return res.status(401).json({ error: "Incorrect OTP" });

    await redisClient.del(`otp:${email}`); // Remove OTP after successful verification

    next(); 
};



exports.createContactMail = async (req, res) => {
    
}