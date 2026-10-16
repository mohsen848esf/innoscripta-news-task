import type { FocusEvent } from "react";
import Select, { type SingleValue } from "react-select";
import type { Option } from "@/shared/types";
import { getFieldDesc } from "@/shared/lib/forms";
import { FormField, type FieldProps } from "../FormField/FormField";
import styles from "./SelectInput.module.css";

export interface SelectInputProps extends FieldProps {
  options: readonly Option[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  disabled?: boolean | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  onChange?:
    | ((event: { target: { value: string; name?: string | undefined } }) => void)
    | undefined;
  onBlur?: ((...args: any[]) => unknown) | undefined;
}

export const SelectInput = ({
  id,
  label,
  hint,
  error,
  className,
  options,
  value,
  defaultValue,
  disabled = false,
  name,
  placeholder = "Select...",
  onChange,
  onBlur,
}: SelectInputProps) => {
  const currentOption =
    options.find((option) => option.value === value) ??
    (defaultValue
      ? options.find((option) => option.value === defaultValue)
      : null) ??
    options[0] ??
    null;

  const desc = getFieldDesc(id, hint, error);

  return (
    <FormField
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={className}
    >
      <Select<Option>
        inputId={id}
        instanceId={id}
        className={styles.select ?? ""}
        classNamePrefix="filter"
        aria-invalid={!!error}
        placeholder={placeholder}
        options={options as Option[]}
        value={currentOption}
        isDisabled={disabled}
        {...(name ? { name } : {})}
        {...(desc ? { "aria-describedby": desc } : {})}
        {...(onBlur
          ? {
              onBlur: (event: FocusEvent<HTMLInputElement>) => onBlur(event),
            }
          : {})}
        onChange={(selected: SingleValue<Option>) => {
          onChange?.({
            target: {
              value: selected?.value ?? "",
              name,
            },
          });
        }}
      />
    </FormField>
  );
};
