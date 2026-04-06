import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

type Params = Promise<{ id: string }>;

export async function DELETE(
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
    if (!decoded || decoded.role !== "admin") {
      return APIResponse(false, "Admin access required", null, 403);
    }

    await dbConnect();
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return APIResponse(false, "User not found", null, 404);
    }

    return APIResponse(true, "User deleted successfully");
  } catch (error: any) {
    console.error("Delete User Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
