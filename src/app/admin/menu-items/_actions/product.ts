// app/menu-items/_actions/product.ts
"use server";

import { db } from "@/lib/prisma";
import { Pages, Routes } from "@/constants/enums";
import {
  addProductSchema,
  ProductValidatedData,
  updateProductSchema,
} from "@/app/validations/product";
import { ProductTech } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Constants
const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
];
const LOG_PREFIX = "[ServerActions]";
const MAX_UPLOAD_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;

// Types
interface ActionResponse {
  status: number;
  message: string;
  error?: Record<string, string>;
  formData?: FormData;
}

interface ProductOptions {
  productTechs: Partial<ProductTech>[];
}

interface AddProductArgs {
  categoryId: string;
  options: ProductOptions;
}

interface UpdateProductArgs {
  productId: string;
  options: ProductOptions;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
// console.log("SUPABASE_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/**
 * Delays execution for a specified time.
 * @param ms - Milliseconds to delay.
 * @returns Promise that resolves after the delay.
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validates and uploads an image file with retry logic and exponential backoff.
 * @param imageFile - The image file to upload.
 * @returns URL of the uploaded image.
 * @throws Error if the upload fails after retries.
 */
const uploadImage = async (imageFile: File): Promise<string> => {
  const requestId = crypto.randomUUID();
  console.log(
    `${LOG_PREFIX} [${requestId}] Validating image: ${imageFile.name} (${imageFile.size} bytes, type: ${imageFile.type})`
  );

  if (!VALID_IMAGE_TYPES.includes(imageFile.type)) {
    console.error(
      `${LOG_PREFIX} [${requestId}] Invalid image type: ${imageFile.type}`
    );
    throw new Error(
      `Invalid image type: ${
        imageFile.type
      }. Supported types: ${VALID_IMAGE_TYPES.join(", ")}`
    );
  }
  if (imageFile.size > MAX_IMAGE_SIZE) {
    const sizeMB = (imageFile.size / (1024 * 1024)).toFixed(2);
    console.error(`${LOG_PREFIX} [${requestId}] Image too large: ${sizeMB}MB`);
    throw new Error(`Image size (${sizeMB}MB) exceeds the 15MB limit`);
  }

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "product_images");

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_UPLOAD_RETRIES; attempt++) {
    try {
      console.log(`${LOG_PREFIX} [${requestId}] Upload attempt ${attempt}`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data?.url) {
        throw new Error("Invalid response: Missing image URL");
      }

      console.log(`${LOG_PREFIX} [${requestId}] Image uploaded: ${data.url}`);
      return data.url;
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Unknown upload error");
      console.error(
        `${LOG_PREFIX} [${requestId}] Upload attempt ${attempt} failed: ${lastError.message}`
      );
      if (attempt < MAX_UPLOAD_RETRIES) {
        const retryDelay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(
          `${LOG_PREFIX} [${requestId}] Retrying after ${retryDelay}ms`
        );
        await delay(retryDelay);
      }
    }
  }

  console.error(
    `${LOG_PREFIX} [${requestId}] Image upload failed after ${MAX_UPLOAD_RETRIES} attempts`
  );
  throw lastError || new Error("Image upload failed");
};

// دالة لطباعة الأخطاء بشكل احترافي وملون
function logError(message: string, error?: unknown) {
  const RED = "\x1b[31m";
  const RESET = "\x1b[0m";
  const time = new Date().toISOString();
  console.error(`${RED}❌ [ERROR] [${time}] ${message}${RESET}`);
  if (error) {
    if (error instanceof Error) {
      console.error(error.stack || error.message);
    } else {
      console.error(error);
    }
  }
}

/**
 * Revalidates cache for relevant paths in a batch.
 * @param productId - Optional product ID for specific paths.
 */
