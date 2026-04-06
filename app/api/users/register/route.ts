import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { NextRequest } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return APIResponse(false, "Missing required fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return APIResponse(false, "User already exists");
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "viewer",
    });

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpire = verificationExpire;

    await newUser.save();

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/api$/, "")}/verify-email?token=${verificationToken}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #8b5cf6;">Welcome to Zorvyn!</h2>
        <p>Please verify your email to activate your account:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `;
    await sendEmail(email, "Verify Your email - Zorvyn", html);

    return APIResponse(true, "User registered successfully. Please check your email to verify your account.", {
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
