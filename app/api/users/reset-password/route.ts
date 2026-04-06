import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return APIResponse(false, "Token is required");
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return APIResponse(false, "Password must be at least 6 characters long.");
    }

    await dbConnect();
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return APIResponse(false, "Invalid or expired token", null, 400);
    }

    user.password = newPassword; // Mongoose middleware hashes this
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return APIResponse(true, "Password reset successful");
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
