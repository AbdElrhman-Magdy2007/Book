import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/server/auth";

function getGuestSessionId(req: Request) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/cart_session=([^;]+)/);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { productId, name, image, price, category } = body;
    if (!productId || !name || typeof price !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    let where;
    if (session?.user?.id) {
      where = { productId, userId: session.user.id };
    } else {
      const guestSessionId = getGuestSessionId(req);
      if (!guestSessionId) {
        return NextResponse.json(
          { error: "No guest session" },
          { status: 401 }
        );
      }
      where = { productId, guestSessionId };
    }
    // Prevent duplicates
    const exists = await db.cartItem.findFirst({ where });
    if (exists) {
      return NextResponse.json(
        { error: "Product already in cart" },
        { status: 409 }
      );
    }
    const data = {
      productId,
      name,
      image,
      price,
      category,
      userId: session?.user?.id || undefined,
      guestSessionId: session?.user?.id ? undefined : getGuestSessionId(req),
    };
    const cartItem = await db.cartItem.create({ data });
    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let where;
    if (session?.user?.id) {
      where = { userId: session.user.id };
    } else {
      const guestSessionId = getGuestSessionId(req);
      if (!guestSessionId) {
        return NextResponse.json([], { status: 200 });
      }
      where = { guestSessionId };
    }
    const items = await db.cartItem.findMany({
      where,
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
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 }
      );
    }
    let where;
    if (session?.user?.id) {
      where = { productId, userId: session.user.id };
    } else {
      const guestSessionId = getGuestSessionId(req);
      if (!guestSessionId) {
        return NextResponse.json(
          { error: "No guest session" },
          { status: 401 }
        );
      }
      where = { productId, guestSessionId };
    }
    const deleted = await db.cartItem.deleteMany({ where });
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
