"use client";

import { InputTypes, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { Session } from "next-auth";
import Image from "next/image";
import { Button } from "../ui/button";
import { UserRole } from "@prisma/client";
import {
  useActionState,
  useEffect,
  useState,
  useCallback,
  startTransition,
  useTransition,
} from "react";
import { updateProfile } from "./_actions/profile";
import { updateUserName } from "@/actions/user";
import {
  CameraIcon,
  Loader,
  Check,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import FormFields from "../from-fields/from-fieds";
import { Checkbox } from "@radix-ui/react-checkbox";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { IFormField } from "@/app/types/app";
import { ValidationError } from "@/app/validations/auth";
import { Input } from "../ui/input";

// Type for form state management
interface FormState {
  message?: string;
  error?: Record<string, string[]>;
  status?: number | null;
  formData?: FormData;
}

// Auto-save status types
type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

// Action لتحديث صورة المستخدم فقط
async function updateProfileImage(imageUrl: string, name: string) {
  // جلب الإيميل من sessionStorage أو من أي مصدر متاح
  const email = (window as any).currentUserEmail || null;
  if (!email) throw new Error("لا يمكن تحديد المستخدم الحالي لتحديث الصورة");
  if (!name) throw new Error("لا يمكن تحديد اسم المستخدم الحالي لتحديث الصورة");
  const formData = new FormData();
  formData.append("email", email);
  formData.append("image", imageUrl);
  formData.append("name", name);
  // isAdmin = false (افتراضي)
  const res = await updateProfile(false, {}, formData);
  if (res.status !== 200) throw new Error(res.message || "فشل تحديث الصورة");
}

if (typeof window !== "undefined") {
  (window as any).updateProfileImage = updateProfileImage;
}

function EditUserForm({ user }: { user: Session["user"] }) {
  const { data: session, update } = useSession();
  const [selectedImage, setSelectedImage] = useState(user.image ?? "");
  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);
  const [lastToastMessage, setLastToastMessage] = useState<string | null>(null);

  // Auto-save name state
  const [name, setName] = useState(user.name || "");
  const [nameStatus, setNameStatus] = useState<AutoSaveStatus>("idle");
  const [isNamePending, startNameTransition] = useTransition();
  const [lastSavedName, setLastSavedName] = useState(user.name || "");

  const formData = useCallback(() => {
    const data = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== "image") {
        data.append(key, value.toString());
      }
    });
    return data;
  }, [user]);

  const initialState: FormState = {
    message: "",
    error: {} as Record<string, string[]>,
    status: null,
    formData: formData(),
  };

  const [state, action, pending] = useActionState(
    updateProfile.bind(null, isAdmin),
    initialState
  );
  const { getFormFields } = useFormFields({
    slug: Routes.PROFILE,
  });

  // Auto-save name with debounce
  useEffect(() => {
    const trimmedName = name.trim();

    // Only save if name is different and valid
    if (trimmedName !== lastSavedName && trimmedName.length >= 2) {
      const timeoutId = setTimeout(() => {
        setNameStatus("saving");
        startNameTransition(async () => {
          try {
            const res = await updateUserName({
              id: user.id!,
              name: trimmedName,
            });

            if (res.success) {
              setNameStatus("saved");
              setLastSavedName(trimmedName);

              // Update session
              update({
                ...session,
                user: {
                  ...session?.user,
                  name: trimmedName,
                },
              });

              // Show success feedback
              toast.success("Name saved automatically", {
                duration: 2000,
                position: "top-right",
              });

              // Reset status after delay
              setTimeout(() => setNameStatus("idle"), 3000);
            } else {
              throw new Error(res.error || "Failed to save");
            }
          } catch (err) {
            setNameStatus("error");
            toast.error("Failed to save name automatically");

            // Reset status after delay
            setTimeout(() => setNameStatus("idle"), 3000);
          }
        });
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    }
  }, [name, lastSavedName, user.id, update, session]);

  // Handle toast and session updates
  useEffect(() => {
    if (
      state.message &&
      typeof state.status === "number" &&
      !pending &&
      state.message !== lastToastMessage
    ) {
      toast.dismiss("profile-update-loading");
      const isSuccess = state.status === 200;
      toast[isSuccess ? "success" : "error"](state.message, {
        style: {
          color: isSuccess ? "#34c759" : "#ef4444",
          backgroundColor: isSuccess ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${isSuccess ? "#dcfce7" : "#fee2e2"}`,
          borderRadius: "8px",
          padding: "12px",
        },
        duration: 3000,
      });
      setLastToastMessage(state.message);
      if (isSuccess) {
        update({
          ...session,
          user: {
            ...session?.user,
            role: isAdmin ? UserRole.ADMIN : UserRole.USER,
            image: selectedImage,
          },
        });
      }
    }
  }, [
    pending,
    state.message,
    state.status,
    session,
    update,
    isAdmin,
    selectedImage,
    lastToastMessage,
  ]);

  useEffect(() => {
    setSelectedImage(user.image ?? "");
  }, [user.image]);

  useEffect(() => {
    if (typeof window !== "undefined" && user.email) {
      (window as any).currentUserEmail = user.email;
    }
  }, [user.email]);

  // Submit handler with instant toast on click
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const savingMessage = "Saving...";
      if (savingMessage !== lastToastMessage) {
        setLastToastMessage(savingMessage);
      }
      startTransition(() => {
        action(new FormData(e.currentTarget));
      });
    },
    [action, lastToastMessage]
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-10 p-6 bg-black shadow-lg rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* User Image Section */}
      <motion.div
        className="group relative w-[200px] h-[200px] overflow-hidden rounded-full mx-auto border-2 border-indigo-700"
        whileHover={{ scale: 1.05 }}
      >
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={user.name ?? "User Avatar"}
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        ) : (
          <Image
            src="https://i.postimg.cc/kg2xytVs/610e8961bbb935274c005c6106a78a38.jpg"
            alt="Default Cat Avatar"
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        )}
        <div
          className={clsx(
            "absolute top-0 left-0 w-full h-full flex items-center justify-center rounded-full transition-opacity duration-200",
            selectedImage &&
              "group-hover:opacity-100 opacity-0 transition-opacity duration-200"
          )}
        >
          <UploadImage
            setSelectedImage={setSelectedImage}
            userName={user.name ?? ""}
          />
        </div>
      </motion.div>

      {/* Form Fields Section */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Auto-save Name Field */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-indigo-300 mb-2"
          >
            Full Name
            <span className="text-xs text-muted-foreground ml-2">
              (Auto-saves after 1 second)
            </span>
          </label>
          <div className="relative">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={clsx(
                "w-full p-3 rounded-lg bg-slate-900/50 border transition-all duration-200",
                "text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-blue-400",
                nameStatus === "saving" && "border-yellow-500/50",
                nameStatus === "saved" && "border-green-500/50",
                nameStatus === "error" && "border-red-500/50",
                nameStatus === "idle" && "border-slate-700"
              )}
              disabled={isNamePending}
            />

            {/* Status indicator */}
            <AnimatePresence mode="wait">
              {nameStatus === "saving" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-sm text-yellow-500"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </motion.div>
              )}

              {nameStatus === "saved" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-sm text-green-500"
                >
                  <Check className="w-4 h-4" />
                  <span>Saved</span>
                </motion.div>
              )}

              {nameStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-sm text-red-500"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Error</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Helper text */}
          <p className="text-xs text-muted-foreground mt-1">
            {name.trim().length < 2 && name.trim().length > 0
              ? "Name must be at least 2 characters"
              : "Changes are saved automatically"}
          </p>
        </div>

        {/* Email Address (read-only, locked) */}
        <div className="mb-6 group relative">
          <label
            htmlFor="email"
            className="flex text-sm font-medium text-indigo-300 mb-2 items-center gap-1"
          >
            Email Address
            <Lock className="w-4 h-4 text-slate-400" aria-label="Locked" />
          </label>
          <div className="relative">
            <Input
              id="email"
              value={user.email}
              readOnly
              disabled
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 cursor-not-allowed opacity-80 focus:ring-0 focus:border-slate-700"
              aria-label="Email address (read only)"
              tabIndex={-1}
            />
            {/* Tooltip */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Email address cannot be changed
            </span>
          </div>
        </div>

        {/* Other form fields */}
        {getFormFields()
          .filter(
            (field: IFormField) =>
              field.name !== "name" && field.name !== "email"
          )
          .map((field: IFormField, index: number) => {
            const fieldValue =
              state?.formData?.get(field.name) ?? formData().get(field.name);
            return (
              <motion.div
                key={`field-${field.name || "unknown"}-${index}`}
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FormFields
                  {...field}
                  type={field.type as InputTypes}
                  defaultValue={fieldValue as string}
                  error={state?.error?.[field.name]?.join(", ")}
                  readonly={field.type === InputTypes.EMAIL}
                  disabled={pending}
                  pattern={
                    field.type === InputTypes.EMAIL
                      ? "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                      : "^.{2,}$"
                  }
                  ariaLabel={`${field.name} input field`}
                />
              </motion.div>
            );
          })}

        {/* Admin Checkbox */}
        {session?.user.role === UserRole.ADMIN && (
          <motion.div
            className="flex items-center gap-2 my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Checkbox
              id="admin"
              name="admin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
              className={clsx(
                "w-5 h-5 border-2 rounded-md transition-all",
                isAdmin
                  ? "bg-indigo-700 border-indigo-700"
                  : "bg-black border-black"
              )}
            />
            <label
              htmlFor="admin"
              className="text-indigo-700 font-medium cursor-pointer"
            >
              Admin
            </label>
          </motion.div>
        )}

        {/* Save Button */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            type="submit"
            disabled={pending}
            className={clsx(
              "w-full bg-indigo-700 hover:bg-indigo-700 text-black font-bold py-2 px-4 rounded-lg transition-all",
              pending &&
                "opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
            )}
          >
            {pending ? (
              <>
                <Loader className="w-5 h-5" />
                <span>Saving...</span>
              </>
            ) : (
              "Save"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
}

export default EditUserForm;

// Image Upload Component
const UploadImage = ({
  setSelectedImage,
  userName,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      // 1. رفع الصورة إلى API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pathName", "profile-images");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
      // 2. تحديث صورة المستخدم في قاعدة البيانات
      // استدعاء action لتحديث صورة المستخدم
      if (typeof window !== "undefined") {
        const updateProfileImage = (window as any).updateProfileImage;
        if (typeof updateProfileImage === "function") {
          await updateProfileImage(data.url, userName);
        }
      }
      // 3. تحديث الصورة في الواجهة
      setSelectedImage(data.url);
      toast.success("Image uploaded and updated successfully");
    } catch (err: any) {
      setError(err.message || "Image upload failed");
      toast.error(err.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
        disabled={isUploading}
      />
      <label
        htmlFor="image-upload"
        className="flex justify-center items-center w-full h-full cursor-pointer ml-1 rounded-full hover:bg-indigo-700/700 transition-all"
      >
        {isUploading ? (
          <Loader2 className="w-10 h-10 text-indigo-700 animate-spin" />
        ) : (
          <CameraIcon className="w-10 h-10 text-indigo-700" />
        )}
      </label>
      {error && <span className="text-red-500 text-xs mt-2">{error}</span>}
    </div>
  );
};
