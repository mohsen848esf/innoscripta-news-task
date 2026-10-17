import { useController, type Control } from "react-hook-form";
import { MultiSelect } from "@/shared/ui/MultiSelect/MultiSelect";
import { TextInput } from "@/shared/ui/TextInput/TextInput";
import { RetryBanner } from "@/shared/ui/RetryBanner/RetryBanner";
import { useAuthorSearch } from "../../model/useAuthorSearch";
import type { Provider, Search } from "@/entities/news/model/types";

interface AuthorFieldProps {
  provider: Provider;
  control: Control<Search>;
}

export const AuthorField = ({ provider, control }: AuthorFieldProps) => {
  const { field } = useController({ name: "authors", control });
  const authors = useAuthorSearch(provider === "guardian");

  if (provider !== "guardian")
    return (
      <TextInput
        id="authors"
        label="Authors"
        value="Available with The Guardian"
        disabled
        readOnly
      />
    );

  return (
    <div>
      <MultiSelect
        id="authors"
        label="Authors"
        hint="Search Guardian contributors by name."
        options={authors.options}
        value={field.value}
        onChange={field.onChange}
        onSearch={authors.search}
        loading={authors.isSearching}
      />
      {authors.isError && (
        <RetryBanner
          error={authors.error}
          label="Retry authors"
          retrying={authors.isFetching}
          onRetry={() => void authors.refetch()}
        />
      )}
    </div>
  );
};
