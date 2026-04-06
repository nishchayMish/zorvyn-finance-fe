import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { verifyAccessToken } from "@/lib/auth";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return APIResponse(false, "Unauthorized", null, 401);
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return APIResponse(false, "Invalid token", null, 401);
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password -refreshToken");

    if (!user) {
      return APIResponse(false, "User not found", null, 404);
    }

    return APIResponse(true, "User profile fetched", user);
  } catch (error: any) {
    console.error("Me Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
