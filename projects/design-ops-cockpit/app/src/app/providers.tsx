"use client";

import { StoreProvider } from "../lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
