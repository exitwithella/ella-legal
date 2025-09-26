import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { ThemeAwareLogo } from "@/components/ThemeAwareLogo";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <ThemeAwareLogo alt="ELLA Logo" />
          ELLA Legal Center
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}
