export const checkHtml = (value: string | null | undefined): string => {
  if (!value) {
    return "";
  }

  const document = new DOMParser().parseFromString(value, "text/html");
  document.querySelectorAll("script,style").forEach((node) => node.remove());

  return (document.body.textContent ?? "").trim();
};

export const calcTotalPages = (
  total: number,
  maxResults = Number.MAX_SAFE_INTEGER,
): number => {
  return Math.ceil(Math.min(total, maxResults) / 10);
};
