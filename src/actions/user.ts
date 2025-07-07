"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateUserNameParams {
  id: string;
  name: string;
}

interface UpdateUserNameResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function updateUserName({
  id,
  name,
}: UpdateUserNameParams): Promise<UpdateUserNameResponse> {
  try {
    // Validate input
    if (!id || !name || name.trim().length < 2) {
      return {
        success: false,
        error: "Name must be at least 2 characters long",
      };
    }

    // Update user in database
    await db.user.update({
      where: { id },
      data: { name: name.trim() },
    });

    // Revalidate profile page
    revalidatePath("/profile");

    return {
      success: true,
      message: "Name updated successfully",
    };
  } catch (error) {
    console.error("Error updating user name:", error);
    return {
      success: false,
      error: "Failed to update name",
    };
  }
}
