import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, name, image, price, category } = body;
    if (!productId || !name || typeof price !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Prevent duplicates
    const exists = await db.cartItem.findFirst({ where: { productId } });
    if (exists) {
      return NextResponse.json(
        { error: "Product already in cart" },
        { status: 409 }
      );
    }
    const cartItem = await db.cartItem.create({
      data: {
        productId,
        name,
        image,
        price,
        category,
      },
    });
    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const items = await db.cartItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 }
      );
    }
    const deleted = await db.cartItem.deleteMany({ where: { productId } });
    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Product not found in cart" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
