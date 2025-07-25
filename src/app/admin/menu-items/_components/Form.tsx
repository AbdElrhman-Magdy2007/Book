"use client";

import { useState, useEffect, useCallback, ChangeEvent, useRef } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Category, ProductTech } from "@prisma/client";
import { ProductWithRelations } from "@/app/types/product";
import { InputTypes, Pages, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { addProduct, deleteProduct, updateProduct } from "../_actions/product";
import { ValidationError } from "@/app/validations/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IFormField } from "@/app/types/app";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SelectCategory from "./SelectCategory";
import ItemOptions, { ItemOptionsKeys } from "./ItemOptions";
import {
  ArrowLeft,
  CameraIcon,
  CheckCircleIcon,
  Loader,
  XCircleIcon,
} from "lucide-react";
import FormFields from "@/components/from-fields/from-fieds";

// Form values aligned with productSchema
interface FormValues {
  name: string;
  description: string;
  beneficiary: string;
  price: string;
  rating: number;
  url?: string;
  pages?: string;
}

interface FormProps {
  categories: Category[];
  product?: ProductWithRelations;
}

// Animation variants for page transition
const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeInOut },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.6, ease: easeInOut },
  },
};

// Custom loader component
const SubmissionLoader = () => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      className="h-16 w-16 border-t-4 border-indigo-500 rounded-full"
    />
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="absolute mt-24 text-indigo-200 text-lg font-medium"
    >
      Saving your product...
    </motion.p>
  </motion.div>
);

