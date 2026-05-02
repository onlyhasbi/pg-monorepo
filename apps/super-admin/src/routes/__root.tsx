import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ToastProvider } from "@repo/ui/toast";

import NotFound from "@repo/ui/not_found";
import { ScrollUnlocker } from "@repo/ui/ScrollUnlocker";

import i18n from "i18next";
import appCss from "@/styles.css?url";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

import { getAuthToken } from "@repo/lib/auth";

import { RootError } from "@repo/ui/root_error";
import { CriticalCss } from "@repo/ui/CriticalCss";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth?: { token: string | null; adminToken: string | null };
}>()({
  beforeLoad: async () => {
    // Determine auth status once at the root level.
    const token = await getAuthToken(false);
    const adminToken = await getAuthToken(true);

    return {
      auth: { token, adminToken },
    };
  },
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootError,
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Super Admin - Public Gold" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
    ],
  }),
});

function RootDocument({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  return (
    <html lang={lang}>
      <head>
        <CriticalCss />
        <HeadContent />
      </head>
      <body>
        <div id="app">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const lang = i18n.language || "id";

  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument lang={lang}>
        <ToastProvider>
          <ScrollUnlocker />
          <main>
            <Outlet />
          </main>
          <React.Suspense>
            <TanStackRouterDevtools position="bottom-right" />
          </React.Suspense>
        </ToastProvider>
      </RootDocument>
    </QueryClientProvider>
  );
}
