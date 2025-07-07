"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductTech } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export enum ItemOptionsKeys {
  ProductTechS = "ProductTechS",
}

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

interface ItemOptionsProps {
  state: Partial<ProductTech>[];
  setState: React.Dispatch<React.SetStateAction<Partial<ProductTech>[]>>;
  optionKey: ItemOptionsKeys;
  className?: string;
  placeholder?: string;
  validate?: (item: Partial<ProductTech>) => string | null;
}

function ItemOptions({
  state,
  setState,
  optionKey,
  className,
  placeholder = "Enter technology (e.g., React, TypeScript)",
  validate = () => null,
}: ItemOptionsProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleOptions = useCallback(() => {
    const addOption = async () => {
      setIsAdding(true);
      try {
        if (state.length > 0) {
          const lastItem = state[state.length - 1];
          const error = validate(lastItem);
          if (error) {
            toast.error(error, {
              icon: <Trash2 className="w-5 h-5 text-red-400" />,
              style: {
                backgroundColor: "#4E1313",
                color: "#FCA5A5",
                border: "1px solid #FCA5A5",
                borderRadius: "10px",
                padding: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              },
            });
            return;
          }
        }
        setState((prev) => [...prev, { name: "" } as Partial<ProductTech>]);
        toast.success("Technology added", {
          icon: <Plus className="w-5 h-5 text-green-400" />,
          style: {
            backgroundColor: "#1A3C34",
            color: "#6EE7B7",
            border: "1px solid #6EE7B7",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        });
      } catch (error) {
        toast.error("Failed to add technology", {
          icon: <Trash2 className="w-5 h-5 text-red-400" />,
          style: {
            backgroundColor: "#4E1313",
            color: "#FCA5A5",
            border: "1px solid #FCA5A5",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        });
      } finally {
        setIsAdding(false);
      }
    };

    const onChange = (index: number, updatedItem: Partial<ProductTech>) => {
      setState((prev) => {
        const newItems = [...prev];
        newItems[index] = updatedItem;
        return newItems;
      });
    };

    const removeOption = (index: number) => {
      setState((prev) => prev.filter((_, i) => i !== index));
      toast.success("Technology removed", {
        icon: <Trash2 className="w-5 h-5 text-green-400" />,
        style: {
          backgroundColor: "#1A3C34",
          color: "#6EE7B7",
          border: "1px solid #6EE7B7",
          borderRadius: "10px",
          padding: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      });
    };

    return { addOption, onChange, removeOption };
  }, [setState, state, validate]);

  const { addOption, onChange, removeOption } = handleOptions();

  return (
    <div className={clsx("space-y-6", className)}>
      <AnimatePresence>
        {state.length > 0 && (
          <motion.ul
            className="space-y-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {state.map((item, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className={clsx(
                  "flex items-end gap-4 p-4 rounded-xl shadow-sm",
                  "bg-background border border-border",
                  "hover:shadow-md transition-all duration-300"
                )}
                role="listitem"
                aria-label={`Technology option ${index + 1}`}
              >
                <div className="flex-1 space-y-2">
                  <Label
                    className="text-sm font-medium text-foreground"
                    htmlFor={`${optionKey}-${index}-name`}
                  >
                    Technology
                  </Label>
                  <Input
                    id={`${optionKey}-${index}-name`}
                    type="text"
                    placeholder={placeholder}
                    value={item.name ?? ""}
                    onChange={(e) =>
                      onChange(index, { ...item, name: e.target.value })
                    }
                    className={clsx(
                      "w-full p-3 rounded-md bg-background text-foreground border border-input",
                      "focus:ring-2 focus:ring-primary focus:border-primary",
                      "placeholder-muted-foreground"
                    )}
                    required
                    aria-required="true"
                  />
                </div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className={clsx(
                      "flex-shrink-0 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive",
                      "focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-background"
                    )}
                    aria-label={`Remove technology option ${index + 1}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            type="button"
            variant="outline"
            className={clsx(
              "w-full py-3 rounded-xl shadow-sm",
              "bg-gradient-to-r from-primary to-secondary text-primary-foreground border border-primary/50",
              "hover:bg-primary/80 hover:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              "flex items-center justify-center gap-2",
              isAdding && "opacity-50 cursor-not-allowed"
            )}
            onClick={addOption}
            disabled={isAdding}
            aria-label="Add new technology option"
            aria-disabled={isAdding ? "true" : "false"}
          >
            <Plus className="w-5 h-5" />
            <span>Add Technology</span>
            {isAdding && (
              <svg
                className="animate-spin h-5 w-5 ml-2 text-primary-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ItemOptions;