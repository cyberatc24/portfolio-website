import { forwardRef, type ReactNode, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  as?: "a";
  strength?: number;
  children: ReactNode;
};
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  as: "button";
  strength?: number;
  children: ReactNode;
};
type Props = AnchorProps | ButtonProps;

export const MagneticButton = forwardRef<HTMLElement, Props>(function MagneticButton(
  { strength = 0.35, children, ...rest },
  _ref
) {
  const magneticRef = useMagnetic<HTMLElement>(strength);
  const Tag = (rest.as ?? "a") as "a" | "button";
  // remove `as` from spread
  const { as: _as, ...domProps } = rest as { as?: string } & Record<string, unknown>;
  return (
    <Tag
      ref={magneticRef as unknown as React.Ref<HTMLAnchorElement & HTMLButtonElement>}
      {...(domProps as Record<string, unknown>)}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "inherit" }}>{children}</span>
    </Tag>
  );
});
