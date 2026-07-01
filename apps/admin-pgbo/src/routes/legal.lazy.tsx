import { useSEO } from "@repo/hooks/useSEO";
import { useAppNavigate as useNavigate } from "@repo/lib/router-wrappers";
import { LegalPageContent, seoTitles } from "@repo/ui/legal/LegalContent";
import { createLazyFileRoute, useSearch } from "@tanstack/react-router";
import type { LegalSearch } from "./legal";

export const Route = createLazyFileRoute("/legal")({
  component: LegalPage,
});

function LegalPage() {
  const search = useSearch({ strict: false });
  const { tab } = (search as unknown as LegalSearch) || {};
  const navigate = useNavigate();
  const activeTab = tab || "terms";

  useSEO({
    title: seoTitles[activeTab] || seoTitles.terms,
    description:
      "Informasi lengkap mengenai syarat, ketentuan, dan kebijakan layanan Public Gold Official.",
  });

  return (
    <LegalPageContent
      activeTab={activeTab}
      onTabChange={(tabId) =>
        navigate({ to: "/legal", search: { tab: tabId }, replace: true })
      }
    />
  );
}
