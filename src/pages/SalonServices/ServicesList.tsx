import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Plus } from "lucide-react";
import { useOwnerServices } from "./useOwnerServices";
import DataTable, { ColumnDef, FilterDef } from "~/components/DataTable";
import StatsCards from "~/components/StatsCards";
import StatusBadge from "~/components/StatusBadge";

export default function ServicesList() {
    const navigate = useNavigate();
    const { services, stats } = useOwnerServices();

    // ── Column definitions ────────────────────────────────────
    const columns: ColumnDef[] = [
        {
            key: "service.name",
            label: "Service",
            sortable: true,
            render: (item) => (
                <p className="font-medium text-gray-800 dark:text-white/90">{item.service?.name}</p>
            ),
        },
        {
            key: "service.category.name",
            label: "Category",
            sortable: true,
            render: (item) => item.service?.category?.name ?? "—",
        },
        {
            key: "price",
            label: "Price",
            sortable: true,
            render: (item) => `₹${item.price}`,
        },
        {
            key: "duration",
            label: "Duration",
            sortable: true,
            render: (item) => `${item.duration} mins`,
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (item) => <StatusBadge status={item.status} />,
        },
        {
            key: "_actions",
            label: "Actions",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/salon-services/view/${item.id}`); }}
                        className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/salon-services/edit/${item.id}`); }}
                        className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                    >
                        <Pencil size={16} />
                    </button>
                </div>
            ),
        },
    ];

    // ── Filter definitions ────────────────────────────────────
    const filters: FilterDef[] = [
        {
            key: "service.name",
            type: "search",
            placeholder: "Search services…",
        },
        {
            key: "status",
            type: "select",
            placeholder: "All Status",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Services & Pricing</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage salon services, pricing and duration.</p>
                </div>
                <button
                    onClick={() => navigate("/salon-services/create")}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
                >
                    <Plus size={18} />
                    Add Service
                </button>
            </div>

            <StatsCards stats={stats} />

            {/* DataTable (client-side — services list is typically small) */}
            <DataTable
                mode="client"
                data={services}
                columns={columns}
                filters={filters}
                rowKey={(item) => item.id}
                emptyText="No services found."
            />
        </div>
    );
}