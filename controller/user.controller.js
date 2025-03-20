import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const registerUser = async (req, res) => {
    // res.send("registered");
    // get data
    // validate
    // check if user already exists
    // create a user in database
    // create a verification token
    // save token in database
    // send token as email to user
    // send succes status to user

    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(200).json({
            message: "All fields are required."
        }) // sab theek thak
    }
    console.log(email, password)

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists."
            })
        }
        const user = await User.create({
            name,
            email,
            password,
        })

        console.log(user)

        if (!user) {
            return res.status(400).json({
                message: "User not registered"
            })
        }

        const token = crypto.randomBytes(32).toString("hex")
        console.log(token)
        user.verificationToken = token

        await user.save()

        // send email
        const transporter = nodemailer.createTransport({
            host: "process.env.MAILTRAP_HOST",
            port: "process.env.MAILTRAP_PORT",
            secure: false, // true for port 465, false for other ports
            auth: {
                user: "process.env.MAILTRAP_USERNAME",
                pass: "process.env.MAILTRAP_PASSWORD",
            },
        });

        const mailOption = await transporter.sendMail({
            from: process.env.MAILTRAP_SENDEREMAIL, // sender address
            to: user.email,
            subject: "Verify your email",
            text: `Please click on the following link: 
            ${process.env.BASE_URL}/api/v1/users/verify/${token}
            `
        });

        await transporter.sendMail(mailOption)

        res.status(200).json({
            message: "User registered successfully",
            success: true,
        })

    } catch (error) {
        res.status(400).json({
            message: "user not registered",
            error,
            success: true,
        })
    }
}

const verifyUser = async (req, res) => {
    // get token from url
    // validate 
    // find user based on token
    // if not
    // set isVerified to true
    // remove verification token
    // save 
    // return response

    const { token } = req.params;
    console.log(token)
    if (!token) {
        return res.status(400).json({
            message: "Invalid token"
        })
    }

    const user = await User.findOne({ verificationToken: token })


    if (!user) {
        return res.status(400).json({
            message: "Invalid token"
        })
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

}
export { registerUser, verifyUser };