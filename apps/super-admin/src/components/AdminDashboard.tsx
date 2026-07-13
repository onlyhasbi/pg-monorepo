import { logout } from "@repo/lib/auth";
import { isApiError } from "@repo/lib/errors";
import type { PgboData } from "@repo/types";
import { Button } from "@repo/ui/ui/button";
import { DataTable } from "@repo/ui/ui/data-table";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { usePageIdCheck } from "../hooks/usePageIdCheck";
import { usePgboMutations } from "../hooks/usePgboMutations";
import { usePgboQuery } from "../hooks/usePgboQuery";
import { useSecretCode } from "../hooks/useSecretCode";
import { AdminLayout } from "./AdminNav";
import { BulkDeleteDialog } from "./BulkDeleteDialog";
import { CreatePgboDialog } from "./CreatePgboDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { EditPgboDialog } from "./EditPgboDialog";
import { BulkActions } from "./pgbo-table/BulkActions";
import { usePgboColumns } from "./pgbo-table/columns";
import { SecretCodeDialog } from "./SecretCodeDialog";

/**
 * Main dashboard page for Super Admin.
 * Orchestrates hooks and dialog state — no business logic lives here.
 */
export function AdminDashboard() {
  const navigate = useNavigate();

  // --- Data & Mutations ---
  const pgboQuery = usePgboQuery();
  const mutations = usePgboMutations();
  const secretCode = useSecretCode();
  const pageIdCheck = usePageIdCheck();

  // --- Dialog State ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [pgboToEdit, setPgboToEdit] = useState<PgboData | null>(null);
  const [pgboToDelete, setPgboToDelete] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);

  // --- Page Title ---
  useEffect(() => {
    document.title = "Dashboard Super Admin | Public Gold Indonesia";
  }, []);

  // --- Auth interceptor ---
  useEffect(() => {
    if (pgboQuery.isError) {
      const err = pgboQuery.error;
      if (isApiError(err) && err.status === 401) {
        logout();
        navigate({ to: "/signin" });
      }
    }
  }, [pgboQuery.isError, pgboQuery.error, navigate]);

  // --- Handlers ---
  const handleLogout = () => {
    logout();
    navigate({ to: "/signin" });
  };

  const fetchIntroducerName = useCallback(
    async (pgcode: string, isEdit: boolean) => {
      if (!pgcode || pgcode.length < 6) return;
      try {
        const params = new URLSearchParams();
        params.append("pgcode", pgcode);
        const res = await fetch(
          "/api-proxy/index.php?route=account/register/getIntroducer",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: params.toString(),
          },
        );
        const data = (await res.json()) as {
          success: boolean;
          name?: string;
        };
        if (data.success && data.name) {
          // The name will be set by the dialog component via its own setValue
          // We use a custom event to communicate back
          window.dispatchEvent(
            new CustomEvent("pgcode-name-resolved", {
              detail: { name: data.name.trim(), isEdit },
            }),
          );
        }
      } catch (error) {
        console.warn("Failed to auto-fetch PGCode name", error);
      }
    },
    [],
  );

  const handleCreateSubmit = (formData: FormData) => {
    mutations.createMutation.mutate(formData, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleEditSubmit = (id: string, formData: FormData) => {
    mutations.editMutation.mutate(
      { id, data: formData },
      { onSuccess: () => setPgboToEdit(null) },
    );
  };

  const handleDeleteConfirm = () => {
    if (pgboToDelete) {
      mutations.deleteMutation.mutate(pgboToDelete, {
        onSettled: () => setPgboToDelete(null),
      });
    }
  };

  const handleBulkDeleteConfirm = (ids: string[]) => {
    mutations.bulkDeleteMutation.mutate(ids, {
      onSettled: () => setBulkDeleteIds(null),
    });
  };

  const handleBulkToggle = (
    ids: string[],
    active: boolean,
    onDone: () => void,
  ) => {
    mutations.bulkToggleMutation.mutate({ ids, active }, { onSettled: onDone });
  };

  const handleSecretSave = () => {
    secretCode.updateSecretMutation.mutate({
      code: secretCode.tempSecretCode,
      auto_rotate: secretCode.isAutoRotate,
    });
  };

  // --- Table Columns ---
  const columns = usePgboColumns({
    onEdit: setPgboToEdit,
    onDelete: setPgboToDelete,
    onToggle: (id) => mutations.toggleMutation.mutate(id),
    isToggling: mutations.toggleMutation.isPending,
  });

  return (
    <AdminLayout
      onOpenSecret={() => secretCode.setIsSecretModalOpen(true)}
      onLogout={handleLogout}
    >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Daftar Halaman
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Manajemen Landing Page
              <span className="mx-2 text-slate-300 font-light">|</span>
              <span className="text-red-500 font-bold">
                {pgboQuery.data?.length || 0} Akun Aktif
              </span>
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="w-full md:w-auto font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-200 transition-all active:scale-[0.98]"
          >
            Buat Page Baru
          </Button>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={(pgboQuery.data as PgboData[]) || []}
          enableSearch
          enablePagination
          serverSearchValue={pgboQuery.serverSearch}
          onServerSearchChange={pgboQuery.setServerSearch}
          searchPlaceholder="Cari"
          enableRowSelection
          renderBulkActions={(count, selectedRows, clearSelection) => (
            <BulkActions
              count={count}
              selectedRows={selectedRows}
              clearSelection={clearSelection}
              onBulkToggle={handleBulkToggle}
              onBulkDelete={(ids) => setBulkDeleteIds(ids)}
              isBulkToggling={mutations.bulkToggleMutation.isPending}
            />
          )}
        />


      {/* Dialogs */}
      <CreatePgboDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateSubmit}
        isPending={mutations.createMutation.isPending}
        pageIdError={pageIdCheck.pageIdErrorCreate}
        onCheckPageId={pageIdCheck.checkPageId}
        onSetPageIdError={pageIdCheck.setPageIdErrorCreate}
        onFetchIntroducerName={fetchIntroducerName}
      />

      <EditPgboDialog
        pgbo={pgboToEdit}
        onOpenChange={() => setPgboToEdit(null)}
        onSubmit={handleEditSubmit}
        isPending={mutations.editMutation.isPending}
        pageIdError={pageIdCheck.pageIdErrorEdit}
        onCheckPageId={pageIdCheck.checkPageId}
        onSetPageIdError={pageIdCheck.setPageIdErrorEdit}
        onFetchIntroducerName={fetchIntroducerName}
      />

      <DeleteConfirmDialog
        open={!!pgboToDelete}
        onOpenChange={() => setPgboToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isPending={mutations.deleteMutation.isPending}
      />

      <BulkDeleteDialog
        ids={bulkDeleteIds}
        onOpenChange={() => setBulkDeleteIds(null)}
        onConfirm={handleBulkDeleteConfirm}
        isPending={mutations.bulkDeleteMutation.isPending}
      />

      <SecretCodeDialog
        isOpen={secretCode.isSecretModalOpen}
        onOpenChange={secretCode.setIsSecretModalOpen}
        tempSecretCode={secretCode.tempSecretCode}
        onSecretCodeChange={secretCode.setTempSecretCode}
        showSecret={secretCode.showSecretInModal}
        onToggleShow={() =>
          secretCode.setShowSecretInModal(!secretCode.showSecretInModal)
        }
        isAutoRotate={secretCode.isAutoRotate}
        onToggleAutoRotate={() =>
          secretCode.setIsAutoRotate(!secretCode.isAutoRotate)
        }
        onGenerate={secretCode.generateRandom}
        onSave={handleSecretSave}
        isSaving={secretCode.updateSecretMutation.isPending}
      />
    </AdminLayout>
  );
}
