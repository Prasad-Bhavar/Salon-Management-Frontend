import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Plus } from "lucide-react";
import { useSalons } from "./useSalons";
import DataTable, { ColumnDef, FilterDef, SortState } from "~/components/DataTable";

// ── Status badge ──────────────────────────────────────────────
const STATUS_CLASSES: Record<string, string> = {
    active: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",
    inactive: "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
    pending: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
    blocked: "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function SalonList() {
    const navigate = useNavigate();
    const { salons, loading, total, tableState, filters: salonFilters, actions } = useSalons();

    // ── Column definitions ────────────────────────────────────
    const columns: ColumnDef[] = [
        {
            key: "name",
            label: "Salon Name",
            sortable: true,
            render: (salon) => (
                <div>
                    <p className="font-medium text-gray-800 dark:text-white/90">{salon.name}</p>
                    <p className="text-xs text-gray-500">{salon.contact_number}</p>
                </div>
            ),
        },
        {
            key: "owner.name",
            label: "Owner",
            sortable: true,
            render: (salon) => salon.owner?.name || "—",
        },
        {
            key: "email",
            label: "Email",
            sortable: true,
            hideOnMobile: true,
        },
        {
            key: "salon_type",
            label: "Salon Type",
            sortable: true,
            render: (salon) => <span className="capitalize">{salon.salon_type}</span>,
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (salon) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_CLASSES[salon.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {salon.status}
                </span>
            ),
        },
        {
            key: "total_revenue",
            label: "Total Revenue",
            sortable: true,
            align: "right",
            render: (salon) => (
                <span className="font-medium text-gray-800 dark:text-white/90">
                    ₹{Number(salon.total_revenue || 0).toLocaleString()}
                </span>
            ),
        },
        {
            key: "net_revenue",
            label: "Net Revenue",
            sortable: true,
            align: "right",
            render: (salon) => (
                <span className="font-medium text-gray-800 dark:text-white/90">
                    ₹{Number(salon.net_revenue || 0).toLocaleString()}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Created At",
            sortable: true,
            hideOnMobile: true,
            render: (salon) => new Date(salon.created_at).toLocaleDateString(),
        },
        {
            key: "_actions",
            label: "Actions",
            render: (salon) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/salons/view/${salon.id}`); }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/salons/edit/${salon.id}`); }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                    >
                        <Pencil size={18} />
                    </button>
                </div>
            ),
        },
    ];

    // ── Filter definitions ────────────────────────────────────
    const filters: FilterDef[] = [
        {
            key: "search",
            type: "search",
            placeholder: "Search salons…",
        },
        {
            key: "status",
            type: "select",
            placeholder: "All Status",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Pending", value: "pending" },
                { label: "Blocked", value: "blocked" },
            ],
        },
        {
            key: "salon_type",
            type: "select",
            placeholder: "All Salon Types",
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Unisex", value: "unisex" },
            ],
        },
    ];

    // ── Bridge DataTable sort to useSalons ────────────────────
    const activeSort: SortState = {
        field: tableState.sortField ?? null,
        order: tableState.sortOrder === 1 ? "asc" : tableState.sortOrder === -1 ? "desc" : null,
    };

    const handleSortChange = (sort: SortState) => {
        actions.handleSort({
            sortField: sort.field ?? "name",
            sortOrder: sort.order === "asc" ? 1 : -1,
        });
    };

    const handlePageChange = (page: number, pageSize: number) => {
        actions.handlePage({
            page: page - 1,
            first: (page - 1) * pageSize,
            rows: pageSize,
        });
    };

    const handleFilterChange = (values: Record<string, string>) => {
        salonFilters.setSearchInput(values.search ?? "");
        salonFilters.setStagedStatus(values.status as any ?? "");
        salonFilters.setStagedSalonType(values.salon_type as any ?? "");
        actions.applyFilters();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Salon Management</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage salons, owners and revenue analytics</p>
                </div>
                <button
                    onClick={() => navigate("/salons/create")}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                >
                    <Plus size={18} />
                    Add Salon
                </button>
            </div>

            {/* DataTable (server-side) */}
            <DataTable
                mode="server"
                data={salons}
                loading={loading}
                columns={columns}
                filters={filters}
                rowKey={(s) => s.id}
                pagination={{ page: tableState.page, pageSize: tableState.rows, total }}
                sort={activeSort}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
                emptyText="No salons found."
                loadingText="Loading salons…"
            />
        </div>
    );
}