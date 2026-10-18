import { useState } from "react";
import Select, {
  components,
  type InputActionMeta,
  type OptionProps,
  type MultiValueProps,
  type ActionMeta,
  type MultiValue as ReactSelectMultiValue,
} from "react-select";
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

const ALL_VALUE = "__select_all__";

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
  const rawChoices = onSearch
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(debounced.toLowerCase()),
      );

  const maxSelectable = Math.min(rawChoices.length, max);
  const isAllSelected =
    maxSelectable > 0 &&
    (max < rawChoices.length
      ? value.length >= maxSelectable
      : rawChoices.every((opt) => value.some((v) => v.value === opt.value)));

  const selectAllLabel =
    id === "sources"
      ? max < rawChoices.length
        ? `All sources (first ${max})`
        : "All sources"
      : "Select all";

  const allOption: Option = {
    value: ALL_VALUE,
    label: selectAllLabel,
  };

  const choices: Option[] =
    rawChoices.length > 1 ? [allOption, ...rawChoices] : [...rawChoices];

  const CustomOption = (props: OptionProps<Option, true>) => {
    const isSelectAll = props.data.value === ALL_VALUE;
    const isChecked = isSelectAll
      ? isAllSelected
      : value.some((v) => v.value === props.data.value);

    return (
      <components.Option {...props} isSelected={isChecked}>
        <div className={styles.optionRow}>
          <input
            type="checkbox"
            checked={isChecked}
            readOnly
            className={styles.checkbox}
            aria-hidden="true"
          />
          <span className={styles.optionLabel}>{props.label}</span>
        </div>
      </components.Option>
    );
  };

  const CustomMultiValue = (props: MultiValueProps<Option, true>) => {
    const selectedCount = value.length;
    if (selectedCount <= 1) {
      return <components.MultiValue {...props} />;
    }

    if (props.index === 0) {
      return (
        <components.MultiValue
          {...props}
          removeProps={{
            ...props.removeProps,
            onClick: (e) => {
              e.stopPropagation();
              onChange([]);
            },
            title: "Clear all selections",
            "aria-label": "Clear all selections",
          }}
        >
          <span>{selectedCount} selected</span>
        </components.MultiValue>
      );
    }

    return null;
  };

  const handleMultiChange = (
    next: ReactSelectMultiValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => {
    if (
      actionMeta.action === "select-option" &&
      actionMeta.option?.value === ALL_VALUE
    ) {
      if (isAllSelected) {
        onChange([]);
      } else {
        onChange(rawChoices.slice(0, max));
      }
      return;
    }

    if (
      actionMeta.action === "deselect-option" &&
      actionMeta.option?.value === ALL_VALUE
    ) {
      onChange([]);
      return;
    }

    const cleanValues = (next ?? []).filter(
      (item) => item.value !== ALL_VALUE,
    );
    onChange([...cleanValues]);
  };

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
          isClearable
          hideSelectedOptions={false}
          options={choices}
          value={value}
          getOptionValue={(opt: Option) => opt.value}
          getOptionLabel={(opt: Option) => opt.label}
          onChange={handleMultiChange}
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
          isOptionDisabled={(option: Option) =>
            option.value !== ALL_VALUE &&
            !value.some((v) => v.value === option.value) &&
            value.length >= max
          }
          components={{
            Option: CustomOption,
            MultiValue: CustomMultiValue,
          }}
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

