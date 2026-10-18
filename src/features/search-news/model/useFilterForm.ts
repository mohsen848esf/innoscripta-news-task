import type { BaseSyntheticEvent } from "react";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { updateFilterField, formatSearchForSubmit } from "@/entities/news/lib/search-params";
import { initialSearchState } from "@/entities/news/lib/options";
import type { Option, Search } from "@/entities/news/model/types";

export interface FilterFormHook {
  form: UseFormReturn<Search>;
  values: Search;
  change: (patch: Partial<Search>) => void;
  submit: (event?: BaseSyntheticEvent) => Promise<void>;
  clear: () => void;
}

export const useFilterForm = (
  initial: Search,
  onSearch: (search: Search) => void,
): FilterFormHook => {
  const form = useForm<Search>({ defaultValues: initial });

  const [provider, keyword, from, to, categories, sources, authors, sort] =
    useWatch({
      control: form.control,
      name: [
        "provider",
        "keyword",
        "from",
        "to",
        "categories",
        "sources",
        "authors",
        "sort",
      ],
    }) as [
      Search["provider"],
      string,
      string,
      string,
      string[],
      string[],
      Option[],
      Search["sort"],
    ];

  const values: Search = {
    provider,
    keyword,
    from,
    to,
    categories,
    sources,
    authors,
    sort,
  };

  const change = (patch: Partial<Search>) => {
    const next = updateFilterField(form.getValues(), patch);
    for (const name of [
      "provider",
      "keyword",
      "from",
      "to",
      "categories",
      "sources",
      "authors",
      "sort",
    ] as const) {
      if (form.getValues(name) !== next[name]) {
        form.setValue(name, next[name], { shouldDirty: true });
      }
    }
    form.clearErrors("root");
  };

  const submit = form.handleSubmit((draft: Search) => {
    const result = formatSearchForSubmit(draft);
    if (result.errors.length) {
      form.setError("root.filters", { message: result.errors.join(" ") });
      return;
    }
    onSearch(result.search);
  });

  const clear = () => {
    const defaultSort = values.provider === "newsapi" ? "default" : "newest";
    const cleared: Search = {
      ...initialSearchState,
      provider: values.provider,
      sort: defaultSort,
    };
    form.reset(cleared);
    onSearch(cleared);
  };

  return { form, values, change, submit, clear };
};
