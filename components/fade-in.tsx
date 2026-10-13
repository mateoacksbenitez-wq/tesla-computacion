import { Children, cloneElement, isValidElement, type CSSProperties, type ReactNode } from "react";
import { cn } from "cn";

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-fade-in-up", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/** Contenedor que hace aparecer a sus hijos directos (StaggerItem) en cascada, vía animation-delay CSS. */
export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const items = Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, i) =>
        isValidElement<{ style?: CSSProperties }>(child)
          ? cloneElement(child, {
              key: child.key ?? i,
              style: { ...child.props.style, animationDelay: `${i * stagger}s` },
            })
          : child
      )}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("animate-fade-in-up", className)} style={style}>
      {children}
    </div>
  );
}
