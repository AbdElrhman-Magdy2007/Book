import { z } from "zod";

// Centralized error messages for user-friendly feedback
export const errorMessages = {
  requiredName: "Product name is required",
  requiredDescription: "Product description is required",
  requiredCategory: "Category is required",
  requiredImage: "Product image is required",
  invalidImage:
    "Image must be a valid file (JPEG, PNG, GIF, WebP, SVG, BMP) under 15MB",
  requiredTech: "At least one technology is required",
  invalidTech: "Technology name is required",
  requiredAddon: "Exactly one addon is required",
  invalidAddon:
    "Addon must be a valid package option (FullStack, Backend, Frontend, UI, UX)",
  requiredBeneficiary: "Beneficiary is required",
  invalidBeneficiary: "Beneficiary must be a valid beneficiary",
  beneficiaryMaxLength: "Beneficiary must be less than 100 characters",
  beneficiaryMinLength: "Beneficiary must be at least 3 characters",
  beneficiary: "Make sure to write the beneficiary",
  tooManyAddons: "Only one addon is allowed",
  requiredPrice: "Price is required",
  invalidPrice: "Price must be a positive number",
  invalidGitHubLink:
    "GitHub link must be a valid GitHub repository URL (e.g., https://github.com/user/repo)",
};

// Image validation constants
const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
];

/**
 * Sanitizes input strings to prevent XSS by removing script tags and HTML.
 * @param value - Input value to sanitize.
 * @returns Sanitized string or empty string if input is invalid.
 */
const sanitizeString = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
};

/**
 * Validates an image file for type, size, and presence.
 * @param isRequired - Whether the image is required (true for add, false for update).
 * @returns Zod schema for image validation.
 */
const imageValidation = (isRequired: boolean) =>
  z
    .instanceof(File, { message: errorMessages.invalidImage })
    .optional()
    .refine(
      (file) =>
        isRequired
          ? file !== undefined && file !== null && file.size > 0
          : true,
      { message: errorMessages.requiredImage }
    )
    .refine(
      (file) =>
        !file ||
        (VALID_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE),
      { message: errorMessages.invalidImage }
    );

/**
 * Defines validation schemas for product technologies and addons.
 */
const getOptionsValidations = () => ({
  productTechs: z
    .array(
      z.object({
        name: z.string().trim().min(1, { message: errorMessages.invalidTech }),
      })
    )
    .optional()
    .default([]),
});

/**
 * Defines common validations for product fields with sanitization.
 * @returns Object containing Zod schemas for common fields.
 */
const getCommonValidations = () => ({
  name: z.preprocess(
    sanitizeString,
    z
      .string()
      .trim()
      .min(1, { message: errorMessages.requiredName })
      .max(100, { message: "Product name must be less than 100 characters" })
  ),
  description: z.preprocess(
    sanitizeString,
    z
      .string()
      .trim()
      .min(1, { message: errorMessages.requiredDescription })
      .max(1000, { message: "Description must be less than 1000 characters" })
  ),
  beneficiary: z
    .string()
    .min(1, { message: errorMessages.requiredBeneficiary }),
  categoryId: z.string().uuid({ message: errorMessages.requiredCategory }),
  gitHubLink: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (z.string().url().safeParse(val).success &&
          /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+(\/.*)?$/.test(val)),
      { message: errorMessages.invalidGitHubLink }
    ),
  url: z
    .string({ required_error: "Product URL is required" })
    .min(1, { message: "Product URL is required" })
    .refine((val) => /^https?:\/\/.+/.test(val), {
      message: "The URL must start with http or https and be valid.",
    }),
  price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z
      .number({ invalid_type_error: errorMessages.invalidPrice })
      .min(0, { message: errorMessages.invalidPrice })
      .refine((val) => !isNaN(val), { message: errorMessages.invalidPrice })
      .refine((val) => val !== undefined && val !== null, {
        message: errorMessages.requiredPrice,
      })
  ),
  ...getOptionsValidations(),
  rating: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z
      .number()
      .min(0, { message: "Rating must be at least 0" })
      .max(5, { message: "Rating must be at most 5" })
      .refine((val) => val * 2 === Math.round(val * 2), {
        message: "Rating must be in 0.5 steps",
      })
      .default(0)
  ),
});

/**
 * Type definition for validated product data.
 */
export type ProductValidatedData = z.infer<ReturnType<typeof addProductSchema>>;

/**
 * Validation schema for adding a new product.
 * @returns Zod schema for adding a product.
 */
export const addProductSchema = () =>
  z.object({
    ...getCommonValidations(),
    image: imageValidation(true),
  });

/**
 * Validation schema for updating an existing product.
 * @returns Zod schema for updating a product.
 */
export const updateProductSchema = () =>
  z.object({
    ...getCommonValidations(),
    image: imageValidation(false),
  });

/**
 * Interface for validation errors returned to the client.
 */
export interface ValidationError {
  [key: string]: string | undefined;
}
