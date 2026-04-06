import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

type Params = Promise<{ id: string }>;

export async function PATCH(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return APIResponse(false, "Unauthorized", null, 401);
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return APIResponse(false, "Invalid token", null, 401);
    }

    // Only user themselves or admin can update
    if (decoded.userId !== id && decoded.role !== "admin") {
      return APIResponse(false, "Access denied", null, 403);
    }

    const { name, email, password } = await req.json();

    await dbConnect();
    const user = await User.findById(id);

    if (!user) {
      return APIResponse(false, "User not found", null, 404);
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Mongoose middleware will hash this

    await user.save();

    return APIResponse(true, "Profile updated successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    console.error("Update Credentials Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
