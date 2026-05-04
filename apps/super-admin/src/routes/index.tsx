import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { logout } from "@repo/lib/auth";
import {
  getAdminPgboFn,
  getAdminSecretFn,
  updateAdminSecretFn,
  exportAdminPgboFn,
  deleteAdminPgboFn,
  toggleAdminPgboFn,
  bulkDeleteAdminPgboFn,
  bulkToggleAdminPgboFn,
  createAdminPgboFn,
  updateAdminPgboFn,
  checkAdminPageIdFn,
} from "@repo/services/api.functions";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { api } from "@repo/lib/api";
import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { useToast } from "@repo/ui/toast";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@repo/ui/ui/data-table";
import {
  Trash2,
  Plus,
  Pencil,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Loader2,
  User,
  Phone,
  Image as ImageIcon,
  Lock,
} from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import { useDebounce } from "@repo/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/ui/dialog";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
} from "@repo/ui/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/ui/select";
import { dialCodeOptions } from "@repo/constant/countries";
import { cn } from "@repo/lib/utils";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth?.adminToken) {
      throw redirect({
        to: "/signin",
      });
    }
  },
  component: AdminDashboard,
});

const createSchema = v.object({
  pgcode: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.nonEmpty("PGCode wajib diisi"),
  ),
  pageid: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.nonEmpty("Page ID wajib diisi"),
  ),
  katasandi: v.pipe(
    v.string(),
    v.minLength(6, "Minimal 6 karakter"),
    v.nonEmpty("Password wajib diisi"),
  ),
  nama_lengkap: v.optional(v.string()),
  country_code: v.optional(v.string(), "62"),
  no_telpon: v.pipe(v.string(), v.nonEmpty("No. Telepon wajib diisi")),
  foto_profil: v.optional(v.any()),
});

const editSchema = v.object({
  nama_lengkap: v.optional(v.string()),
  pgcode: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.nonEmpty("PGCode wajib diisi"),
  ),
  pageid: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.nonEmpty("Page ID wajib diisi"),
  ),
  country_code: v.optional(v.string(), "62"),
  no_telpon: v.pipe(v.string(), v.nonEmpty("No. Telepon wajib diisi")),
  foto_profil: v.optional(v.any()),
});

