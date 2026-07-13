import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@repo/lib/api";

export interface BranchOption {
  value: string;
  label: string;
}

export interface BaseInfo {
  nasabah: number;
  cabang: {
    malaysia: number;
    indonesia: number;
    lainnya?: number;
  };
  negara: number;
}

export interface ConfigsData {
  branches_id: BranchOption[];
  branches_my: BranchOption[];
  base_info: BaseInfo;
}

export function useConfigsQuery(isAdmin = false) {
  return useQuery({
    queryKey: isAdmin ? ["admin-configs"] : ["public-configs"],
    queryFn: async () => {
      const endpoint = isAdmin ? "/admin/settings/configs" : "/public/configs";
      const res = await api.get<{ data: ConfigsData }>(endpoint);
      return res.data.data;
    },
  });
}

export function useConfigsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ConfigsData>) => {
      const res = await api.patch<{ message: string }>("/admin/settings/configs", {
        branches_id: data.branches_id,
        branches_my: data.branches_my,
        base_info: data.base_info,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-configs"] });
      queryClient.invalidateQueries({ queryKey: ["public-configs"] });
    },
  });
}
