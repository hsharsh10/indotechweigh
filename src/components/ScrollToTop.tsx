import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Safest way to scroll to top instantly without any browser compatibility issues
  }, [pathname]);

  return null;
}
