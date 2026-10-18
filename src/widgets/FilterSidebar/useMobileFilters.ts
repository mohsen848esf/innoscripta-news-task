import { useEffect, useRef, useState } from "react";

export const useMobileFilters = () => {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 720px)").matches,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => {
      setMobile(media.matches);
      setOpen(false);
    };
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    element.close();
    if (!mobile) {
      element.show();
      if (
        document.activeElement instanceof HTMLElement &&
        element.contains(document.activeElement)
      ) {
        document.activeElement.blur();
      }
    } else if (open) {
      element.showModal();
    }
  }, [mobile, open]);

  const close = () => {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  };

  return { dialog, trigger, mobile, open, show: () => setOpen(true), close };
};
