import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return APIResponse(false, "Verification token is required");
    }

    await dbConnect();
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return APIResponse(false, "Invalid or expired verification token", null, 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    return APIResponse(true, "Email verified successfully. You can now login.");
  } catch (error: any) {
    console.error("Verify Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
