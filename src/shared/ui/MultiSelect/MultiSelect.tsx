import { useState } from "react";
import Select, { type InputActionMeta } from "react-select";
import type { Option } from "@/shared/types";
import { useDebounce } from "@/shared/lib/useDebounce";
import { getFieldDesc } from "@/shared/lib/forms";
import { FormField, type FieldProps } from "../FormField/FormField";
import styles from "./MultiSelect.module.css";

interface MultiSelectProps extends FieldProps {
  options: readonly Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  loading?: boolean;
  disabled?: boolean;
  onSearch?: (value: string) => void;
  max?: number;
  single?: boolean;
}

export const MultiSelect = ({
  id,
  label,
  hint,
  error,
  className,
  options,
  value,
  onChange,
  loading = false,
  disabled = false,
  onSearch,
  max = Infinity,
  single = false,
}: MultiSelectProps) => {
  const [input, setInput] = useState("");
  const debounced = useDebounce(input);
  const choices = onSearch
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(debounced.toLowerCase()),
      );

  return (
    <FormField
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={className}
    >
      {single ? (
        <Select<Option>
          inputId={id}
          instanceId={id}
          className={styles.select ?? ""}
          classNamePrefix="filter"
          aria-describedby={getFieldDesc(id, hint, error)}
          aria-invalid={!!error}
          placeholder="Select category"
          options={options}
          value={value[0] ?? null}
          isClearable
          isDisabled={disabled}
          onChange={(option: Option | null) => onChange(option ? [option] : [])}
        />
      ) : (
        <Select<Option, true>
          inputId={id}
          instanceId={id}
          className={styles.select ?? ""}
          classNamePrefix="filter"
          aria-describedby={getFieldDesc(id, hint, error)}
          aria-invalid={!!error}
          placeholder={onSearch ? "Search authors…" : "Select options"}
          isMulti
          options={choices}
          value={value}
          onChange={(next) => onChange([...(next ?? [])])}
          isLoading={loading}
          isDisabled={disabled}
          closeMenuOnSelect={false}
          filterOption={null}
          inputValue={input}
          onInputChange={(text: string, action: InputActionMeta) => {
            if (action.action !== "input-change") return;
            setInput(text.slice(0, 100));
            onSearch?.(text.slice(0, 100));
          }}
          isOptionDisabled={() => value.length >= max}
          noOptionsMessage={() =>
            onSearch && input.trim().length < 2
              ? "Type at least 2 characters to find authors"
              : "No options"
          }
        />
      )}
    </FormField>
  );
};
