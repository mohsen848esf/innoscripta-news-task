import { getFieldDesc } from "@/shared/lib/forms";
import type { ComponentPropsWithRef } from "react";
import { FormField, type FieldProps } from "../FormField/FormField";
import styles from "../FormField/FormField.module.css";

type TextInputProps = FieldProps &
  Omit<ComponentPropsWithRef<"input">, "id" | "className">;

export const TextInput = ({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: TextInputProps) => {
  return (
    <FormField
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={className}
    >
      <input
        {...props}
        id={id}
        className={styles.control}
        aria-invalid={!!error}
        aria-describedby={getFieldDesc(id, hint, error)}
      />
    </FormField>
  );
};
