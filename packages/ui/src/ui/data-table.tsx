import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	type RowSelectionState,
	useReactTable,
} from "@tanstack/react-table";
import {
	Archive,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	emptyMessage?: string;
	className?: string;
	enableSearch?: boolean;
	searchPlaceholder?: string;
	enablePagination?: boolean;
	defaultPageSize?: number;
	enableRowSelection?: boolean;
	onSelectionChange?: (selectedRows: TData[]) => void;
	/** Render bulk actions — receives count, selectedRows, clearSelection */
	renderBulkActions?: (
		count: number,
		selectedRows: TData[],
		clearSelection: () => void,
	) => ReactNode;
	serverSearchValue?: string;
	onServerSearchChange?: (val: string) => void;
	actionElement?: ReactNode;
}

export function DataTable<TData>({
	columns,
	data,
	emptyMessage = "Tidak ada data.",
	className = "",
	enableSearch = false,
	searchPlaceholder = "Cari...",
	enablePagination = false,
	defaultPageSize = 10,
	enableRowSelection = false,
	onSelectionChange,
	renderBulkActions,
	serverSearchValue,
	onServerSearchChange,
	actionElement,
}: DataTableProps<TData>) {
	const [globalFilter, setGlobalFilter] = useState("");
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const finalColumns: ColumnDef<TData, any>[] = enableRowSelection
		? [
				{
					id: "select",
					header: ({ table }) => (
						<input
							type="checkbox"
							className="w-4 h-4 rounded border-border cursor-pointer accent-primary"
							checked={table.getIsAllPageRowsSelected()}
							onChange={table.getToggleAllPageRowsSelectedHandler()}
						/>
					),
					cell: ({ row }) => (
						<input
							type="checkbox"
							className="w-4 h-4 rounded border-border cursor-pointer accent-primary"
							checked={row.getIsSelected()}
							onChange={row.getToggleSelectedHandler()}
						/>
					),
					size: 40,
				},
				...columns,
			]
		: columns;

	const table = useReactTable({
		data,
		columns: finalColumns,
		state: { globalFilter, rowSelection },
		onGlobalFilterChange: setGlobalFilter,
		onRowSelectionChange: setRowSelection,
		enableRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: enableSearch && !onServerSearchChange ? getFilteredRowModel() : undefined,
		getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
		initialState: {
			pagination: { pageSize: defaultPageSize },
		},
	});

	useEffect(() => {
		if (onSelectionChange) {
			const selected = table.getSelectedRowModel().rows.map((r) => r.original);
			onSelectionChange(selected);
		}
	}, [table.getSelectedRowModel, onSelectionChange]);

	const clearSelection = () => setRowSelection({});
	const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
	const totalRows = table.getFilteredRowModel().rows.length;
	const dataColumns = finalColumns.filter((col) => (col as any).id !== "select");

	return (
		<div
			className={`bg-card shadow-[0_1px_4px_rgba(0,0,0,0.06)] rounded-[var(--radius-card)] border border-border/80 overflow-hidden ${className}`}
		>
			{/* Toolbar: Search + Bulk Actions + Custom Actions */}
			{(enableSearch || (enableRowSelection && renderBulkActions) || actionElement) && (
				<div className="px-3 sm:px-5 py-2.5 border-b border-border/50 bg-muted/50 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 justify-between">
					<div className="flex flex-1 flex-col sm:flex-row gap-2.5 sm:gap-3 items-start sm:items-center w-full">
						{enableSearch && (
							<div className="relative flex-1 w-full sm:max-w-xs">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<input
									type="text"
									value={onServerSearchChange ? (serverSearchValue ?? "") : (globalFilter ?? "")}
									onChange={(e) => {
										if (onServerSearchChange) {
											onServerSearchChange(e.target.value);
										} else {
											setGlobalFilter(e.target.value);
										}
									}}
									placeholder={searchPlaceholder}
									className="w-full pl-9 pr-4 h-9 text-sm border border-input rounded-[var(--radius-input)] focus:outline-none focus:ring-2 focus:ring-ring/15 focus:border-ring transition-all bg-card"
								/>
							</div>
						)}
						{enableRowSelection && renderBulkActions && (
							<div className="flex items-center gap-2 flex-wrap">
								{renderBulkActions(selectedRows.length, selectedRows, clearSelection)}
							</div>
						)}
					</div>
					{actionElement && <div className="shrink-0">{actionElement}</div>}
				</div>
			)}

			{/* Desktop Table */}
			<div className="hidden sm:block overflow-x-auto">
				<table className="min-w-full">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="bg-muted border-b border-border/80">
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="px-5 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
										style={
											header.column.getSize() !== 150
												? { width: header.column.getSize() }
												: undefined
										}
									>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row, idx) => (
								<tr
									key={row.id}
									className={`
                    border-b border-border/50 last:border-b-0 transition-colors
                    ${
											row.getIsSelected()
												? "bg-primary/5"
												: idx % 2 === 0
													? "bg-card"
													: "bg-muted/40"
										}
                    hover:bg-accent/60
                  `}
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-5 py-3.5 whitespace-nowrap text-sm">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td colSpan={finalColumns.length} className="px-5 py-16 text-center">
									<div className="flex flex-col items-center justify-center">
										<div
											className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"
											title={emptyMessage}
										>
											<Archive className="w-9 h-9 text-muted-foreground/50" />
										</div>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Mobile Card View */}
			<div className="sm:hidden">
				{table.getRowModel().rows.length > 0 ? (
					table.getRowModel().rows.map((row, idx) => {
						const visibleCells = row.getVisibleCells();
						const selectCell = visibleCells.find((c) => c.column.id === "select");
						const dataCells = visibleCells.filter((c) => c.column.id !== "select");

						return (
							<div
								key={row.id}
								className={`
                  px-4 py-3 border-b border-border/50 last:border-b-0 transition-colors
                  ${
										row.getIsSelected() ? "bg-primary/5" : idx % 2 === 0 ? "bg-card" : "bg-muted/40"
									}
                `}
							>
								<div className="flex items-start gap-3">
									{selectCell && (
										<div className="pt-0.5 flex-shrink-0">
											{flexRender(selectCell.column.columnDef.cell, selectCell.getContext())}
										</div>
									)}
									<div className="flex-1 min-w-0 space-y-1">
										{dataCells.map((cell, cellIdx) => {
											const header = dataColumns[cellIdx];
											const headerLabel = typeof header?.header === "string" ? header.header : "";
											return (
												<div
													key={cell.id}
													className={cellIdx === 0 ? "" : "flex items-center justify-between gap-2"}
												>
													{cellIdx === 0 ? (
														<div className="font-medium">
															{flexRender(cell.column.columnDef.cell, cell.getContext())}
														</div>
													) : (
														<>
															{headerLabel && (
																<span className="text-[11px] text-muted-foreground font-medium shrink-0">
																	{headerLabel}
																</span>
															)}
															<div className="text-right min-w-0 truncate">
																{flexRender(cell.column.columnDef.cell, cell.getContext())}
															</div>
														</>
													)}
												</div>
											);
										})}
									</div>
								</div>
							</div>
						);
					})
				) : (
					<div className="px-4 py-16 text-center">
						<div className="flex flex-col items-center justify-center">
							<div
								className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"
								title={emptyMessage}
							>
								<Archive className="w-9 h-9 text-muted-foreground/50" />
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Pagination — RSuite-inspired */}
			{enablePagination && totalRows > 0 && (
				<div className="px-3 sm:px-5 py-2.5 border-t border-border/80 bg-muted/50 flex flex-col sm:flex-row items-center justify-between gap-2.5">
					{/* Left: total info */}
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="text-muted-foreground/70">Total</span>
						<span className="font-bold text-foreground">{totalRows}</span>
						<span className="text-border">|</span>
						<span>Tampilkan</span>
						<Select
							value={String(table.getState().pagination.pageSize)}
							onValueChange={(val) => table.setPageSize(Number(val))}
						>
							<SelectTrigger
								size="sm"
								className="w-14 h-8 data-[size=sm]:h-8 text-xs bg-card focus:ring-0"
							>
								<SelectValue placeholder={String(table.getState().pagination.pageSize)} />
							</SelectTrigger>
							<SelectContent className="min-w-0">
								{[10, 25, 50].map((size) => (
									<SelectItem key={size} value={String(size)} className="text-xs">
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Right: pager buttons */}
					<div className="flex items-center gap-0.5">
						<button
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
							className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-button)] text-muted-foreground hover:bg-accent/60 hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all text-xs font-bold"
							title="Halaman pertama"
						>
							<ChevronsLeft className="w-3.5 h-3.5" />
						</button>
						<button
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-button)] text-muted-foreground hover:bg-accent/60 hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
							title="Sebelumnya"
						>
							<ChevronLeft className="w-3.5 h-3.5" />
						</button>

						{/* Page number buttons */}
						{(() => {
							const pageCount = table.getPageCount();
							const currentPage = table.getState().pagination.pageIndex;
							const pages: (number | "...")[] = [];

							if (pageCount <= 5) {
								for (let i = 0; i < pageCount; i++) pages.push(i);
							} else {
								pages.push(0);
								if (currentPage > 2) pages.push("...");
								for (
									let i = Math.max(1, currentPage - 1);
									i <= Math.min(pageCount - 2, currentPage + 1);
									i++
								) {
									pages.push(i);
								}
								if (currentPage < pageCount - 3) pages.push("...");
								pages.push(pageCount - 1);
							}

							return pages.map((page, i) =>
								page === "..." ? (
									<span
										key={`ellipsis-${i}`}
										className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
									>
										⋯
									</span>
								) : (
									<button
										key={page}
										onClick={() => table.setPageIndex(page)}
										className={`w-8 h-8 flex items-center justify-center rounded-[var(--radius-button)] text-xs font-semibold transition-all ${
											currentPage === page
												? "text-primary font-extrabold"
												: "text-foreground/70 hover:bg-accent/60 hover:text-foreground"
										}`}
									>
										{page + 1}
									</button>
								),
							);
						})()}

						<button
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-button)] text-muted-foreground hover:bg-accent/60 hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
							title="Berikutnya"
						>
							<ChevronRight className="w-3.5 h-3.5" />
						</button>
						<button
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
							className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-button)] text-muted-foreground hover:bg-accent/60 hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
							title="Halaman terakhir"
						>
							<ChevronsRight className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
