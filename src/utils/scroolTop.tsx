import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScroolTop: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    const timer: any = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 30);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
};
