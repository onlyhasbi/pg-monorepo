import {
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Topbar from "@repo/ui/layout/topbar";
import { ToastProvider } from "@repo/ui/toast";

import NotFound from "@repo/ui/not_found";
import { ScrollUnlocker } from "@repo/ui/ScrollUnlocker";
import { agentQueryOptions } from "@repo/lib/queryOptions";
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
import { rootHeadConfig } from "@repo/constant/seo";
import { CriticalCss } from "@repo/ui/CriticalCss";
import { getCloudinaryUrl } from "@repo/lib/images";

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
  head: () => rootHeadConfig(appCss, getCloudinaryUrl),
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
  const location = useLocation();
  const matches = useMatches();
  const routerState = useRouterState();
  const navigate = useNavigate();
  const router = useRouter();

  const lang = i18n.language || "id";

  const dashboardPaths = ["/register", "/petunjuk", "/legal"];
  const isStandalone =
    dashboardPaths.some((p) => location.pathname.startsWith(p)) ||
    location.pathname === "/";
  const isNotFound =
    (matches.length === 1 && location.pathname !== "/") ||
    matches.some((m) => m.status === "notFound") ||
    routerState.statusCode === 404;
  const hideTopbar = isStandalone || isNotFound;

  const pgboMatch = matches.find((m) => m.routeId === "/$pgcode");
  const pgcode = (pgboMatch?.params as any)?.pgcode;
  const pgbo = pgcode
    ? queryClient.getQueryData(agentQueryOptions(pgcode).queryKey)
    : null;

  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument lang={lang}>
        <ToastProvider>
          <ScrollUnlocker />
          {!hideTopbar && (
            <Topbar
              pgbo={pgbo}
              onNavigateLogo={() => {
                navigate({ to: "/$pgcode", params: { pgcode: pgbo?.pageid || pgcode || "" } });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNavigateRegister={(type) => {
                navigate({ to: "/register", search: { type, ref: pgbo?.pageid } });
              }}
              onHoverRegister={() => {
                router.preloadRoute({ to: "/register", search: { type: "dewasa", ref: pgbo?.pageid } });
                router.preloadRoute({ to: "/register", search: { type: "anak", ref: pgbo?.pageid } });
              }}
            />
          )}
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
