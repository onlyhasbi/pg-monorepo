import Topbar from "@repo/ui/layout/topbar";
import NotFound from "@repo/ui/not_found";
import { ScrollUnlocker } from "@repo/ui/ScrollUnlocker";
import { ToastProvider } from "@repo/ui/toast";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useLocation,
  useMatches,
  useRouterState,
} from "@tanstack/react-router";
import i18n from "i18next";
import React from "react";
import appCss from "@/styles.css?url";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/react-router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

import { rootHeadConfig } from "@repo/constant/seo";
import { getAuthToken } from "@repo/lib/auth";
import { CriticalCss } from "@repo/ui/CriticalCss";
import { RootError } from "@repo/ui/root_error";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth?: { token: string | null; adminToken: string | null };
}>()({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      lang: (search.lang as string) || undefined,
    };
  },
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
  head: (ctx) => rootHeadConfig(appCss, ctx.match.pathname),
});

function RootDocument({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  if (import.meta.env.TEST) {
    return <div id="test-root-doc">{children}</div>;
  }

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
  const location = useLocation();
  const matches = useMatches();
  const routerState = useRouterState();
  const { lang: langParam } = Route.useSearch();

  const lang = i18n.language || "id";

  React.useEffect(() => {
    if (langParam && i18n.language !== langParam) {
      i18n.changeLanguage(langParam);
    }
  }, [langParam]);

  const dashboardPaths = ["/register", "/petunjuk", "/legal"];
  const isStandalone =
    dashboardPaths.some((p) => location.pathname.startsWith(p)) ||
    location.pathname === "/";
  const isNotFound =
    ((matches?.length || 0) === 1 && location.pathname !== "/") ||
    matches?.some((m) => m.status === "notFound") ||
    routerState?.statusCode === 404;
  const hideTopbar = isStandalone || isNotFound;

  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument lang={lang}>
        <ToastProvider>
          <ScrollUnlocker />
          {!hideTopbar && <Topbar />}
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
