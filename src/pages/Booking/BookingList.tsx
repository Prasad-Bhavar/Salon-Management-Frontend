import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { useBookings } from "./useBookings";
import DataTable, { ColumnDef, FilterDef, SortState } from "~/components/DataTable";

// ── Status badge ──────────────────────────────────────────────
const STATUS_CLASSES: Record<string, string> = {
    completed: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",
    confirmed: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
    cancelled: "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
    pending: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
};

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_CLASSES[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function BookingList() {
    const navigate = useNavigate();
    const { bookings, loading, total, tableState, filters: bookingFilters, actions } = useBookings();

    // ── Column definitions ────────────────────────────────────
    const columns: ColumnDef[] = [
        {
            key: "id",
            label: "#",
            sortable: true,
            render: (b) => <span className="font-medium text-gray-700 dark:text-gray-300">#{b.id}</span>,
        },
        {
            key: "customer.name",
            label: "Customer",
            sortable: true,
            render: (b) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                        {b.customer?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-800 dark:text-white/90">{b.customer?.name}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{b.customer?.contact1}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "salon.name",
            label: "Salon",
            sortable: true,
            render: (b) => <p className="font-medium text-gray-800 dark:text-white/90">{b.salon?.name}</p>,
        },
        {
            key: "booking_services",
            label: "Services",
            render: (b) => (
                <div className="max-w-[220px]">
                    <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                        {b.booking_services?.map((item: any) => item.service?.name).join(", ")}
                    </p>
                </div>
            ),
        },
        {
            key: "created_at",
            label: "Date",
            sortable: true,
            render: (b) => (
                <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {new Date(b.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {new Date(b.created_at).toLocaleTimeString()}
                    </p>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (b) => <StatusBadge status={b.status} />,
        },
        {
            key: "total_price",
            label: "Amount",
            sortable: true,
            align: "right",
            render: (b) => (
                <span className="font-semibold text-gray-800 dark:text-white/90">
                    ₹{Number(b.total_price).toLocaleString()}
                </span>
            ),
        },
        {
            key: "_actions",
            label: "Actions",
            align: "center",
            render: (b) => (
                <div className="flex items-center justify-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/bookings/view/${b.id}`); }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                    >
                        <Eye size={18} />
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
            placeholder: "Search bookings…",
        },
        {
            key: "status",
            type: "select",
            placeholder: "All Status",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
            ],
        },
    ];

    // ── Bridge DataTable sort to useBookings ──────────────────
    const activeSort = {
        field: tableState.sortField ?? null,
        order: tableState.sortOrder === 1 ? "asc" as const : tableState.sortOrder === -1 ? "desc" as const : null,
    };

    const handleSortChange = (sort: SortState) => {
        actions.handleSort(sort.field ?? "booking.id");
    };

    const handlePageChange = (page: number, pageSize: number) => {
        actions.handlePage({
            page: page - 1,
            first: (page - 1) * pageSize,
            rows: pageSize,
        });
    };

    const handleFilterChange = (values: Record<string, string>) => {
        bookingFilters.setSearchInput(values.search ?? "");
        bookingFilters.setStagedStatus(values.status ?? "");
        actions.applyFilters();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Booking Management</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage all salon bookings in one place</p>
            </div>

            {/* DataTable (server-side) */}
            <DataTable
                mode="server"
                data={bookings}
                loading={loading}
                columns={columns}
                filters={filters}
                rowKey={(b) => b.id}
                pagination={{ page: tableState.page, pageSize: tableState.rows, total }}
                sort={activeSort}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
                emptyText="No bookings found."
                loadingText="Loading bookings…"
            />
        </div>
    );
}