const revalidatePaths = async (productId?: string): Promise<void> => {
  const paths = [
    `/${Routes.MENU}`,
    `/${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
    productId
      ? `/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${productId}/${Pages.EDIT}`
      : null,
    "/",
  ].filter(Boolean) as string[];

  console.log(`${LOG_PREFIX} Revalidating paths: ${paths.join(", ")}`);
  await Promise.all(paths.map((path) => revalidatePath(path)));
};

/**
 * Adds a new product to the database.
 * @param args - Category ID and product options.
 * @param _prevState - Previous state (unused).
 * @param formData - Form data containing product details.
 * @returns ActionResponse with status and message.
 */
export const addProduct = async (
  args: AddProductArgs,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResponse> => {
  const requestId = crypto.randomUUID();
  console.log(`${LOG_PREFIX} [${requestId}] Processing addProduct`);

  try {
    // تحقق من وجود التصنيف قبل إنشاء المنتج
    const category = await db.category.findUnique({
      where: { id: args.categoryId },
    });
    if (!category) {
      return {
        status: 400,
        message: "Invalid category selected. Please choose a valid category.",
        error: { categoryId: "The selected category does not exist." },
      };
    }

    // Log raw form data
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      rawData[key] = value instanceof File ? `[File: ${value.name}]` : value;
    });
    console.log(`${LOG_PREFIX} [${requestId}] Raw FormData:`, rawData);

    // Parse form data
    const productTechsRaw = formData.get("productTechs") as string | null;
    const beneficiary = formData.get("beneficiary") as string | undefined;
    const priceRaw = formData.get("price") as string | undefined;
    const ratingRaw = formData.get("rating") as string | undefined;
    const urlRaw = formData.get("url") as string | undefined;
    const url = urlRaw && /^https?:\/\/.+/.test(urlRaw) ? urlRaw : undefined;
    const pdfFile = formData.get("pdf") as File | null;
    console.log("PDF file from formData:", pdfFile);
    const pagesRaw = formData.get("pages") as string | undefined;

    // Parse productTechs as strings
    const productTechs: { name: string }[] = productTechsRaw
      ? JSON.parse(productTechsRaw).map((tech: { name: string }) => ({
          name: tech.name,
        }))
      : [];

    // Prepare validation input
    const validationInput: Partial<ProductValidatedData> = {
      name: formData.get("name") as string | undefined,
      description: formData.get("description") as string | undefined,
      beneficiary,
      categoryId: args.categoryId,
      image: formData.get("image") as File | undefined,
      productTechs,
      price: priceRaw ? parseFloat(priceRaw) : undefined,
      rating: ratingRaw ? parseFloat(ratingRaw) : 0,
      url,
    };
    console.log(
      `${LOG_PREFIX} [${requestId}] Validation Input:`,
      validationInput
    );

    // Validate form data using Zod schema
    const result = addProductSchema().safeParse(validationInput);

    if (!result.success) {
      const errorDetails = result.error.flatten();
      console.log(
        `${LOG_PREFIX} [${requestId}] Validation Errors:`,
        errorDetails
      );
      return {
        status: 400,
        message: "Invalid form data",
        error: Object.fromEntries(
          Object.entries(errorDetails.fieldErrors).map(([key, value]) => [
            key,
            value?.join(", ") || "",
          ])
        ),
        formData,
      };
    }

    const {
      name,
      description,
      beneficiary: validatedBeneficiary,
      categoryId,
      image,
      productTechs: validatedTechs,
      price,
      rating,
    } = result.data;

    console.log(`${LOG_PREFIX} [${requestId}] Validated Data:`, {
      name,
      description,
      beneficiary: validatedBeneficiary,
      categoryId,
      productTechs: validatedTechs,
      price,
      rating,
    });

    // Validate image
    const imageFile = image as File;
    if (!imageFile || imageFile.size === 0) {
      console.error(`${LOG_PREFIX} [${requestId}] No image provided`);
      return {
        status: 400,
        message: "An image is required",
        error: { image: "Image is required" },
      };
    }

    // Upload image
    const imageUrl = await uploadImage(imageFile);

    // Create product
    const product = await db.product.create({
      data: {
        name,
        description,
        beneficiary: validatedBeneficiary,
        image: imageUrl,
        categoryId,
        price,
        order: 0,
        rating: rating ?? 0,
        url,
        pages: pagesRaw ? parseInt(pagesRaw) : undefined,
        ProductTech: {
          createMany: {
            data: validatedTechs.map((tech) => ({
              name: tech.name, // Store as string
            })),
          },
        },
      },
    });

    console.log("Product created", product);

    // Revalidate cache
    await revalidatePaths();

    return {
      status: 201,
      message: "Product added successfully",
    };
  } catch (error) {
    logError(`${LOG_PREFIX} [${requestId}] Error:`, error);
    let errorMsg = "Unknown error";
    if (error instanceof Error) {
      errorMsg = error.message;
    } else if (typeof error === "object" && error !== null) {
      errorMsg = JSON.stringify(error);
    } else if (typeof error === "string") {
      errorMsg = error;
    }
    return {
      status: 500,
      message: `Failed to add product: ${errorMsg}`,
    };
  }
};

/**
 * Updates an existing product in the database.
 * @param args - Product ID and product options.
 * @param _prevState - Previous state (unused).
 * @param formData - Form data containing updated product details.
 * @returns ActionResponse with status and message.
 */
export const updateProduct = async (
  args: UpdateProductArgs,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResponse> => {
  const requestId = crypto.randomUUID();
  console.log(
    `${LOG_PREFIX} [${requestId}] Processing updateProduct for ID: ${args.productId}`
  );

  try {
    // Log raw form data
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      rawData[key] = value instanceof File ? `[File: ${value.name}]` : value;
    });
    console.log(`${LOG_PREFIX} [${requestId}] Raw FormData:`, rawData);

    // Parse form data
    const productTechsRaw = formData.get("productTechs") as string | null;
    const beneficiary = formData.get("beneficiary") as string | undefined;
    const priceRaw = formData.get("price") as string | undefined;
    const ratingRaw = formData.get("rating") as string | undefined;
    const pdfFile2 = formData.get("pdf") as File | null;
    console.log("PDF file from formData (update):", pdfFile2);
    const pagesRaw2 = formData.get("pages") as string | undefined;
    let pages2: number | undefined = undefined;
    if (pagesRaw2 && !isNaN(Number(pagesRaw2))) {
      pages2 = Number(pagesRaw2);
    }

    // Parse productTechs as strings
    const productTechs: { name: string }[] = productTechsRaw
      ? JSON.parse(productTechsRaw).map((tech: { name: string }) => ({
          name: tech.name,
        }))
      : [];

    // Prepare validation input
    const urlRaw2 = formData.get("url") as string | undefined;
    const url2 =
      urlRaw2 && /^https?:\/\/.+/.test(urlRaw2) ? urlRaw2 : undefined;
    const validationInput2: Partial<ProductValidatedData> = {
      name: formData.get("name") as string | undefined,
      description: formData.get("description") as string | undefined,
      beneficiary: formData.get("beneficiary") as string | undefined,
      categoryId: formData.get("categoryId") as string | undefined,
      image: formData.get("image") as File | undefined,
      productTechs,
      price: priceRaw ? parseFloat(priceRaw) : undefined,
      rating: ratingRaw ? parseFloat(ratingRaw) : 0,
      url: url2,
    };
    console.log(
      `${LOG_PREFIX} [${requestId}] Validation Input:`,
      validationInput2
    );

    // Validate form data using Zod schema
    const result = updateProductSchema().safeParse(validationInput2);

    if (!result.success) {
      const errorDetails = result.error.flatten();
      console.log(
        `${LOG_PREFIX} [${requestId}] Validation Errors:`,
        errorDetails
      );
      return {
        status: 400,
        message: "Invalid form data",
        error: Object.fromEntries(
          Object.entries(errorDetails.fieldErrors).map(([key, value]) => [
            key,
            value?.join(", ") || "",
          ])
        ),
        formData,
      };
    }

    const {
      name: name2,
      description: description2,
      beneficiary: validatedBeneficiary2,
      categoryId: categoryId2,
      image: image2,
      productTechs: validatedTechs2,
      price: price2,
      rating: rating2,
    } = result.data;
    console.log(`${LOG_PREFIX} [${requestId}] Validated Data:`, {
      name: name2,
      description: description2,
      beneficiary: validatedBeneficiary2,
      categoryId: categoryId2,
      productTechs: validatedTechs2,
      price: price2,
      rating: rating2,
    });

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: args.productId },
    });
    if (!product) {
      console.error(
        `${LOG_PREFIX} [${requestId}] Product not found: ${args.productId}`
      );
      return {
        status: 404,
        message: "Product not found",
      };
    }

    // Robustly handle image field with logging
    const imageField = formData.get("image");
    console.log(
      "[updateProduct] imageField:",
      imageField,
      "typeof:",
      typeof imageField
    );
    let imageFile: File | undefined = undefined;
    if (
      imageField &&
      typeof imageField === "object" &&
      "size" in imageField &&
      (imageField as File).size > 0 &&
      (imageField as File).type
    ) {
      imageFile = imageField as File;
    } else {
      imageFile = undefined;
    }
    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    // Update product in a transaction
    const updatedProduct = await db.$transaction(async (tx) => {
      const updateData: any = {
        name: name2,
        description: description2,
        beneficiary: validatedBeneficiary2,
        categoryId: categoryId2,
        price: price2,
        rating: rating2 ?? 0,
        url: url2,
      };
      if (typeof imageUrl === "string") {
        updateData.image = imageUrl;
      }
      if (typeof pages2 === "number" && !isNaN(pages2)) {
        updateData.pages = pages2;
      }
      const productUpdate = await tx.product.update({
        where: { id: args.productId },
        data: updateData,
      });

      await tx.productTech.deleteMany({ where: { productId: args.productId } });

      await tx.productTech.createMany({
        data: validatedTechs2.map((tech) => ({
          productId: args.productId,
          name: tech.name, // Store as string
        })),
      });

      console.log("Product updated", productUpdate);

      return productUpdate;
    });

    console.log(
      `${LOG_PREFIX} [${requestId}] Product updated: ${updatedProduct.id}`
    );

    // Revalidate cache
    await revalidatePaths(updatedProduct.id);

    return {
      status: 200,
      message: "Product updated successfully",
    };
  } catch (error) {
    logError(`${LOG_PREFIX} [${requestId}] Error:`, error);
    return {
      status: 500,
      message: `Failed to update product: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

/**
 * Deletes a product from the database.
 * @param id - The ID of the product to delete.
 * @returns ActionResponse with status and message.
 */
export const deleteProduct = async (id: string): Promise<ActionResponse> => {
  const requestId = crypto.randomUUID();
  console.log(
    `${LOG_PREFIX} [${requestId}] Processing deleteProduct for ID: ${id}`
  );

  try {
    const product = await db.product.findUnique({
      where: { id },
    });
    if (!product) {
      console.error(`${LOG_PREFIX} [${requestId}] Product not found: ${id}`);
      return {
        status: 404,
        message: "Product not found",
      };
    }

    await db.product.delete({
      where: { id },
    });

    console.log(`${LOG_PREFIX} [${requestId}] Product deleted: ${id}`);

    // Revalidate cache
    await revalidatePaths(id);

    return {
      status: 200,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error(`${LOG_PREFIX} [${requestId}] Error:`, error);
    return {
      status: 500,
      message: `Failed to delete product: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

// دالة اختبار الاتصال بـ Supabase
export async function testSupabaseConnection() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    logError("Supabase connection error:", error);
    return false;
  }
  // طباعة قائمة البكتس بشكل احترافي
  const CYAN = "\x1b[36m";
  const GREEN = "\x1b[32m";
  const YELLOW = "\x1b[33m";
  const RESET = "\x1b[0m";
  console.log(`${CYAN}Supabase buckets:${RESET}`);
  if (Array.isArray(data) && data.length > 0) {
    data.forEach((bucket) => {
      if (bucket.name === "pdfs") {
        console.log(`${GREEN}➡️  { name: \"pdfs\", ... }${RESET}`);
      } else {
        console.log(`${YELLOW}  - { name: \"${bucket.name}\", ... }${RESET}`);
      }
    });
    const pdfsExists = data.some((b) => b.name === "pdfs");
    if (!pdfsExists) {
      logError('Bucket "pdfs" does NOT exist!');
    }
  } else {
    logError("No buckets found in Supabase storage!");
  }
  return true;
}
