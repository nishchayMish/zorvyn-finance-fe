import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { sendEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return APIResponse(false, "Email is required");
    }

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return APIResponse(false, "User not found", null, 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpire = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetExpire;
    await user.save();

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/api$/, "")}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #8b5cf6;">Zorvyn Password Reset</h2>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    const emailSent = await sendEmail(email, "Password Reset - Zorvyn", html);

    if (emailSent) {
      return APIResponse(true, "Reset link sent to your email");
    } else {
      return APIResponse(false, "Failed to send reset email. Please try again later.", null, 500);
    }
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
