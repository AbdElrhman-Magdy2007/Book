import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { order } = await req.json(); // order: [{id, order}, ...]
    if (!Array.isArray(order)) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }
    // Update the order of each product
    await Promise.all(
      order.map((item: { id: string; order: number }) =>
        db.product.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath("/admin/menu-items");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
