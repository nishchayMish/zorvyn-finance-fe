import dbConnect from "@/lib/db";
import Record from "@/models/Record";
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
    if (!decoded) {
      return APIResponse(false, "Invalid token", null, 401);
    }

    await dbConnect();
    const result = await Record.deleteOne({ _id: id, userId: decoded.userId });

    if (result.deletedCount === 0) {
      return APIResponse(false, "Record not found or access denied", null, 404);
    }

    return APIResponse(true, "Record deleted successfully");
  } catch (error: any) {
    console.error("Delete Record Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
