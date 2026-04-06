import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { generateAccessToken, setAuthCookies, verifyRefreshToken } from "@/lib/auth";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return APIResponse(false, "Refresh token not found", null, 401);
    }

    await dbConnect();
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return APIResponse(false, "Invalid refresh token", null, 401);
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return APIResponse(false, "Session expired. Please login again.", null, 401);
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = refreshToken; // Optionally rotate refresh token too

    // Update Access token cookie
    await setAuthCookies(newAccessToken, newRefreshToken, user.role);

    return APIResponse(true, "Token refreshed successfully", {
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    console.error("Refresh Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
