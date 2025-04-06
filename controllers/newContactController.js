import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import redisClient from "../config/redisClient.js";
import NewContactMail from "../Models/newContactMail.js";
import cron from "node-cron"




const generateOTP = () => {
    return otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
};

 

const sendOTPEmail = async (email, otp) => {
    try {
        console.log("Sending OTP to:", email);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Your OTP for registration: ${otp}`,
            html: `
                <p>Your verification One Time Password (OTP) is <strong>${otp}</strong>.</p>
                <p>Please verify your email to send us a message.</p>
                <p><strong>Do not share this OTP with anyone for security reasons.</strong></p>
                <br><br>
                <p>Thanks & Regards,<br>Prashant Adhikari</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ OTP email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

 
export const createContactMail = async (req, res) => {
    const { email, name, message } = req.body;

    try {
        if (!email || !name || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const otp = generateOTP();

        // Store OTP in Redis (expires in 5 minutes)
        await redisClient.setEx(
            `otp:${email}`,
            300, // Expiry time in seconds (5 minutes)
            JSON.stringify({ otp, userDetails: { email, name, message } })
        );

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("❌ Error sending OTP:", error);
        res.status(500).json({ error: error.message });
    }
};

 

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        console.log("Received OTP verification request:", { email, otp });

 


        const cachedData = await redisClient.get(`otp:${email}`);



        if (!cachedData) {
            return res.status(400).json({ message: "No OTP found for this email" });
        }

        const { otp: storedOtp, userDetails } = JSON.parse(cachedData);

        if (storedOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (!userDetails) {
            return res.status(400).json({ message: "User details missing in OTP data" });
        }



        const newMail = new NewContactMail(userDetails);
        await newMail.save();



        await redisClient.del(`otp:${email}`);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Error during OTP verification:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedContact = await NewContactMail.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting contact:", error);
        res.status(500).json({ error: error.message });
    }
}
