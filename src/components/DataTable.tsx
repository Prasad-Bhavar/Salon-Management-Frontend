import { useState, useMemo, useCallback, ReactNode } from "react";
import {
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    Search,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type SortOrder = "asc" | "desc" | null;

export interface ColumnDef<T = any> {
    /** Unique key, also used as the default sort field */
    key: string;
    /** Header label */
    label: string;
    /** Whether this column is sortable (default: false) */
    sortable?: boolean;
    /** Alignment of header + cell (default: "left") */
    align?: "left" | "center" | "right";
    /** Custom cell renderer. Receives the row and its index. */
    render?: (row: T, index: number) => ReactNode;
    /** Width hint, e.g. "w-10" or "min-w-[140px]" – applied to <th> */
    width?: string;
    /** Hide this column on small screens */
    hideOnMobile?: boolean;
}

export interface FilterDef {
    key: string;
    type: "search" | "select" | "date";
    placeholder?: string;
    options?: { label: string; value: string }[];
}

export interface PaginationState {
    page: number;        // 1-based
    pageSize: number;
    total: number;
}

export interface SortState {
    field: string | null;
    order: SortOrder;
}

// ── Server-side mode ─────────────────────────────────────────
export interface ServerSideProps<T> {
    mode: "server";
    data: T[];
    loading?: boolean;
    pagination: PaginationState;
    sort: SortState;
    onSortChange: (sort: SortState) => void;
    onPageChange: (page: number, pageSize: number) => void;
    onFilterChange?: (filters: Record<string, string>) => void;
}

// ── Client-side mode ─────────────────────────────────────────
export interface ClientSideProps<T> {
    mode?: "client";
    data: T[];
    loading?: boolean;
    defaultPageSize?: number;
}

export type DataTableProps<T> = {
    columns: ColumnDef<T>[];
    filters?: FilterDef[];
    /** Key extractor for React key prop */
    rowKey?: (row: T) => string | number;
    /** Empty state message */
    emptyText?: string;
    /** Loading state message */
    loadingText?: string;
    /** Show row numbers column */
    showRowNumbers?: boolean;
    /** Extra class applied to the wrapper */
    className?: string;
    /** Called when a row is clicked */
    onRowClick?: (row: T) => void;
} & (ServerSideProps<T> | ClientSideProps<T>);

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function SortIcon({ field, sort }: { field: string; sort: SortState }) {
    if (sort.field !== field)
        return <ArrowUpDown size={13} className="text-gray-400 opacity-60" />;
    return sort.order === "asc"
        ? <ArrowUp size={13} className="text-brand-500" />
        : <ArrowDown size={13} className="text-brand-500" />;
}

function Skeleton() {
    return (
        <div className="animate-pulse space-y-3 px-5 py-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 rounded bg-gray-100 dark:bg-white/[0.06]" style={{ width: `${70 + (i % 3) * 10}%` }} />
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────────────────────

interface FilterBarProps {
    filters: FilterDef[];
    values: Record<string, string>;
    onChange: (key: string, value: string) => void;
    onApply?: () => void;
    onReset: () => void;
    serverSide?: boolean;
}

function FilterBar({ filters, values, onChange, onApply, onReset, serverSide }: FilterBarProps) {
    const searchFilter = filters.find((f) => f.type === "search");
    const otherFilters = filters.filter((f) => f.type !== "search");

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Single row on md+: search left, selects + actions right */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* ── LEFT: Search ── */}
                {searchFilter && (
                    <div className="relative w-full sm:max-w-sm">
                        <Search
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder={searchFilter.placeholder ?? "Search…"}
                            value={values[searchFilter.key] ?? ""}
                            onChange={(e) => onChange(searchFilter.key, e.target.value)}
                            className="h-10 w-full rounded-lg border border-gray-300 bg-transparent pl-9 pr-4 text-sm text-gray-800 shadow-theme-xs outline-none transition focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
                        />
                    </div>
                )}

                {/* ── RIGHT: selects + action buttons ── */}
                <div className="flex flex-wrap items-center gap-2">
                    {otherFilters.map((f) => {
                        if (f.type === "select") return (
                            <select
                                key={f.key}
                                value={values[f.key] ?? ""}
                                onChange={(e) => onChange(f.key, e.target.value)}
                                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-theme-xs outline-none transition focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            >
                                <option value="">{f.placeholder ?? "All"}</option>
                                {f.options?.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        );

                        if (f.type === "date") return (
                            <input
                                key={f.key}
                                type="date"
                                value={values[f.key] ?? ""}
                                onChange={(e) => onChange(f.key, e.target.value)}
                                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-theme-xs outline-none transition focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            />
                        );

                        return null;
                    })}

                    {/* Apply (server-side only) */}
                    {serverSide && onApply && (
                        <button
                            onClick={onApply}
                            className="h-10 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
                        >
                            Apply
                        </button>
                    )}

                    {/* Reset */}
                    <button
                        onClick={onReset}
                        className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// PAGINATION BAR
// ─────────────────────────────────────────────────────────────

interface PaginationBarProps {
    page: number;
    pageSize: number;
    total: number;
    onPage: (page: number) => void;
    onPageSize?: (size: number) => void;
}

function PaginationBar({ page, pageSize, total, onPage, onPageSize }: PaginationBarProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const from = Math.min((page - 1) * pageSize + 1, total);
    const to = Math.min(page * pageSize, total);

    // Build page range with ellipsis
    const range: (number | "…")[] = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | "…")[] = [1];
        if (page > 3) pages.push("…");
        for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) pages.push(p);
        if (page < totalPages - 2) pages.push("…");
        pages.push(totalPages);
        return pages;
    }, [page, totalPages]);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-3.5 dark:border-white/[0.05]">
            <p className="text-xs text-gray-400 dark:text-gray-500">
                {total === 0 ? "No results" : `Showing ${from}–${to} of ${total} entries`}
            </p>

            <div className="flex items-center gap-1">
                {/* First */}
                <button
                    onClick={() => onPage(1)}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                    title="First page"
                >
                    <ChevronsLeft size={14} />
                </button>

                {/* Previous */}
                <button
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                    title="Previous page"
                >
                    <ChevronLeft size={14} />
                </button>

                {/* Page numbers */}
                {range.map((p, i) =>
                    p === "…" ? (
                        <span key={`ell-${i}`} className="flex h-8 w-8 items-center justify-center text-xs text-gray-400">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPage(p as number)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${p === page
                                    ? "bg-brand-500 text-white shadow-sm"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onPage(page + 1)}
                    disabled={page >= totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                    title="Next page"
                >
                    <ChevronRight size={14} />
                </button>

                {/* Last */}
                <button
                    onClick={() => onPage(totalPages)}
                    disabled={page >= totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                    title="Last page"
                >
                    <ChevronsRight size={14} />
                </button>
            </div>

            {/* Page size picker */}
            {onPageSize && (
                <select
                    value={pageSize}
                    onChange={(e) => onPageSize(Number(e.target.value))}
                    className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-600 outline-none focus:border-brand-500 dark:border-white/[0.08] dark:bg-gray-900 dark:text-gray-300"
                >
                    {[10, 20, 50, 100].map((s) => (
                        <option key={s} value={s}>{s} / page</option>
                    ))}
                </select>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
    const {
        columns,
        filters = [],
        rowKey,
        emptyText = "No records found.",
        loadingText = "Loading…",
        showRowNumbers = false,
        className = "",
        onRowClick,
    } = props;

    // ── Filter state ─────────────────────────────────────────
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [stagedFilters, setStagedFilters] = useState<Record<string, string>>({});

    const handleFilterChange = useCallback((key: string, value: string) => {
        setStagedFilters((prev) => ({ ...prev, [key]: value }));
        // For client-side or search inputs: apply immediately
        if (props.mode !== "server" || filters.find((f) => f.key === key)?.type === "search") {
            setFilterValues((prev) => ({ ...prev, [key]: value }));
        }
    }, [props.mode, filters]);

    const applyFilters = useCallback(() => {
        setFilterValues(stagedFilters);
        if (props.mode === "server" && props.onFilterChange) {
            props.onFilterChange(stagedFilters);
        }
    }, [stagedFilters, props]);

    const resetFilters = useCallback(() => {
        setStagedFilters({});
        setFilterValues({});
        if (props.mode === "server" && props.onFilterChange) {
            props.onFilterChange({});
        }
    }, [props]);

    // ── Client-side sort + pagination ────────────────────────
    const [clientSort, setClientSort] = useState<SortState>({ field: null, order: null });
    const [clientPage, setClientPage] = useState(1);
    const [clientPageSize, setClientPageSize] = useState(
        props.mode !== "server" ? (props.defaultPageSize ?? 10) : 10
    );

    const isServer = props.mode === "server";

    // Active sort / pagination values
    const activeSort: SortState = isServer ? props.sort : clientSort;

    // ── Client-side data processing ──────────────────────────
    const processedData = useMemo(() => {
        if (isServer) return props.data;

        let rows = [...props.data];

        // Filter
        if (Object.keys(filterValues).length > 0) {
            rows = rows.filter((row) =>
                Object.entries(filterValues).every(([key, val]) => {
                    if (!val) return true;
                    const cell = String(getNestedValue(row, key) ?? "").toLowerCase();
                    return cell.includes(val.toLowerCase());
                })
            );
        }

        // Sort
        if (clientSort.field && clientSort.order) {
            const { field, order } = clientSort;
            rows.sort((a, b) => {
                const av = getNestedValue(a, field);
                const bv = getNestedValue(b, field);
                const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
                return order === "asc" ? cmp : -cmp;
            });
        }

        return rows;
    }, [isServer, props.data, filterValues, clientSort]);

    const clientTotal = processedData.length;
    const pagedData = useMemo(() => {
        if (isServer) return props.data;
        const start = (clientPage - 1) * clientPageSize;
        return processedData.slice(start, start + clientPageSize);
    }, [isServer, processedData, clientPage, clientPageSize, props.data]);

    // Pagination values
    const activePage = isServer ? props.pagination.page : clientPage;
    const activePageSize = isServer ? props.pagination.pageSize : clientPageSize;
    const activeTotal = isServer ? props.pagination.total : clientTotal;

    // ── Sort handler ──────────────────────────────────────────
    const handleSort = useCallback((field: string) => {
        if (isServer) {
            const newOrder: SortOrder =
                props.sort.field === field
                    ? props.sort.order === "asc" ? "desc" : props.sort.order === "desc" ? null : "asc"
                    : "asc";
            props.onSortChange({ field: newOrder ? field : null, order: newOrder });
        } else {
            setClientSort((prev) => {
                const newOrder: SortOrder =
                    prev.field === field
                        ? prev.order === "asc" ? "desc" : prev.order === "desc" ? null : "asc"
                        : "asc";
                return { field: newOrder ? field : null, order: newOrder };
            });
            setClientPage(1);
        }
    }, [isServer, props]);

    // ── Page handler ──────────────────────────────────────────
    const handlePage = useCallback((page: number) => {
        if (isServer) {
            props.onPageChange(page, props.pagination.pageSize);
        } else {
            setClientPage(page);
        }
    }, [isServer, props]);

    const handlePageSize = useCallback((size: number) => {
        if (isServer) {
            props.onPageChange(1, size);
        } else {
            setClientPageSize(size);
            setClientPage(1);
        }
    }, [isServer, props]);

    const displayData = isServer ? props.data : pagedData;
    const isLoading = props.loading;

    return (
        <div className={`space-y-4 ${className}`}>

            {/* Filters */}
            {filters.length > 0 && (
                <FilterBar
                    filters={filters}
                    values={stagedFilters}
                    onChange={handleFilterChange}
                    onApply={isServer ? applyFilters : undefined}
                    onReset={resetFilters}
                    serverSide={isServer}
                />
            )}

            {/* Table card */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="overflow-x-auto">
                    <table className="min-w-full">

                        {/* Header */}
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                                {showRowNumbers && (
                                    <th className="w-10 px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                        #
                                    </th>
                                )}
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                        className={[
                                            "px-5 py-3.5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500",
                                            col.sortable ? "cursor-pointer select-none hover:text-gray-600 dark:hover:text-gray-300 transition-colors" : "",
                                            col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left",
                                            col.width ?? "",
                                            col.hideOnMobile ? "hidden sm:table-cell" : "",
                                        ].join(" ")}
                                    >
                                        {col.sortable ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                {col.label}
                                                <SortIcon field={col.key} sort={activeSort} />
                                            </span>
                                        ) : col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length + (showRowNumbers ? 1 : 0)}>
                                        <Skeleton />
                                        <p className="pb-4 text-center text-sm text-gray-400">{loadingText}</p>
                                    </td>
                                </tr>
                            ) : displayData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (showRowNumbers ? 1 : 0)}
                                        className="px-5 py-16 text-center text-sm text-gray-400"
                                    >
                                        {emptyText}
                                    </td>
                                </tr>
                            ) : (
                                displayData.map((row, idx) => {
                                    const key = rowKey ? rowKey(row) : idx;
                                    const globalIdx = (activePage - 1) * activePageSize + idx + 1;
                                    return (
                                        <tr
                                            key={key}
                                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                                            className={[
                                                "border-b border-gray-100 last:border-0 transition dark:border-white/[0.05]",
                                                "hover:bg-gray-50 dark:hover:bg-white/[0.02]",
                                                onRowClick ? "cursor-pointer" : "",
                                            ].join(" ")}
                                        >
                                            {showRowNumbers && (
                                                <td className="px-5 py-4 text-sm text-gray-400">{globalIdx}</td>
                                            )}
                                            {columns.map((col) => (
                                                <td
                                                    key={col.key}
                                                    className={[
                                                        "px-5 py-4 text-sm text-gray-700 dark:text-gray-300",
                                                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "",
                                                        col.hideOnMobile ? "hidden sm:table-cell" : "",
                                                    ].join(" ")}
                                                >
                                                    {col.render
                                                        ? col.render(row, idx)
                                                        : (getNestedValue(row, col.key) ?? "—")}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && (
                    <PaginationBar
                        page={activePage}
                        pageSize={activePageSize}
                        total={activeTotal}
                        onPage={handlePage}
                        onPageSize={handlePageSize}
                    />
                )}
            </div>
        </div>
    );
}