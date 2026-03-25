import { type ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="min-h-0">{children}</div>;
}
