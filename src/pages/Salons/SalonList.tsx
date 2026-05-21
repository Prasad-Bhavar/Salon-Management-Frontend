import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Plus, Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

import { useSalons } from "./useSalons";

export default function SalonList() {

    const navigate = useNavigate();

    const {
        salons,
        loading,
        total,
        tableState,

        filters,

        actions,
    } = useSalons();

    //
    // OPTIONS
    //

    const statusOptions = [
        {
            label: "Active",
            value: "active",
        },
        {
            label: "Inactive",
            value: "inactive",
        },
        {
            label: "Pending",
            value: "pending",
        },
        {
            label: "Blocked",
            value: "blocked",
        },
    ];

    const salonTypeOptions = [
        {
            label: "Male",
            value: "male",
        },
        {
            label: "Female",
            value: "female",
        },
        {
            label: "Unisex",
            value: "unisex",
        },
    ];

    //
    // STATUS UI
    //

    const getStatusClass = (status: string) => {

        switch (status) {

            case "active":
                return "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400";

            case "inactive":
                return "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400";

            case "pending":
                return "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400";

            case "blocked":
                return "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400";

            default:
                return "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300";
        }
    };

    //
    // SORTING
    //

    const handleSort = (field: string) => {

        actions.handleSort({
            sortField: field,

            sortOrder:
                tableState.sortField === field
                    ? tableState.sortOrder === 1
                        ? -1
                        : 1
                    : 1,
        });
    };

    //
    // PAGINATION
    //

    const totalPages = Math.ceil(
        total / tableState.rows
    );

    return (

        <div className="space-y-6">

            {/*
                HEADER
            */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Salon Management
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage salons, owners and revenue analytics
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/salons/create")
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                >
                    <Plus size={18} />

                    Add Salon
                </button>
            </div>

            {/*
                FILTERS
            */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                    {/*
                        SEARCH
                    */}

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search salons..."
                            value={filters.searchInput}
                            onChange={(e) =>
                                filters.setSearchInput(
                                    e.target.value
                                )
                            }
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-transparent dark:text-white/90"
                        />
                    </div>

                    {/*
                        STATUS
                    */}

                    <select
                        value={filters.stagedStatus}
                        onChange={(e) =>
                            filters.setStagedStatus(
                                e.target.value as any
                            )
                        }
                        className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                    >

                        <option value="" className="bg-gray-100 dark:bg-gray-800 dark:text-white/90">
                            All Status
                        </option>

                        {
                            statusOptions.map((item) => (

                                <option
                                    key={item.value}
                                    value={item.value}
                                    className="bg-gray-100 dark:bg-gray-800 dark:text-white/90"
                                >
                                    {item.label}
                                </option>
                            ))
                        }
                    </select>

                    {/*
                        SALON TYPE
                    */}

                    <select
                        value={filters.stagedSalonType}
                        onChange={(e) =>
                            filters.setStagedSalonType(
                                e.target.value as any
                            )
                        }
                        className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                    >

                        <option value="" className="bg-gray-100 dark:bg-gray-800 dark:text-white/90">
                            All Salon Types
                        </option>

                        {
                            salonTypeOptions.map((item) => (

                                <option
                                    key={item.value}
                                    value={item.value}
                                    className="bg-gray-100 dark:bg-gray-800 dark:text-white/90"
                                >
                                    {item.label}
                                </option>
                            ))
                        }
                    </select>

                    {/*
                        ACTIONS
                    */}

                    <div className="flex gap-2">

                        <button
                            onClick={
                                actions.applyFilters
                            }
                            className="inline-flex flex-1 items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                        >
                            Apply
                        </button>

                        <button
                            onClick={
                                actions.resetFilters
                            }
                            className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/*
                TABLE
            */}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="border-b border-gray-100 dark:border-white/[0.05]">

                            <tr>

                                {
                                    [
                                        {
                                            label: "Salon Name",
                                            field: "name",
                                        },
                                        {
                                            label: "Owner",
                                            field: "owner.name",
                                        },
                                        {
                                            label: "Email",
                                            field: "email",
                                        },
                                        {
                                            label: "Salon Type",
                                            field: "salon_type",
                                        },
                                        {
                                            label: "Status",
                                            field: "status",
                                        },
                                        {
                                            label: "Total Revenue",
                                            field: "total_revenue",
                                        },
                                        {
                                            label: "Net Revenue",
                                            field: "net_revenue",
                                        },
                                        {
                                            label: "Created At",
                                            field: "created_at",
                                        },
                                    ].map((column) => (

                                        <th
                                            key={column.field}
                                            onClick={() =>
                                                handleSort(
                                                    column.field
                                                )
                                            }
                                            className="cursor-pointer px-5 py-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                        >

                                            <div className="flex items-center gap-2">

                                                {column.label}

                                                <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                    ))
                                }

                                <th className="px-5 py-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                loading ? (

                                    <tr>

                                        <td
                                            colSpan={9}
                                            className="px-5 py-10 text-center text-sm text-gray-500"
                                        >
                                            Loading salons...
                                        </td>
                                    </tr>

                                ) : salons.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={9}
                                            className="px-5 py-10 text-center text-sm text-gray-500"
                                        >
                                            No salons found
                                        </td>
                                    </tr>

                                ) : (

                                    salons.map((salon: any) => (

                                        <tr
                                            key={salon.id}
                                            className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-white/[0.05] dark:hover:bg-white/[0.02]"
                                        >

                                            <td className="px-5 py-4">

                                                <div>

                                                    <p className="font-medium text-gray-800 dark:text-white/90">
                                                        {salon.name}
                                                    </p>

                                                    <p className="text-theme-xs text-gray-500">
                                                        {salon.contact_number}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                {
                                                    salon.owner?.name || "-"
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                {salon.email}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span className="capitalize text-sm text-gray-700 dark:text-gray-300">
                                                    {salon.salon_type}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                                                        salon.status
                                                    )}`}
                                                >
                                                    {salon.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">

                                                ₹
                                                {Number(
                                                    salon.total_revenue || 0
                                                ).toLocaleString()}
                                            </td>

                                            <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">

                                                ₹
                                                {Number(
                                                    salon.net_revenue || 0
                                                ).toLocaleString()}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">

                                                {
                                                    new Date(
                                                        salon.created_at
                                                    ).toLocaleDateString()
                                                }
                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2">

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/salons/view/${salon.id}`
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/salons/edit/${salon.id}`
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>
                    </table>
                </div>

                {/*
                    PAGINATION
                */}

                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">

                    <p className="text-sm text-gray-500 dark:text-gray-400">

                        Showing page
                        {" "}
                        {tableState.page}
                        {" "}
                        of
                        {" "}
                        {totalPages}
                    </p>

                    <div className="flex items-center gap-2">

                        <button
                            disabled={tableState.page === 1}
                            onClick={() =>
                                actions.handlePage({
                                    page:
                                        tableState.page - 2,

                                    first:
                                        (tableState.page - 2) *
                                        tableState.rows,

                                    rows:
                                        tableState.rows,
                                })
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            disabled={
                                tableState.page >= totalPages
                            }
                            onClick={() =>
                                actions.handlePage({
                                    page:
                                        tableState.page,

                                    first:
                                        tableState.page *
                                        tableState.rows,

                                    rows:
                                        tableState.rows,
                                })
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}