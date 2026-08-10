import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const cardVariants = cva("flex flex-col bg-white", {
  variants: {
    variant: {
      elevated: "rounded-md border border-border-subtle shadow-sm",
      outlined: "rounded-md border border-border-default",
      flat: "rounded-md",
    },
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: { variant: "outlined", padding: "md" },
});

export type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, padding, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
});

const CardHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn("flex flex-col gap-1 pb-3", className)}
    {...props}
  />
);

const CardTitle = ({
  className,
  ...props
}: React.ComponentProps<"h3">) => (
  <h3
    /* 🔴 `text-text-heading` ไม่ใช่ `text-text-primary` ซึ่ง `theme.css` alias ไป
     * `--color-brand` ⇒ หัวการ์ดทุกใบเปลี่ยนสีตามแอป (Mediwork ได้มิ้นต์ 1.93:1) */
    className={cn("text-body-md font-semibold text-text-heading", className)}
    {...props}
  />
);

const CardDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => (
  <p className={cn("text-body-sm text-text-body", className)} {...props} />
);

const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex-1", className)} {...props} />
);

const CardFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn("flex items-center gap-2 pt-3", className)}
    {...props}
  />
);

Card.displayName = "Card";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
