import type { Option } from "../types";

// Normalizing the data for Select option
export const getSelectedOptions = (
  values: readonly string[],
  options: readonly Option[],
): Option[] => {
  return values.map(
    (value) =>
      options.find((option) => option.value === value) ?? {
        value,
        label: value,
      },
  );
};

export const getFieldDesc = (
  id: string,
  hint: unknown,
  error: unknown,
): string | undefined => {
  return (
    [hint ? id + "-hint" : "", error ? id + "-error" : ""]
      .filter(Boolean)
      .join(" ") || undefined
  );
};
