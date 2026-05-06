import type { HTMLAttributes } from "react";
import Container from "./Container";

type SectionProps = HTMLAttributes<HTMLElement>;

export default function Section({
  className = "",
  children,
  ...rest
}: SectionProps) {
  return (
    <section className={`relative py-[120px] ${className}`} {...rest}>
      <Container>{children}</Container>
    </section>
  );
}
