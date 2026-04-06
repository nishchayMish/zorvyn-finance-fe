"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies, verifyRefreshToken } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function loginAction(payload: any) {
  try {
    await dbConnect();
    const { email, password } = payload;

    if (!email || !password) {
      return { success: false, message: "Missing credentials" };
    }

    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    if (!user.isActive) {
      return { success: false, message: "Account is disabled. Contact admin." };
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    await setAuthCookies(accessToken, refreshToken, user.role);

    return {
      success: true,
      message: "Login successful",
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    console.error("Login Action Error:", error);
    return { success: false, message: error.message || "Internal Server Error" };
  }
}

export async function signupAction(payload: any) {
  try {
    await dbConnect();
    const { name, email, password } = payload;

    if (!name || !email || !password) {
      return { success: false, message: "Missing required fields" };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "viewer",
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpire = verificationExpire;

    await newUser.save();

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

    return { success: true, message: "User registered. Please verify your email." };
  } catch (error: any) {
    console.error("Signup Action Error:", error);
    return { success: false, message: error.message || "Internal Server Error" };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("refreshToken")?.value;

    if (token) {
      await dbConnect();
      const decoded = verifyRefreshToken(token);
      if (decoded) {
        await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
      }
    }

    await clearAuthCookies();
    return { success: true, message: "Logged out successfully" };
  } catch (error: any) {
    console.error("Logout Action Error:", error);
    return { success: false, message: error.message || "Internal Server Error" };
  }
}

export async function verifyEmailAction(token: string) {
  try {
    await dbConnect();
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return { success: false, message: "Invalid or expired token" };
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    return { success: true, message: "Email verified successfully" };
  } catch (error: any) {
    return { success: false, message: "Verification failed" };
  }
}

export async function forgotPasswordAction(email: string) {
  try {
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) return { success: false, message: "User not found" };

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 3600000);
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/api$/, "")}/reset-password?token=${resetToken}`;
    const html = `<h2>Reset Password</h2><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;
    await sendEmail(email, "Password Reset", html);

    return { success: true, message: "Reset link sent" };
  } catch (error: any) {
    return { success: false, message: "Error sending email" };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    await dbConnect();
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return { success: false, message: "Invalid or expired token" };

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return { success: true, message: "Password reset successful" };
  } catch (error: any) {
    return { success: false, message: "Password reset failed" };
  }
}