// Form component
function Form({ categories, product }: FormProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product?.image ?? null
  );
  const [categoryId, setCategoryId] = useState<string>(
    product?.categoryId ?? categories[0]?.id ?? ""
  );
  const [productTechs, setProductTechs] = useState<Partial<ProductTech>[]>(
    product?.ProductTech ?? []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { getFormFields } = useFormFields({
    slug: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
  });

  const [formValues, setFormValues] = useState<FormValues>(() => ({
    name: product?.name ?? "",
    description: product?.description ?? "",
    beneficiary: product?.beneficiary ?? "",
    price: product?.price?.toString() ?? "",
    rating: product?.rating ?? 0,
    url: product?.url ?? "",
    pages: product?.pages?.toString() ?? "",
  }));

  const initialState: {
    message?: string;
    error?: ValidationError;
    status?: number | null;
    formData?: FormData | null;
  } = {
    message: "",
    error: {},
    status: null,
    formData: null,
  };

  const [state, action, pending] = useActionState(
    product
      ? updateProduct.bind(null, {
          productId: product.id,
          options: { productTechs },
        })
      : addProduct.bind(null, {
          categoryId,
          options: { productTechs },
        }),
    initialState
  );

  // Handle form submission feedback and page reload
  useEffect(() => {
    if ((state.status === 201 || state.status === 200) && !pending) {
      setIsSubmitting(true);
      setShowSuccessModal(true);
      toast.success(state.message || "Product saved successfully!", {
        icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
        style: {
          background: "linear-gradient(135deg, #1A3C34, #2D6A4F)",
          color: "#6EE7B7",
          border: "1px solid #6EE7B7",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        },
        position: "top-right",
        duration: 2500,
        className: "animate-pulse",
      });
      // Auto-close modal and redirect
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        router.push(`/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (state.message && state.status && !pending) {
      const isSuccess = state.status === 200 || state.status === 201;
      if (!isSuccess) {
        toast.error(state.message, {
          icon: <XCircleIcon className="w-5 h-5 text-red-400" />,
          style: {
            background: "linear-gradient(135deg, #4E1313, #7F1D1D)",
            color: "#FCA5A5",
            border: "1px solid #FCA5A5",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          },
          position: "top-right",
          duration: 3000,
        });

        if (state.error) {
          // Map field keys to user-friendly labels
          const fieldLabels: Record<string, string> = {
            name: "Product Name",
            description: "Description",
            beneficiary: "Beneficiary",
            price: "Price",
            url: "Product URL",
            pages: "Pages",
            // Add more if needed
          };
          Object.entries(state.error).forEach(([field, error]) => {
            toast.error(error, {
              description: fieldLabels[field]
                ? `Field: ${fieldLabels[field]}`
                : undefined,
              style: {
                background: "linear-gradient(135deg, #4E1313, #7F1D1D)",
                color: "#FCA5A5",
                border: "1px solid #FCA5A5",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              },
              position: "top-right",
              duration: 3000,
            });
          });
        }
      }
    }
  }, [state.status, state.message, state.error, pending, categories, router]);

  const handleFieldChange = useCallback(
    (name: keyof FormValues) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        console.log(
          `[Form] Field Change: ${name} = "${value}" (type: ${e.target.type}, id: ${e.target.id})`
        );
        setFormValues((prev) => {
          const newValues = { ...prev, [name]: value };
          console.log(`[Form] Updated formValues:`, newValues);
          return newValues;
        });
      },
    []
  );

  const handleSubmit = (formData: FormData) => {
    const requiredFields: (keyof FormValues)[] = [
      "name",
      "description",
      "beneficiary",
      "price",
      "pages",
    ];
    // Map field keys to user-friendly labels
    const fieldLabels: Record<string, string> = {
      name: "Product Name",
      description: "Description",
      beneficiary: "Beneficiary",
      price: "Price",
      url: "Product URL",
      pages: "Pages",
      // Add more if needed
    };
    const missingFields = requiredFields.filter(
      (field) =>
        !formValues[field] || formValues[field].toString().trim() === ""
    );
    const missingLabels = missingFields.map((f) => fieldLabels[f] || f);

    if (missingFields.length > 0) {
      // Focus the first missing field for better UX
      const firstMissing = missingFields[0];
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[name='${firstMissing}']`
      );
      if (el) el.focus();
      // Show a more user-friendly message
      if (missingFields.length === 1) {
        toast.error(`Please enter the ${missingLabels[0]}.`, {
          style: {
            background: "linear-gradient(135deg, #4E1313, #7F1D1D)",
            color: "#FCA5A5",
            border: "1px solid #FCA5A5",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          },
        });
      } else {
        toast.error(`Please fill in: ${missingLabels.join(", ")}`, {
          style: {
            background: "linear-gradient(135deg, #4E1313, #7F1D1D)",
            color: "#FCA5A5",
            border: "1px solid #FCA5A5",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          },
        });
      }
      return;
    }

    if (product) {
      // Update: only append image if a new file is selected
      const fileInput =
        document.querySelector<HTMLInputElement>("#image-upload");
      if (fileInput?.files?.[0]) {
        formData.append("image", fileInput.files[0]);
      }
    } else {
      // Add: require image
      const fileInput =
        document.querySelector<HTMLInputElement>("#image-upload");
      if (!fileInput?.files?.[0]) {
        toast.error("Please upload an image", {
          style: {
            background: "linear-gradient(135deg, #4E1313, #7F1D1D)",
            color: "#FCA5A5",
            border: "1px solid #FCA5A5",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          },
        });
        return;
      }
      formData.append("image", fileInput.files[0]);
    }

    if (!categoryId) {
      toast.error("Please select a category", {
        style: {
          background: "linear-gradient(135deg, #4E1313, #7F1D1D)",
          color: "#FCA5A5",
          border: "1px solid #FCA5A5",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
        },
      });
      return;
    }

    formData.append("categoryId", categoryId);
    Object.entries(formValues).forEach(([key, value]) => {
      const stringValue = value?.toString() || "";
      formData.append(key, stringValue);
      console.log(`[Form] Appending to FormData: ${key} = "${stringValue}"`);
    });

    formData.append("productTechs", JSON.stringify(productTechs));

    // Log all FormData keys and values for debugging
    formData.forEach((value, key) => {
      console.log("FormData:", key, value, typeof value);
    });

    action(formData);
  };

  useEffect(() => {
    const fields = getFormFields();
    console.log(`[Form] Rendered Fields:`, fields);
    fields.forEach((field: IFormField) => {
      console.log(`[Form] FormFields Props for ${field.name}:`, {
        name: field.name,
        type: field.type,
        value: formValues[field.name as keyof FormValues] ?? "",
        hasOnChange: !!handleFieldChange(field.name as keyof FormValues),
      });
    });
  }, [formValues, handleFieldChange]);

  return (
    <>
      {showSuccessModal && (
        <div
          ref={modalRef}
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          aria-modal="true"
          role="dialog"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowSuccessModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-4 animate-pop-in">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-2 animate-bounce-in" />
            <h2 className="text-2xl font-bold text-gray-800">
              Product Updated!
            </h2>
            <p className="text-gray-600 text-center">
              All changes have been saved successfully.
              <br />
              You will be redirected to the product list.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-emerald-600 transition"
              onClick={() => {
                setShowSuccessModal(false);
                router.push(`/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
              }}
              aria-label="Return to product list"
            >
              Back to Product List
            </Button>
          </div>
        </div>
      )}
      <AnimatePresence mode="wait">
        {isSubmitting ? (
          <SubmissionLoader key="loader" />
        ) : (
          <motion.form
            key="form"
            action={handleSubmit}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex flex-col md:flex-row gap-8 p-8 bg-gray-900/90 rounded-2xl shadow-2xl border border-indigo-600/30 max-w-4xl mx-auto backdrop-blur-md"
            role="form"
            aria-labelledby="product-form-title"
          >
            <h2 id="product-form-title" className="sr-only">
              {product ? "Update Product" : "Add Product"}
            </h2>
            <div className="absolute top-4 right-4">
              <Link
                href={`/${Routes.ADMIN}/${Pages.MENU_ITEMS}`}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-200 transition-colors duration-300 group"
                aria-label="Back to menu items"
              >
                <span className="text-sm font-medium">Back to Menu</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <motion.div
              className="flex-shrink-0 pt-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <UploadImage
                className={cn(
                  "bg-gray-900/90 border border-indigo-600/30 rounded-xl p-3 shadow-md"
                )}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
              {state?.error?.image && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "text-sm text-red-400 font-medium text-center mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
                  )}
                  aria-live="polite"
                >
                  <span className="text-red-400">⚠</span> {state.error.image}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              className="flex-1 space-y-6 pt-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="price"
                    className="text-indigo-300 font-medium text-sm"
                  >
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formValues.price}
                    onChange={handleFieldChange("price")}
                    className={cn(
                      "w-full p-3 bg-gray-800/50 border border-indigo-600/30 rounded-lg",
                      "text-indigo-200 placeholder-indigo-400/50",
                      "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/50",
                      "transition-all duration-300",
                      state?.error?.price && "border-red-500/30"
                    )}
                    aria-label="Price"
                    placeholder="Enter price"
                  />
                  {state?.error?.price && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "text-sm text-red-400 font-medium mt-1 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
                      )}
                      aria-live="polite"
                    >
                      <span className="text-red-400">⚠</span>
                      {state.error.price}
                    </motion.p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="url"
                    className="text-indigo-300 font-medium text-sm"
                  >
                    Product link{" "}
                  </label>
                  <input
                    id="url"
                    name="url"
                    type="url"
                    value={formValues.url || ""}
                    onChange={handleFieldChange("url")}
                    className={cn(
                      "w-full p-3 bg-gray-800/50 border border-indigo-600/30 rounded-lg",
                      "text-indigo-200 placeholder-indigo-400/50",
                      "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/50",
                      "transition-all duration-300",
                      state?.error?.url && "border-red-500/30"
                    )}
                    aria-label="Product URL"
                    placeholder="https://example.com"
                    pattern="https?://.+"
                  />
                  {state?.error?.url && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "text-sm text-red-400 font-medium mt-1 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
                      )}
                      aria-live="polite"
                    >
                      <span className="text-red-400">⚠</span>
                      {state.error.url}
                    </motion.p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="pages"
                    className="text-indigo-300 font-medium text-sm"
                  >
                    Pages
                  </label>
                  <input
                    id="pages"
                    name="pages"
                    type="number"
                    min="1"
                    required
                    value={formValues.pages}
                    onChange={handleFieldChange("pages")}
                    className={cn(
                      "w-full p-3 bg-gray-800/50 border border-indigo-600/30 rounded-lg",
                      "text-indigo-200 placeholder-indigo-400/50",
                      "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/50",
                      "transition-all duration-300",
                      state?.error?.pages && "border-red-500/30"
                    )}
                    aria-label="Pages"
                    placeholder="Enter number of pages"
                  />
                  {state?.error?.pages && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "text-sm text-red-400 font-medium mt-1 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
                      )}
                      aria-live="polite"
                    >
                      <span className="text-red-400">⚠</span>
                      {state.error.pages}
                    </motion.p>
                  )}
                </div>
                {getFormFields().map((field: IFormField) => (
                  <motion.div
                    key={field.name}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {/* Special handling for beneficiary field for clarity and professionalism */}
                    {field.name === "beneficiary" ? (
                      <div>
                        <label
                          htmlFor={field.name}
                          className="text-indigo-300 font-medium text-sm"
                        >
                          {field.label}
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder={field.placeholder}
                          value={(
                            formValues[field.name as keyof FormValues] ?? ""
                          ).toString()}
                          onChange={handleFieldChange(
                            field.name as keyof FormValues
                          )}
                          className={cn(
                            "w-full p-3 bg-gray-800/50 border border-indigo-600/30 rounded-lg",
                            "text-indigo-200 placeholder-indigo-400/50",
                            "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/50",
                            "transition-all duration-300",
                            state?.error?.[field.name] && "border-red-500/30"
                          )}
                          aria-label={
                            field.ariaLabel ?? field.label ?? field.name
                          }
                        />
                        {state?.error?.[field.name] && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "text-sm text-red-400 font-medium mt-1 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
                            )}
                            aria-live="polite"
                          >
                            <span className="text-red-400">⚠</span>
                            {state.error[field.name]}
                          </motion.p>
                        )}
                      </div>
                    ) : field.name === "gitHubLink" ? (
                      <div>
                        <label
                          htmlFor={field.name}
                          className="text-indigo-300 font-medium text-sm"
                        >
                          {field.label}
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type="url"
                          placeholder={field.placeholder}
                          pattern={field.pattern}
                          value={(
                            formValues[field.name as keyof FormValues] ?? ""
                          ).toString()}
                          onChange={handleFieldChange(
                            field.name as keyof FormValues
                          )}
                          className={cn(
                            "w-full p-3 bg-gray-800/50 border border-indigo-600/30 rounded-lg",
                            "text-indigo-200 placeholder-indigo-400/50",
                            "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/50",
                            "transition-all duration-300",
                            state?.error?.[field.name] && "border-red-500/30"
                          )}
                          aria-label={
                            field.ariaLabel ?? field.label ?? field.name
                          }
                        />
                      </div>
                    ) : (
                      <FormFields
                        {...field}
                        pattern={field.pattern || ""}
                        type={field.type as InputTypes}
                        error={state?.error?.[field.name]}
                        value={(
                          formValues[field.name as keyof FormValues] ?? ""
                        ).toString()}
                        onChange={handleFieldChange(
                          field.name as keyof FormValues
                        )}
                        ariaLabel={field.ariaLabel || field.label || field.name}
                        className={cn(
                          "w-full p-3 bg-gray-800/50 border border-indigo-600/30 rounded-lg",
                          "text-indigo-200 placeholder-indigo-400/50",
                          "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/50",
                          "transition-all duration-300",
                          state?.error?.[field.name] && "border-red-500/30"
                        )}
                      />
                    )}
                    {state?.error?.[field.name] &&
                      field.name !== "beneficiary" && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "text-sm text-red-400 font-medium mt-1 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
                          )}
                          aria-live="polite"
                        >
                          <span className="text-red-400">⚠</span>
                          {state.error[field.name]}
                        </motion.p>
                      )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <SelectCategory
                  categoryId={categoryId}
                  categories={categories}
                  setCategoryId={setCategoryId}
                  className={cn(
                    "w-full p-3 bg-gray-800/50 border border-indigo-600/30 rounded-lg",
                    "text-indigo-200",
                    "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/50",
                    "transition-all duration-300",
                    state?.error?.categoryId && "border-red-500/30"
                  )}
                />
                {state?.error?.categoryId && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "text-sm text-red-400 font-medium mt-1 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
                    )}
                    aria-live="polite"
                  >
                    <span className="text-red-400">⚠</span>{" "}
                    {state.error.categoryId}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <AddProductTech
                  productTechs={productTechs}
                  setProductTechs={setProductTechs}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              ></motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <FormActions pending={pending} product={product} />
              </motion.div>

              <div className="space-y-2">
                <label className="text-indigo-300 font-medium text-sm">
                  تقييم المنتج
                </label>
                <StarRating
                  value={formValues.rating}
                  onChange={(v) =>
                    setFormValues((prev) => ({ ...prev, rating: v }))
                  }
                />
              </div>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}

// UploadImage Component
interface UploadImageProps {
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  className?: string;
}

const UploadImage = ({
  selectedImage,
  setSelectedImage,
  className,
}: UploadImageProps) => {
  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        setSelectedImage(URL.createObjectURL(file));
      } else {
        toast.error("Image must be under 5MB", {
          style: {
            background: "linear-gradient(135deg, #4E1313, #7F1D1D)",
            color: "#FCA5A5",
            border: "1px solid #FCA5A5",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          },
        });
      }
    },
    [setSelectedImage]
  );

  return (
    <motion.div
      className={cn(
        "group relative w-56 h-56 overflow-hidden rounded-xl border-2 border-indigo-600/30 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {selectedImage ? (
        <Image
          src={selectedImage}
          alt="Product Image"
          width={224}
          height={224}
          className="rounded-xl object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-800/50 rounded-xl flex items-center justify-center">
          <CameraIcon className="w-12 h-12 text-indigo-400" />
        </div>
      )}
      <div
        className={cn(
          "absolute inset-0 bg-indigo-600/20 flex items-center justify-center transition-opacity duration-300",
          selectedImage ? "group-hover:opacity-100 opacity-0" : "opacity-100"
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleImageChange}
          name="image"
          aria-label="Upload product image"
        />
        <label
          htmlFor="image-upload"
          className="w-full h-full flex items-center justify-center cursor-pointer"
        >
          <CameraIcon className="w-10 h-10 text-indigo-200 drop-shadow-md" />
        </label>
      </div>
    </motion.div>
  );
};

// FormActions Component
interface FormActionsProps {
  pending: boolean;
  product?: ProductWithRelations;
}

const FormActions = ({ pending, product }: FormActionsProps) => {
  const [state, setState] = useState<{
    pending: boolean;
    status: null | number;
    message: string;
  }>({
    pending: false,
    status: null,
    message: "",
  });

  const handleDelete = useCallback(async (id: string) => {
    try {
      setState((prev) => ({ ...prev, pending: true }));
      const res = await deleteProduct(id);
      setState((prev) => ({
        ...prev,
        status: res.status,
        message: res.message,
      }));
    } catch (error) {
      console.error("[FormActions] Delete error:", error);
      setState((prev) => ({
        ...prev,
        status: 500,
        message: "An unexpected error occurred",
      }));
    } finally {
      setState((prev) => ({ ...prev, pending: false }));
    }
  }, []);

  useEffect(() => {
    if (state.message && state.status && !state.pending) {
      const isSuccess = state.status === 200;
      toast[isSuccess ? "success" : "error"](state.message, {
        icon: isSuccess ? (
          <CheckCircleIcon className="w-5 h-5 text-green-400" />
        ) : (
          <XCircleIcon className="w-5 h-5 text-red-400" />
        ),
        style: {
          background: isSuccess
            ? "linear-gradient(135deg, #1A3C34, #2D6A4F)"
            : "linear-gradient(135deg, #4E1313, #7F1D1D)",
          color: isSuccess ? "#6EE7B7" : "#FCA5A5",
          border: `1px solid ${isSuccess ? "#6EE7B7" : "#FCA5A5"}`,
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        },
        position: "top-right",
        duration: 3000,
      });
    }
  }, [state.message, state.status, state.pending]);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div
        className={cn("grid", product ? "grid-cols-2" : "grid-cols-1", "gap-4")}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            disabled={pending}
            className={cn(
              "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg",
              "hover:from-indigo-700 hover:to-purple-700 border border-indigo-600/30",
              "focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900",
              "shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2",
              pending && "opacity-60 cursor-not-allowed"
            )}
            aria-label={product ? "Update product" : "Add product"}
          >
            {pending ? (
              <Loader className="w-5 h-5 text-white animate-spin" />
            ) : product ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </Button>
        </motion.div>
        {product && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              disabled={state.pending}
              onClick={() => handleDelete(product.id)}
              className={cn(
                "border-indigo-600/30 text-indigo-300 font-semibold py-3 rounded-lg",
                "hover:bg-indigo-600/20 hover:text-white",
                "focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900",
                "shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2",
                state.pending && "opacity-60 cursor-not-allowed"
              )}
              aria-label="Delete product"
            >
              {state.pending ? (
                <Loader className="w-5 h-5 text-indigo-300 animate-spin" />
              ) : (
                "Delete Product"
              )}
            </Button>
          </motion.div>
        )}
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={`/${Routes.ADMIN}/${Pages.MENU_ITEMS}`}
          className={buttonVariants({
            variant: "outline",
            className: cn(
              "w-full text-center font-semibold border border-indigo-600/30",
              "py-3 rounded-lg text-indigo-300",
              "hover:bg-indigo-600/20 hover:text-white",
              "focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900",
              "shadow-lg hover:shadow-xl transition-all duration-300"
            ),
          })}
          aria-label="Cancel and return to menu items"
        >
          Cancel
        </Link>
      </motion.div>
    </div>
  );
};

// AddProductTech Component
interface AddProductTechProps {
  productTechs: Partial<ProductTech>[];
  setProductTechs: React.Dispatch<React.SetStateAction<Partial<ProductTech>[]>>;
}

const AddProductTech = ({
  productTechs,
  setProductTechs,
}: AddProductTechProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-gray-800/50 border border-indigo-600/30 rounded-xl shadow-md"
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger
          className={cn(
            "text-indigo-300 text-xl font-semibold px-4 py-3",
            "hover:bg-indigo-600/20 hover:text-white",
            "focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900",
            "transition-all duration-300"
          )}
          aria-label="Toggle product technologies"
        >
          Product Technologies
        </AccordionTrigger>
        <AccordionContent className="px-4 py-3 text-indigo-200">
          <ItemOptions
            optionKey={ItemOptionsKeys.ProductTechS}
            state={productTechs}
            setState={setProductTechs}
            className="bg-gray-800/50 text-indigo-200 border-indigo-600/30 rounded-lg"
            placeholder="Add technology (e.g., React, TypeScript)"
            validate={(value: Partial<ProductTech>) => {
              if (!value.name?.trim()) {
                return "Technology name is required";
              }
              return null;
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// ⭐ مكون تقييم النجوم
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={
            star <= value
              ? "text-yellow-400 text-2xl transition-colors"
              : "text-gray-400 text-2xl transition-colors"
          }
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          {Number.isInteger(star) ? "★" : "⯨"}
        </button>
      ))}
    </div>
  );
}

export default Form;
export { UploadImage, FormActions, AddProductTech };