const columnHelper = createColumnHelper<any>();

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pgboToDelete, setPgboToDelete] = useState<string | null>(null);
  const [pgboToEdit, setPgboToEdit] = useState<any | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState<string[] | null>(
    null,
  );

  const [pageIdErrorCreate, setPageIdErrorCreate] = useState<string | null>(
    null,
  );
  const [pageIdErrorEdit, setPageIdErrorEdit] = useState<string | null>(null);
  const [showPasswordSementara, setShowPasswordSementara] = useState(false);

  // System Settings: Secret Code
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [showSecretInModal, setShowSecretInModal] = useState(false);
  const [tempSecretCode, setTempSecretCode] = useState("");
  const [isAutoRotate, setIsAutoRotate] = useState(false);

  const [createDialCodeSearch, setCreateDialCodeSearch] = useState("");
  const createFilteredDialCodes = useMemo(() => {
    if (!createDialCodeSearch) return dialCodeOptions;
    const term = createDialCodeSearch.toLowerCase();
    return dialCodeOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) || opt.value.includes(term),
    );
  }, [createDialCodeSearch]);

  const [editDialCodeSearch, setEditDialCodeSearch] = useState("");
  const editFilteredDialCodes = useMemo(() => {
    if (!editDialCodeSearch) return dialCodeOptions;
    const term = editDialCodeSearch.toLowerCase();
    return dialCodeOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) || opt.value.includes(term),
    );
  }, [editDialCodeSearch]);

  const { data: currentSecret } = useQuery({
    queryKey: ["admin_secret_code"],
    queryFn: async () => {
      try {
        const res = await getAdminSecretFn();
        console.log("Secret fetch success:", res.data);
        return res.data || { code: "", auto_rotate: false };
      } catch (err) {
        console.error("Secret fetch error:", err);
        return { code: "", auto_rotate: false };
      }
    },
    enabled: isSecretModalOpen,
  });

  useEffect(() => {
    if (currentSecret) {
      setTempSecretCode(currentSecret.code || "");
      setIsAutoRotate(!!currentSecret.auto_rotate);
    }
  }, [currentSecret]);

  const updateSecretMutation = useMutation({
    mutationFn: async (payload: { code: string; auto_rotate: boolean }) => {
      const res = await updateAdminSecretFn({ data: payload });
      return res;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      setIsSecretModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin_secret_code"] });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Gagal memperbarui kode rahasia",
        "error",
      );
    },
  });

  const generateRandom = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempSecretCode(result);
  };

  const checkPageId = async (
    pageid: string,
    excludeId?: string,
  ): Promise<boolean> => {
    if (!pageid || pageid.length < 3) return true;
    try {
      const res = await checkAdminPageIdFn({ data: { pageid, excludeId } });
      return res.isAvailable;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    document.title = "Dashboard Super Admin | Public Gold Indonesia";
  }, []);

  const [serverSearch, setServerSearch] = useState("");
  const debouncedSearch = useDebounce(serverSearch, 500);

  const {
    data: pgboData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin_pgbo", debouncedSearch],
    queryFn: async () => {
      const res = await getAdminPgboFn({ data: { search: debouncedSearch } });
      return res.data || [];
    },
    placeholderData: keepPreviousData,
    retry: 1,
  });

  // Auth interceptor
  // Auth interceptor redirect is mostly handled by api.ts but we can add safety here if needed
  useEffect(() => {
    if (isError) {
      if ((error as any).response?.status === 401) {
        logout();
        navigate({ to: "/signin" });
      }
    }
  }, [isError, error, navigate]);

  const handleLogout = () => {
    try {
      queryClient.clear();
      logout();
      navigate({ to: "/signin" });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // --- DELETE MUTATION ---
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteAdminPgboFn({ data: id });
      return res;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["admin_pgbo"] });
      setPgboToDelete(null);
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Gagal menghapus PGBO",
        "error",
      );
      setPgboToDelete(null);
    },
  });

  // --- TOGGLE ACTIVE MUTATION ---
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await toggleAdminPgboFn({ data: id });
      return res;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["admin_pgbo"] });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Gagal mengubah status PGBO",
        "error",
      );
    },
  });

  // --- BULK DELETE MUTATION ---
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await bulkDeleteAdminPgboFn({ data: { ids } });
      return res;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["admin_pgbo"] });
      setBulkDeleteConfirm(null);
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Gagal menghapus PGBO",
        "error",
      );
      setBulkDeleteConfirm(null);
    },
  });

  // --- BULK TOGGLE MUTATION ---
  const bulkToggleMutation = useMutation({
    mutationFn: async ({ ids, active }: { ids: string[]; active: boolean }) => {
      const res = await bulkToggleAdminPgboFn({ data: { ids, active } });
      return res;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["admin_pgbo"] });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Gagal mengubah status",
        "error",
      );
    },
  });

  // --- CREATE FORM & MUTATION ---
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    setValue: setValueCreate,
    watch: watchCreate,
    formState: { errors: createErrors, isValid: isValidCreate },
  } = useForm({
    resolver: valibotResolver(createSchema),
    mode: "onChange",
    defaultValues: {
      pgcode: "",
      pageid: "",
      katasandi: "",
      nama_lengkap: "",
      country_code: "62",
      no_telpon: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await createAdminPgboFn({ data });
      return res;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["admin_pgbo"] });
      setIsModalOpen(false);
      resetCreate();
      setPageIdErrorCreate(null);
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Gagal mendaftar PGBO",
        "error",
      );
    },
  });

  const onSubmitCreate = (data: any) => {
    const formData = new FormData();
    formData.append("pgcode", data.pgcode);
    formData.append("pageid", data.pageid);
    formData.append("katasandi", data.katasandi);
    if (data.nama_lengkap) formData.append("nama_lengkap", data.nama_lengkap);
    if (data.no_telpon) {
      const cleanPhone = data.no_telpon.replace(/^0+/, "");
      formData.append("no_telpon", `${data.country_code}${cleanPhone}`);
    }
    if (data.foto_profil && data.foto_profil.length > 0) {
      formData.append("foto_profil", data.foto_profil[0]);
    }

    createMutation.mutate(formData);
  };

  // --- EDIT FORM & MUTATION ---
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    watch: watchEdit,
    formState: { errors: editErrors, isValid: isValidEdit },
  } = useForm({
    resolver: valibotResolver(editSchema),
    mode: "onChange",
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await updateAdminPgboFn({ data: { id, data } });
      return res;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["admin_pgbo"] });
      setPgboToEdit(null);
      setPageIdErrorEdit(null);
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Gagal memperbarui PGBO",
        "error",
      );
    },
  });

  const fetchIntroducerName = async (pgcode: string, isEdit: boolean) => {
    if (!pgcode || pgcode.length < 6) return;

    try {
      const params = new URLSearchParams();
      params.append("pgcode", pgcode);
      const res = await fetch(
        "/api-proxy/index.php?route=account/register/getIntroducer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: params.toString(),
        },
      );
      const data = await res.json();
      if (data.success && data.name) {
        if (isEdit) {
          setValueEdit("nama_lengkap", data.name.trim(), {
            shouldValidate: true,
          });
        } else {
          setValueCreate("nama_lengkap", data.name.trim(), {
            shouldValidate: true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to auto-fetch PGCode name", error);
    }
  };

  const openEditModal = (pgbo: any) => {
    setPgboToEdit(pgbo);
    setPageIdErrorEdit(null);

    // Parse existing phone number to split country code and local number
    let parsedCountryCode = "62";
    let parsedPhone = pgbo.no_telpon || "";
    if (parsedPhone) {
      if (parsedPhone.startsWith("62")) {
        parsedCountryCode = "62";
        parsedPhone = parsedPhone.substring(2);
      } else if (parsedPhone.startsWith("60")) {
        parsedCountryCode = "60";
        parsedPhone = parsedPhone.substring(2);
      } else if (parsedPhone.startsWith("65")) {
        parsedCountryCode = "65";
        parsedPhone = parsedPhone.substring(2);
      }
    }

    resetEdit({
      nama_lengkap: pgbo.nama_lengkap || "",
      pgcode: pgbo.pgcode || "",
      pageid: pgbo.pageid || "",
      country_code: parsedCountryCode,
      no_telpon: parsedPhone,
    });
  };

  const onSubmitEdit = (data: any) => {
    if (!pgboToEdit) return;
    const formData = new FormData();
    if (data.pgcode) formData.append("pgcode", data.pgcode);
    if (data.pageid) formData.append("pageid", data.pageid);
    if (data.nama_lengkap) formData.append("nama_lengkap", data.nama_lengkap);

    if (data.no_telpon) {
      const cleanPhone = data.no_telpon.replace(/^0+/, "");
      formData.append("no_telpon", `${data.country_code}${cleanPhone}`);
    } else {
      formData.append("no_telpon", "");
    }

    if (data.foto_profil && data.foto_profil.length > 0) {
      formData.append("foto_profil", data.foto_profil[0]);
    }

    editMutation.mutate({ id: pgboToEdit.id, data: formData });
  };

  // --- TABLE COLUMN DEFINITIONS ---
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "no",
        header: "No",
        cell: (info) => (
          <span className="text-sm text-slate-500">{info.row.index + 1}</span>
        ),
      }),
      columnHelper.accessor("pgcode", {
        header: "Informasi Akun",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">
              {info.getValue()}
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-tight">
              {info.row.original.nama_lengkap || "-"}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("pageid", {
        header: "Link ID",
        cell: (info) => (
          <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg inline-block w-fit font-mono font-semibold border border-slate-200">
            /{info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "kontak",
        header: "Kontak",
        cell: (info) => {
          const d = info.row.original;
          return (
            <div className="flex flex-col gap-1.5">
              {d.no_telpon ? (
                <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                  <Phone className="w-3 h-3 text-red-500" />
                  {d.no_telpon}
                </span>
              ) : (
                <span className="text-xs text-slate-400">Tidak ada telp</span>
              )}
              {d.foto_profil_url && (
                <a
                  href={d.foto_profil_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 hover:underline"
                >
                  <ImageIcon className="w-3 h-3" />
                  Lihat Foto
                </a>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("created_at", {
        header: "Terdaftar",
        cell: (info) => (
          <span className="text-xs text-slate-500 font-medium">
            {dayjs(info.getValue()).format("DD MMM YYYY")}
          </span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const isActive = !!info.row.original.is_active;
          return (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => toggleMutation.mutate(info.row.original.id)}
              disabled={toggleMutation.isPending}
              className={cn(
                "rounded-full px-2.5 h-6 text-[10px] font-bold uppercase tracking-wider",
                isActive
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-600",
              )}
            >
              {toggleMutation.isPending
                ? "Updating..."
                : isActive
                  ? "Aktif"
                  : "Nonaktif"}
            </Button>
          );
        },
      }),
      columnHelper.display({
        id: "aksi",
        header: "",
        cell: (info) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEditModal(info.row.original)}
              className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPgboToDelete(info.row.original.id)}
              className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ),
      }),
    ],
    [toggleMutation],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          <div className="space-y-1">
            <p className="text-slate-900 font-bold">Memuat Dashboard</p>
            <p className="text-slate-500 text-sm">
              Sedang mengambil data PGBO...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 text-center space-y-6 border border-slate-100">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 animate-pulse text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Koneksi Terputus
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Gagal memuat data dari server. Pastikan koneksi internet stabil
              atau coba muat ulang halaman.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["admin_pgbo"] })
              }
              className="w-full py-6 rounded-2xl font-bold shadow-lg shadow-red-200"
            >
              Coba Lagi
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-slate-400 hover:text-slate-600"
            >
              Keluar Sesi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      <nav className="bg-slate-900 text-white shadow-xl shadow-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20">
            <div className="flex items-center">
              <div className="shrink-0 flex items-center gap-3">
                <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 ring-2 ring-white/10">
                  <Lock className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-lg block tracking-tight leading-none">
                    Super Admin
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">
                    Public Gold Portal
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                rounded="xl"
                onClick={() => setIsSecretModalOpen(true)}
                className="text-slate-300 hover:text-white hover:bg-slate-800 border-transparent hover:border-slate-700 transition-all font-semibold"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Portal Secret</span>
              </Button>
              <Button
                variant="outline"
                rounded="xl"
                onClick={handleLogout}
                className="bg-transparent text-red-400 hover:text-white hover:bg-red-600 border-red-500/30 hover:border-red-600 transition-all font-bold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline text-xs">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Daftar Halaman PGBO
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Manajemen Landing Page Landing Page
              <span className="mx-2 text-slate-300 font-light">|</span>
              <span className="text-red-500 font-bold">
                {pgboData?.length || 0} Akun Aktif
              </span>
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="w-full md:w-auto h-auto py-3.5 px-8 rounded-2xl font-bold shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-200 transition-all active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Halaman Baru
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={pgboData || []}
          emptyMessage="Belum ada data Dealer (PGBO)."
          enableSearch
          searchPlaceholder="Cari PGCode, Nama, atau Page ID..."
          serverSearchValue={serverSearch}
          onServerSearchChange={setServerSearch}
          enablePagination
          defaultPageSize={10}
          enableRowSelection
          renderBulkActions={(count, selectedRows, clearSelection) => (
            <>
              <span
                className={cn(
                  "text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border",
                  count > 0
                    ? "text-red-600 bg-red-50 border-red-100"
                    : "text-slate-400 bg-slate-50 border-slate-100",
                )}
              >
                {count} Terpilih
              </span>
              <div className="flex items-center gap-2">
                <Select
                  disabled={count === 0 || bulkToggleMutation.isPending}
                  onValueChange={(val: string | null) => {
                    if (!val) return;
                    const ids = selectedRows.map((r: any) => r.id);
                    bulkToggleMutation.mutate(
                      { ids, active: val === "active" },
                      {
                        onSuccess: () => {
                          clearSelection();
                        },
                      },
                    );
                  }}
                >
                  <SelectTrigger className="w-[140px] text-[11px] font-bold h-9 rounded-xl bg-white focus:ring-0">
                    <SelectValue placeholder="Ubah Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="text-xs font-medium">
                      🟢 Aktifkan
                    </SelectItem>
                    <SelectItem
                      value="inactive"
                      className="text-xs font-medium"
                    >
                      🔴 Nonaktifkan
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const ids = selectedRows.map((r: any) => r.id);
                    setBulkDeleteConfirm(ids);
                  }}
                  disabled={count === 0}
                  className="h-9 px-4 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border-red-100 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Hapus
                </Button>
              </div>
            </>
          )}
        />
      </main>

      {/* CREATE PGBO MODAL */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false);
            resetCreate();
            setPageIdErrorCreate(null);
          }
        }}
      >
        <DialogContent className="max-w-md rounded-2xl sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 pb-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-slate-900 tracking-tight">
              Buat Page PGBO Baru
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Daftarkan page baru untuk dealer Public Gold
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitCreate(onSubmitCreate)} className="p-6">
            <fieldset disabled={createMutation.isPending} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="create-pgcode"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                  >
                    PGCode
                  </Label>
                  <Input
                    id="create-pgcode"
                    {...registerCreate("pgcode", {
                      onBlur: (e) => fetchIntroducerName(e.target.value, false),
                    })}
                    className={cn(
                      "rounded-xl h-11 focus-visible:ring-red-500/20",
                      createErrors.pgcode
                        ? "border-red-500"
                        : "border-slate-200",
                    )}
                    placeholder="Contoh: PG123456"
                  />
                  {createErrors.pgcode && (
                    <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                      {createErrors.pgcode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="create-pageid"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                  >
                    Page ID (Unik)
                  </Label>
                  <Input
                    id="create-pageid"
                    {...registerCreate("pageid", {
                      onBlur: async (e) => {
                        if (e.target.value.length >= 3) {
                          const isAvailable = await checkPageId(e.target.value);
                          if (!isAvailable)
                            setPageIdErrorCreate("Page ID ini sudah terdaftar");
                          else setPageIdErrorCreate(null);
                        } else {
                          setPageIdErrorCreate(null);
                        }
                      },
                    })}
                    className={cn(
                      "rounded-xl h-11 focus-visible:ring-red-500/20",
                      createErrors.pageid || pageIdErrorCreate
                        ? "border-red-500"
                        : "border-slate-200",
                    )}
                    placeholder="Contoh: gold-expert"
                  />
                  {(createErrors.pageid || pageIdErrorCreate) && (
                    <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                      {createErrors.pageid?.message || pageIdErrorCreate}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="create-nama"
                  className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                >
                  Nama Lengkap (Otomatis)
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="create-nama"
                    readOnly
                    {...registerCreate("nama_lengkap")}
                    className="rounded-xl h-11 pl-10 bg-slate-50 border-slate-200 text-slate-500 font-bold"
                    placeholder="Terisi otomatis setelah PGCode valid..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1">
                  No. Telepon (WhatsApp)
                </Label>
                <div className="flex -space-x-px">
                  <Combobox
                    onValueChange={(val: string | null) => {
                      if (val) setValueCreate("country_code", val);
                    }}
                    value={watchCreate("country_code") || "62"}
                    inputValue={createDialCodeSearch}
                    onInputValueChange={setCreateDialCodeSearch}
                  >
                    <ComboboxTrigger className="w-[100px] rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0 shadow-none">
                      <ComboboxValue>
                        {dialCodeOptions
                          .find(
                            (opt) => opt.value === watchCreate("country_code"),
                          )
                          ?.label?.replace("+", "") || "62"}
                      </ComboboxValue>
                    </ComboboxTrigger>
                    <ComboboxContent>
                      <ComboboxInput placeholder="Cari..." />
                      <ComboboxEmpty>No results.</ComboboxEmpty>
                      {createFilteredDialCodes.map((opt) => (
                        <ComboboxItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxContent>
                  </Combobox>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      {...registerCreate("no_telpon")}
                      className="rounded-l-none pl-10 focus-visible:ring-offset-0"
                      placeholder="8123456789"
                    />
                  </div>
                </div>
                {createErrors.no_telpon && (
                  <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                    {createErrors.no_telpon.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="create-pass"
                  className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                >
                  Password Sementara
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="create-pass"
                    type={showPasswordSementara ? "text" : "password"}
                    {...registerCreate("katasandi")}
                    className={cn(
                      "rounded-xl h-11 pl-10 pr-10 border-slate-200",
                      createErrors.katasandi
                        ? "border-red-500"
                        : "border-slate-200",
                    )}
                    placeholder="Minimal 6 karakter"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setShowPasswordSementara(!showPasswordSementara)
                    }
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-slate-400 rounded-lg"
                  >
                    {showPasswordSementara ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                </div>
                {createErrors.katasandi && (
                  <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                    {createErrors.katasandi.message}
                  </p>
                )}
              </div>

              <DialogFooter className="pt-4 gap-3 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl h-11 font-bold text-slate-600 order-2 sm:order-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    !isValidCreate ||
                    !!pageIdErrorCreate
                  }
                  className="rounded-xl h-11 px-8 font-bold shadow-lg shadow-red-200 flex-1 sm:flex-none order-1 sm:order-2"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {createMutation.isPending ? "Memproses..." : "Buat Halaman"}
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT PGBO MODAL */}
      <Dialog
        open={!!pgboToEdit}
        onOpenChange={(open) => {
          if (!open) setPgboToEdit(null);
        }}
      >
        <DialogContent className="max-w-md rounded-2xl sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 pb-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-slate-900 tracking-tight">
              Sunting Informasi Dealer
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Perbarui informasi profil dan link PGBO
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="p-6">
            <fieldset disabled={editMutation.isPending} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-pgcode"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                  >
                    PGCode
                  </Label>
                  <Input
                    id="edit-pgcode"
                    {...registerEdit("pgcode", {
                      onBlur: (e) => fetchIntroducerName(e.target.value, true),
                    })}
                    className={cn(
                      "rounded-xl h-11 focus-visible:ring-red-500/20",
                      editErrors.pgcode ? "border-red-500" : "border-slate-200",
                    )}
                  />
                  {editErrors.pgcode && (
                    <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                      {editErrors.pgcode.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-pageid"
                    className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                  >
                    Page ID
                  </Label>
                  <Input
                    id="edit-pageid"
                    {...registerEdit("pageid", {
                      onBlur: async (e) => {
                        if (
                          e.target.value.length >= 3 &&
                          pgboToEdit?.pageid !== e.target.value
                        ) {
                          const isAvailable = await checkPageId(
                            e.target.value,
                            pgboToEdit?.id,
                          );
                          if (!isAvailable)
                            setPageIdErrorEdit("Page ID ini sudah dipakai");
                          else setPageIdErrorEdit(null);
                        } else {
                          setPageIdErrorEdit(null);
                        }
                      },
                    })}
                    className={cn(
                      "rounded-xl h-11 focus-visible:ring-red-500/20",
                      editErrors.pageid || pageIdErrorEdit
                        ? "border-red-500"
                        : "border-slate-200",
                    )}
                  />
                  {(editErrors.pageid || pageIdErrorEdit) && (
                    <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                      {editErrors.pageid?.message || pageIdErrorEdit}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="edit-nama"
                  className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                >
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="edit-nama"
                    readOnly
                    {...registerEdit("nama_lengkap")}
                    className="rounded-xl h-11 pl-10 bg-slate-50 border-slate-200 text-slate-500 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1">
                  No. Telepon (WhatsApp)
                </Label>
                <div className="flex -space-x-px">
                  <Combobox
                    onValueChange={(val: string | null) => {
                      if (val) setValueEdit("country_code", val);
                    }}
                    value={watchEdit("country_code") || "62"}
                    inputValue={editDialCodeSearch}
                    onInputValueChange={setEditDialCodeSearch}
                  >
                    <ComboboxTrigger className="w-[100px] rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0 shadow-none">
                      <ComboboxValue>
                        {dialCodeOptions
                          .find(
                            (opt) => opt.value === watchEdit("country_code"),
                          )
                          ?.label?.replace("+", "") || "62"}
                      </ComboboxValue>
                    </ComboboxTrigger>
                    <ComboboxContent>
                      <ComboboxInput placeholder="Cari..." />
                      <ComboboxEmpty>No results.</ComboboxEmpty>
                      {editFilteredDialCodes.map((opt) => (
                        <ComboboxItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxContent>
                  </Combobox>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      {...registerEdit("no_telpon")}
                      className="rounded-l-none pl-10 focus-visible:ring-offset-0"
                      placeholder="8123456789"
                    />
                  </div>
                </div>
                {editErrors.no_telpon && (
                  <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                    {editErrors.no_telpon.message}
                  </p>
                )}
              </div>

              <DialogFooter className="pt-4 gap-3 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPgboToEdit(null)}
                  className="rounded-xl h-11 font-bold text-slate-600 order-2 sm:order-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={
                    editMutation.isPending || !isValidEdit || !!pageIdErrorEdit
                  }
                  className="rounded-xl h-11 px-8 font-bold shadow-lg shadow-red-200 flex-1 sm:flex-none order-1 sm:order-2"
                >
                  {editMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog
        open={!!pgboToDelete}
        onOpenChange={(open) => {
          if (!open) setPgboToDelete(null);
        }}
      >
        <DialogContent className="max-w-sm rounded-2xl overflow-hidden p-0 gap-0 border-none shadow-2xl">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-7 h-7" />
            </div>
            <DialogHeader className="p-0 mb-3">
              <DialogTitle className="text-xl font-extrabold text-slate-900 text-center tracking-tight">
                Hapus Halaman PGBO?
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-slate-500 font-medium text-sm leading-relaxed mb-0 text-center">
              Aksi ini akan menghapus seluruh data Dealer secara permanen. Anda
              tidak dapat mengembalikan tindakan ini.
            </DialogDescription>
          </div>
          <DialogFooter className="p-6 pt-0 flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setPgboToDelete(null)}
              className="flex-1 rounded-2xl h-11 font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200 transition-all"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                pgboToDelete && deleteMutation.mutate(pgboToDelete)
              }
              disabled={deleteMutation.isPending}
              className="flex-1 rounded-2xl h-11 font-bold shadow-xl shadow-red-200 transition-all"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BULK DELETE CONFIRMATION MODAL */}
      <Dialog
        open={!!bulkDeleteConfirm}
        onOpenChange={(open) => {
          if (!open) setBulkDeleteConfirm(null);
        }}
      >
        <DialogContent className="max-w-sm rounded-2xl overflow-hidden p-0 gap-0 border-none shadow-2xl">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-7 h-7" />
            </div>
            <DialogHeader className="p-0 mb-3">
              <DialogTitle className="text-xl font-extrabold text-slate-900 text-center tracking-tight">
                Hapus {bulkDeleteConfirm?.length} PGBO?
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-slate-500 font-medium text-sm leading-relaxed mb-0 text-center">
              Semua halaman terpilih akan dihapus permanen. Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </div>
          <DialogFooter className="p-6 pt-0 flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setBulkDeleteConfirm(null)}
              className="flex-1 rounded-2xl h-11 font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                bulkDeleteConfirm &&
                bulkDeleteMutation.mutate(bulkDeleteConfirm)
              }
              disabled={bulkDeleteMutation.isPending}
              className="flex-1 rounded-2xl h-11 font-bold shadow-xl shadow-red-200"
            >
              {bulkDeleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {bulkDeleteMutation.isPending ? "Hapus Semua" : "Ya, Hapus Semua"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SECRET CODE MODAL */}
      <Dialog
        open={isSecretModalOpen}
        onOpenChange={(open) => {
          if (!open) setIsSecretModalOpen(false);
        }}
      >
        <DialogContent className="max-w-sm rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center ring-1 ring-white/10">
                <KeyRound className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold tracking-tight">
                  Portal Secret Code
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  Pengaturan Keamanan
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                Akses Kode Pendaftaran
              </Label>
              <div className="relative group">
                <Input
                  type={showSecretInModal ? "text" : "password"}
                  autoComplete="off"
                  data-1p-ignore="true"
                  data-lpignore="true"
                  spellCheck="false"
                  value={tempSecretCode}
                  onChange={(e) => setTempSecretCode(e.target.value)}
                  className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-mono text-xl text-center tracking-[0.5em] font-bold text-slate-900 focus-visible:ring-red-500/20 transition-all cursor-text select-text"
                  placeholder="CODE"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSecretInModal(!showSecretInModal)}
                    className="h-10 w-10 text-slate-400 hover:text-slate-600 rounded-xl"
                  >
                    {showSecretInModal ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={generateRandom}
                    className="h-10 w-10 text-slate-400 hover:text-red-600 transition hover:bg-red-50 rounded-xl"
                  >
                    <RefreshCw size={18} />
                  </Button>
                </div>
              </div>
              <p className="px-2 text-[11px] text-slate-400 leading-relaxed italic font-medium">
                * Kode ini digunakan untuk masuk ke portal pendaftaran. Dealer
                harus mengetahui kode ini agar dapat mendaftarkan akun baru.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                      Perbarui Otomatis (24 Jam)
                    </span>
                    <div className="p-1 bg-red-100 rounded-md">
                      <RefreshCw
                        size={10}
                        className={cn(
                          "text-red-600",
                          isAutoRotate && "animate-spin-slow",
                        )}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">
                    Generate ulang kode otomatis oleh sistem
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAutoRotate(!isAutoRotate)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                    isAutoRotate ? "bg-red-600" : "bg-slate-200",
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isAutoRotate ? "translate-x-5" : "translate-x-0",
                    )}
                  />
                </button>
              </div>
            </div>

            <DialogFooter className="flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsSecretModalOpen(false)}
                className="flex-1 rounded-2xl h-12 font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200"
              >
                Batal
              </Button>
              <Button
                onClick={() =>
                  updateSecretMutation.mutate({
                    code: tempSecretCode,
                    auto_rotate: isAutoRotate,
                  })
                }
                disabled={
                  updateSecretMutation.isPending || tempSecretCode.length < 3
                }
                className="flex-1 rounded-2xl h-12 font-bold shadow-xl shadow-red-200 transition-all active:scale-[0.98]"
              >
                {updateSecretMutation.isPending ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                Simpan
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
