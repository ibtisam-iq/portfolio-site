import { type ReactNode, type CSSProperties } from "react";
import { useInView } from "../hooks/useInView";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  delay?: number;
  id?: string;
}

const hidden: CSSProperties = {
  opacity: 0,
  transform: "translateY(24px)",
  transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)",
};

const shown: CSSProperties = {
  opacity: 1,
  transform: "translateY(0)",
  transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)",
};

export function Reveal({ children, className, as: Tag = "section", delay = 0, id }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const style = inView
    ? { ...shown, transitionDelay: `${delay}ms` }
    : { ...hidden, transitionDelay: `${delay}ms` };

  return (
    <Tag ref={ref as never} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
}

interface RevealChildProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  visible?: boolean;
}

export function RevealChild({ children, className, delay = 0, visible = false }: RevealChildProps) {
  const style: CSSProperties = visible
    ? { opacity: 1, transform: "translateY(0)", transition: "opacity 0.6s ease, transform 0.6s ease", transitionDelay: `${delay}ms` }
    : { opacity: 0, transform: "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease", transitionDelay: `${delay}ms` };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
