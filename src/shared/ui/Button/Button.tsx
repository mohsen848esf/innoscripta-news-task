import type { ComponentPropsWithRef } from "react";
import styles from "./Button.module.css";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary" | "danger";
};

export const Button = ({
  variant = "secondary",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className={[styles.button, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
    />
  );
};
