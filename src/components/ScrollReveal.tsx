import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "zoom";
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  animation = "slide-up",
  duration = 800,
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  const animationClasses = {
    fade: "opacity-0 translate-y-0",
    "slide-up": "opacity-0 translate-y-12",
    "slide-down": "opacity-0 -translate-y-12",
    "slide-left": "opacity-0 translate-x-12",
    "slide-right": "opacity-0 -translate-x-12",
    zoom: "opacity-0 scale-95",
  };

  const visibleClasses = {
    fade: "opacity-100 translate-y-0",
    "slide-up": "opacity-100 translate-y-0",
    "slide-down": "opacity-100 translate-y-0",
    "slide-left": "opacity-100 translate-x-0",
    "slide-right": "opacity-100 translate-x-0",
    zoom: "opacity-100 scale-100",
  };

  const baseStyle = {
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // easeOutQuart/Expo
  };

  const activeClass = isVisible ? visibleClasses[animation] : animationClasses[animation];

  return (
    <div
      ref={ref}
      style={baseStyle}
      className={`transform transition-all ${activeClass} ${className}`}
    >
      {children}
    </div>
  );
}
