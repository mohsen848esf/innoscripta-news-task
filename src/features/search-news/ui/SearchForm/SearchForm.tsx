import { Controller } from "react-hook-form";
import { MultiSelect } from "@/shared/ui/MultiSelect/MultiSelect";
import { TextInput } from "@/shared/ui/TextInput/TextInput";
import { SelectInput } from "@/shared/ui/SelectInput/SelectInput";
import { Button } from "@/shared/ui/Button/Button";
import { RetryBanner } from "@/shared/ui/RetryBanner/RetryBanner";
import { getSelectedOptions } from "@/shared/lib/forms";
import { useFilterForm } from "../../model/useFilterForm";
import { useSourcesList } from "../../model/useSourcesList";
import {
  categories,
  providers,
  getSortOptions,
  isHeadlinesMode,
} from "@/entities/news/lib/options";
import type { Search } from "@/entities/news/model/types";
import { AuthorField } from "../AuthorField/AuthorField";
import styles from "./SearchForm.module.css";

interface SearchFormProps {
  initial: Search;
  onSearch: (search: Search) => void;
}

export const SearchForm = ({ initial, onSearch }: SearchFormProps) => {
  const { form, values, change, submit, clear } = useFilterForm(
    initial,
    onSearch,
  );

  const sources = useSourcesList(values.provider === "newsapi");
  const categoryOptions = categories[values.provider] ?? [];
  const sorts = getSortOptions(values);

  return (
    <form
      className={styles.filters}
      noValidate
      onSubmit={(event) => void submit(event)}
    >
      <SelectInput
        id="provider"
        label="Data source"
        options={providers}
        value={values.provider}
        {...form.register("provider")}
        onChange={(event) =>
          change({ provider: event.target.value as Search["provider"] })
        }
      />
      <TextInput
        id="keyword"
        label="Search"
        placeholder="Search news…"
        {...form.register("keyword")}
      />
      <TextInput
        id="from"
        label="From"
        type="date"
        {...form.register("from")}
        onChange={(event) => change({ from: event.target.value })}
      />
      <TextInput
        id="to"
        label="To"
        type="date"
        {...form.register("to")}
        onChange={(event) => change({ to: event.target.value })}
      />
      <Controller<Search, "categories">
        name="categories"
        control={form.control}
        render={({ field }) => (
          <MultiSelect
            id="categories"
            label="Categories"
            single={values.provider === "newsapi"}
            options={categoryOptions}
            value={getSelectedOptions(field.value, categoryOptions)}
            onChange={(options) =>
              change({ categories: options.map((option) => option.value) })
            }
          />
        )}
      />
      {values.provider === "newsapi" ? (
        <div>
          <Controller<Search, "sources">
            name="sources"
            control={form.control}
            render={({ field }) => (
              <MultiSelect
                id="sources"
                label="Sources"
                max={20}
                options={sources.data ?? []}
                value={getSelectedOptions(field.value, sources.data ?? [])}
                onChange={(options) =>
                  change({ sources: options.map((option) => option.value) })
                }
                loading={sources.isFetching}
              />
            )}
          />
          {sources.isError && (
            <RetryBanner
              error={sources.error}
              label="Retry sources"
              retrying={sources.isFetching}
              onRetry={() => void sources.refetch()}
            />
          )}
        </div>
      ) : (
        <TextInput
          id="sources"
          label="Sources"
          value={
            providers.find((provider) => provider.value === values.provider)
              ?.label ?? ""
          }
          disabled
          readOnly
        />
      )}
      <AuthorField
        key={values.provider}
        provider={values.provider}
        control={form.control}
      />
      <SelectInput
        id="sort"
        label="Sort by"
        options={sorts}
        {...form.register("sort")}
        disabled={isHeadlinesMode(values)}
        value={
          sorts.some((option) => option.value === values.sort)
            ? values.sort
            : (sorts[0]?.value ?? "")
        }
      />
      {values.provider === "newsapi" && (
        <p className={styles.help}>
          NewsAPI categories cannot be combined with sources(publishers) or
          dates.
        </p>
      )}
      <div className={styles.actions}>
        <Button type="submit" variant="primary">
          Search
        </Button>
        <Button onClick={clear}>Clear filters</Button>
      </div>
      {form.formState.errors.root?.filters?.message && (
        <p role="alert" className={styles.error}>
          {form.formState.errors.root.filters.message}
        </p>
      )}
    </form>
  );
};
