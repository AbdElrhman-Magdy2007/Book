// import { IFormField } from "@/app/types/app";
// import { Checkbox as ShadcnCheckbox } from "../ui/checkbox";
// import clsx from "clsx";
// import { Label } from "../ui/label";

// interface Props {
//   onCheckedChange?: (checked: boolean) => void; // تغيير الحالة بدلاً من onClick
//   checked: boolean;
//   label?: IFormField["label"]; // اختياري لأنه قد لا يُستخدم دائمًا
//   name: IFormField["name"];
//   disabled?: IFormField["disabled"]; // إضافة دعم للتعطيل
//   required?: boolean; // إضافة دعم للحقل المطلوب
//   onClick?: () => void;
//   error?: string;
//   autoFocus?: boolean;
// }

// /**
//  * مكون Checkbox مخصص باستخدام shadcn/ui مع تصميم محسّن ودعم للـ label والتفاعل.
//  * @param {Props} props - الخصائص الممررة للمكون
//  */
// const Checkbox = ({
//   label,
//   name,
//   checked,
//   onCheckedChange,
//   disabled = false,
//   required = false,
//   onClick,
// }: Props) => {
//   return (
//     <div
//       className={clsx(
//         "flex items-center gap-2",
//         disabled ? "opacity-50 cursor-not-allowed" : "text-accent"
//       )}
//     >
//       <ShadcnCheckbox
//         type="button"
//         id={name}
//         name={name}
//         checked={checked}
//         onCheckedChange={onCheckedChange} // استخدام onCheckedChange بدلاً من onClick
//         disabled={disabled}
//         required={required}
//         onClick={onClick}
//         className={clsx(
//           "border-accent",
//           checked && "bg-accent text-black",
//           disabled && "border-indigo-700 bg-black text-indigo-700"
//         )}
//       />
//       {label && (
//         <Label
//           htmlFor={name}
//           className={clsx(
//             "text-sm font-normal",
//             disabled ? "text-indigo-700" : "text-accent"
//           )}
//         >
//           {label}
//         </Label>
//       )}
//     </div>
//   );
// };

// export default Checkbox;
import { IFormField } from "@/app/types/app";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import clsx from "clsx";
import { Label } from "@/components/ui/label";

interface Props {
  onCheckedChange?: (checked: boolean) => void; // تغيير الحالة بدلاً من onClick
  checked: boolean;
  label?: IFormField["label"]; // اختياري لأنه قد لا يُستخدم دائمًا
  name: IFormField["name"];
  disabled?: IFormField["disabled"]; // إضافة دعم للتعطيل
  required?: boolean; // إضافة دعم للحقل المطلوب
  onClick?: () => void;
  error?: string;
  onValidationChange?: (isValid: boolean) => void;
}

/**
 * مكون Checkbox مخصص باستخدام shadcn/ui مع تصميم محسّن ودعم للـ label والتفاعل.
 * @param {Props} props - الخصائص الممررة للمكون
 */
const Checkbox = ({
  label,
  name,
  checked,
  onCheckedChange,
  disabled = false,
  required = false,
  onClick,
  error,
  onValidationChange,
}: Props) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-2",
        disabled ? "opacity-50 cursor-not-allowed" : "text-accent"
      )}
    >
      <ShadcnCheckbox
        type="button"
        id={name}
        name={name}
        checked={checked}
        onCheckedChange={(newChecked: boolean) => {
          onCheckedChange?.(newChecked);
          onValidationChange?.(newChecked);
        }}
        disabled={disabled}
        required={required}
        onClick={onClick}
        className={clsx(
          "border-accent",
          checked && "bg-accent text-black",
          disabled && "border-indigo-700 bg-black text-indigo-700",
          error && "border-red-500"
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {label && (
        <Label
          htmlFor={name}
          className={clsx(
            "text-sm font-normal",
            disabled ? "text-indigo-700" : "text-accent"
          )}
        >
          {label}
        </Label>
      )}
      {error && (
        <p
          id={`${name}-error`}
          className="text-sm font-medium text-red-600 mt-2"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
