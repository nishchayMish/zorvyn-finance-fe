import dbConnect from "@/lib/db";
import User from "@/models/User";
import { APIResponse } from "@/lib/response-helper";
import { verifyAccessToken } from "@/lib/auth";
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

    if (decoded.role !== "admin") {
      return APIResponse(false, "Admin access required", null, 403);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";
    const status = searchParams.get("status") || "all";

    await dbConnect();

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role !== "all") query.role = role;
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get statistics for user dashboard
    const counts = {
      totalUsers: await User.countDocuments(),
      totalAdmins: await User.countDocuments({ role: "admin" }),
      totalAnalysts: await User.countDocuments({ role: "analyst" }),
      totalViewers: await User.countDocuments({ role: "viewer" }),
      totalActive: await User.countDocuments({ isActive: true }),
      totalInactive: await User.countDocuments({ isActive: false }),
    };

    return APIResponse(true, "Users fetched successfully", {
      data: users,
      counts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalRecords: totalUsers,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Fetch Users Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
