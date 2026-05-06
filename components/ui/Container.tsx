import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export default function Container({
  className = "",
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={`mx-auto max-w-container px-8 max-[640px]:px-5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
