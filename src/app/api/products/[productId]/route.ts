import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        ProductTech: { select: { name: true } },
        category: { select: { name: true } },
      },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      description: product.description,
      rating: product.rating,
      url: product.url,
      category: product.category?.name || null,
      ProductTech: product.ProductTech || [],
      beneficiary: product.beneficiary,
      pages: product.pages,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      // أضف أي تفاصيل إضافية هنا حسب الحاجة
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
