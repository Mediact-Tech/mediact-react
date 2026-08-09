import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";

export type BreadcrumbItem = {
  label: React.ReactNode;
  /** Optional leading icon — typically used on the first/Home item. */
  icon?: React.ReactNode;
  href?: string;
  /** When provided, renders as <button> instead of <a>. */
  onClick?: () => void;
};

export type BreadcrumbProps = React.ComponentProps<"nav"> & {
  items: BreadcrumbItem[];
  /** Custom separator. Default `"/"` (forward slash). */
  separator?: React.ReactNode;
  /** Collapse middle items when more than this number. Default `0` (no collapse). */
  maxItems?: number;
  /** Component used to render `items[].href` links — e.g. next/link's `Link`.
   *  Must accept `href`, `className`, and `children`. Defaults to a plain `<a>`,
   *  which keeps this package framework-agnostic (no router import inside DS). */
  linkComponent?: React.ElementType;
};

function Breadcrumb({
  items,
  separator,
  maxItems = 0,
  linkComponent: LinkComponent = "a",
  className,
  ...props
}: BreadcrumbProps) {
  const sep = separator ?? (
    <span className="select-none text-text-tertiary" aria-hidden="true">
      /
    </span>
  );

  let visible: Array<BreadcrumbItem | "ellipsis"> = items;
  if (maxItems > 0 && items.length > maxItems) {
    visible = [items[0]!, "ellipsis", ...items.slice(-(maxItems - 1))];
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-body-md", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-3">
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1;
          if (item === "ellipsis") {
            return (
              <li key={`ellipsis-${i}`} className="flex items-center gap-3">
                <MoreHorizontal className="size-4 text-text-tertiary" />
                {!isLast && sep}
              </li>
            );
          }
          const itemBaseClass =
            "inline-flex items-center gap-2 leading-none [&_svg]:size-5";
          return (
            <li key={i} className="flex items-center gap-3 leading-none">
              {isLast ? (
                <span
                  className={cn(
                    itemBaseClass,
                    "font-semibold text-brand",
                  )}
                  aria-current="page"
                >
                  {item.icon}
                  {item.label}
                </span>
              ) : item.href ? (
                <LinkComponent
                  href={item.href}
                  className={cn(
                    itemBaseClass,
                    "text-text-tertiary transition-colors hover:text-brand",
                  )}
                >
                  {item.icon}
                  {item.label}
                </LinkComponent>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className={cn(
                    itemBaseClass,
                    "text-text-tertiary transition-colors hover:text-brand",
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ) : (
                <span className={cn(itemBaseClass, "text-text-tertiary")}>
                  {item.icon}
                  {item.label}
                </span>
              )}
              {!isLast && sep}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Low-level escape hatch — use `<BreadcrumbRoot>` + `<BreadcrumbLink>` for custom rendering. */
const BreadcrumbRoot = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    aria-label="Breadcrumb"
    className={cn("flex items-center text-body-md", className)}
    {...props}
  />
);

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & { asChild?: boolean }
>(function BreadcrumbLink({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      className={cn(
        "text-text-tertiary transition-colors hover:text-brand",
        className,
      )}
      {...props}
    />
  );
});

BreadcrumbLink.displayName = "BreadcrumbLink";

export { Breadcrumb, BreadcrumbRoot, BreadcrumbLink };
