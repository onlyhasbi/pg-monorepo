import { api } from "@repo/lib/api";
import { useAppNavigate as useNavigate } from "@repo/lib/router-wrappers";
import { GuidePageContent } from "@repo/ui/guide/GuidePageContent";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useSearch } from "@tanstack/react-router";
import type { PetunjukSearch } from "./petunjuk";

export const Route = createLazyFileRoute("/petunjuk")({
  component: PetunjukPage,
});

function PetunjukPage() {
  const search = useSearch({ strict: false });
  const { ref } = (search as unknown as PetunjukSearch) || {};
  const navigate = useNavigate();
  const pageId = ref || null;

  const { data: agentData } = useQuery({
    queryKey: ["agent-petunjuk", pageId],
    queryFn: async () => {
      const res = await api.get<{ data: Record<string, unknown> }>(
        `/public/pgbo/${pageId}`,
      );
      return res.data.data;
    },
    enabled: !!pageId,
  });

  const handleBack = () => {
    navigate({
      to: "/register",
      search: { ref: pageId || undefined, lang: undefined },
    });
  };

  const handleComplete = () => {
    if (agentData?.link_group_whatsapp) {
      window.open(
        agentData.link_group_whatsapp as string,
        "_blank",
        "noopener,noreferrer",
      );
    }

    if (pageId) {
      navigate({ to: "/$pgcode", params: { pgcode: pageId } });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <GuidePageContent
      pageId={pageId}
      agentData={agentData}
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
}
