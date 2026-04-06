"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  const decoded = verifyAccessToken(token);
  return decoded;
}

export async function getUsersAction(params: any) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "admin") return { success: false, message: "Admin access required" };

  try {
    const { page = 1, limit = 10, search = "", role = "all", status = "all" } = params;
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

    const counts = {
      totalUsers: await User.countDocuments(),
      totalAdmins: await User.countDocuments({ role: "admin" }),
      totalAnalysts: await User.countDocuments({ role: "analyst" }),
      totalViewers: await User.countDocuments({ role: "viewer" }),
      totalActive: await User.countDocuments({ isActive: true }),
      totalInactive: await User.countDocuments({ isActive: false }),
    };

    return {
      success: true,
      data: JSON.parse(JSON.stringify(users)),
      counts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalRecords: totalUsers,
        limit,
      },
    };
  } catch (error: any) {
    return { success: false, message: "Failed to fetch users" };
  }
}

export async function updateUserRoleAction(userId: string, role: string) {
  const admin = await getAuthenticatedUser();
  if (!admin || admin.role !== "admin") return { success: false, message: "Unauthorized" };

  try {
    await dbConnect();
    const userResult = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!userResult) return { success: false, message: "User not found" };
    return { success: true, message: "Role updated", user: JSON.parse(JSON.stringify(userResult)) };
  } catch (error: any) {
    return { success: false, message: "Failed to update role" };
  }
}

export async function updateUserStatusAction(userId: string, isActive: boolean) {
  const admin = await getAuthenticatedUser();
  if (!admin || admin.role !== "admin") return { success: false, message: "Unauthorized" };

  try {
    await dbConnect();
    const userResult = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
    if (!userResult) return { success: false, message: "User not found" };
    return { success: true, message: "Status updated", user: JSON.parse(JSON.stringify(userResult)) };
  } catch (error: any) {
    return { success: false, message: "Failed to update status" };
  }
}

export async function deleteUserAction(id: string) {
  const admin = await getAuthenticatedUser();
  if (!admin || admin.role !== "admin") return { success: false, message: "Unauthorized" };

  try {
    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return { success: false, message: "User not found" };
    return { success: true, message: "User deleted" };
  } catch (error: any) {
    return { success: false, message: "Failed to delete user" };
  }
}

export async function updateUserCredentialsAction(id: string, payload: any) {
  const requester = await getAuthenticatedUser();
  if (!requester || (requester.userId !== id && requester.role !== "admin")) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const { name, email, password } = payload;
    await dbConnect();
    const user = await User.findById(id);
    if (!user) return { success: false, message: "User not found" };

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();

    return { success: true, message: "Credentials updated", user: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    return { success: false, message: "Failed to update credentials" };
  }
}

export async function getMeAction() {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, message: "Unauthorized" };
  try {
    await dbConnect();
    const result = await User.findById(user.userId).select("-password -refreshToken");
    if (!result) return { success: false, message: "User not found" };
    return { success: true, message: "User found", user: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    return { success: false, message: "Error fetching user info" };
  }
}
