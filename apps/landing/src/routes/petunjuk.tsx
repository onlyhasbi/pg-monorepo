import { createFileRoute } from "@tanstack/react-router";

export type PetunjukSearch = {
  ref?: string;
};

export const Route = createFileRoute("/petunjuk")({
  validateSearch: (search: Record<string, unknown>): PetunjukSearch => {
    return {
      ref: (search.ref as string) || undefined,
    };
  },
});
