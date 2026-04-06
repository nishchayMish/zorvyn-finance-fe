import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { generateAccessToken, generateRefreshToken, setAuthCookies } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return APIResponse(false, "Missing credentials");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return APIResponse(false, "Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return APIResponse(false, "Invalid credentials");
    }

    if (!user.isActive) {
      return APIResponse(false, "Account is disabled. Contact admin.");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Set HTTP-only cookies
    await setAuthCookies(accessToken, refreshToken, user.role);

    return APIResponse(true, "Login successful", {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
