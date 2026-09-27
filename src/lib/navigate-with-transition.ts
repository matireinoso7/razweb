"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function navigateWithTransition(router: AppRouterInstance, href: string) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(
      () => {
        router.push(href);
      }
    );
    return;
  }
  router.push(href);
}
