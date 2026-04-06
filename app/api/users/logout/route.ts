import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { clearAuthCookies, verifyRefreshToken } from "@/lib/auth";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
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
    return APIResponse(true, "Logged out successfully");
  } catch (error: any) {
    console.error("Logout Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
