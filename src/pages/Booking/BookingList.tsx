import {
    Eye,
    Search,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useBookings,
} from "./useBookings";

export default function BookingList() {

    const navigate =
        useNavigate();

    const {

        bookings,

        loading,

        total,

        tableState,

        filters,

        actions,

    } = useBookings();

    //
    // STATUS STYLE
    //

    return (

        <div className="space-y-6">

            {/*
                PAGE HEADER
            */}

            <div>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">

                    Booking Management
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                    Manage all salon bookings in one place
                </p>
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
                            strokeWidth={2}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={
                                filters.searchInput
                            }
                            onChange={(e) =>
                                filters.setSearchInput(
                                    e.target.value
                                )
                            }
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                        />
                    </div>

                    {/*
                        STATUS FILTER
                    */}

                    <select
                        value={
                            filters.stagedStatus
                        }
                        onChange={(e) =>
                            filters.setStagedStatus(
                                e.target.value
                            )
                        }
                        className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="confirmed">
                            Confirmed
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>

                    {/*
                        ACTION BUTTONS
                    */}

                    <div className="flex gap-2">

                        <button
                            onClick={
                                actions.applyFilters
                            }
                            className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
                        >
                            Apply
                        </button>

                        <button
                            onClick={
                                actions.resetFilters
                            }
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
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

                        {/*
                            HEADER
                        */}

                        <thead className="border-b border-gray-100 dark:border-white/[0.05]">

                            <tr>

                                <th
                                    onClick={() =>
                                        actions.handleSort(
                                            "booking.id"
                                        )
                                    }
                                    className="cursor-pointer px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                >
                                    #
                                </th>

                                <th
                                    onClick={() =>
                                        actions.handleSort(
                                            "customer.name"
                                        )
                                    }
                                    className="cursor-pointer px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                >
                                    Customer
                                </th>

                                <th
                                    onClick={() =>
                                        actions.handleSort(
                                            "salon.name"
                                        )
                                    }
                                    className="cursor-pointer px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                >
                                    Salon
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">

                                    Services
                                </th>

                                <th
                                    onClick={() =>
                                        actions.handleSort(
                                            "booking.created_at"
                                        )
                                    }
                                    className="cursor-pointer px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                >
                                    Date
                                </th>

                                <th
                                    onClick={() =>
                                        actions.handleSort(
                                            "booking.status"
                                        )
                                    }
                                    className="cursor-pointer px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                >
                                    Status
                                </th>

                                <th
                                    onClick={() =>
                                        actions.handleSort(
                                            "booking.total_price"
                                        )
                                    }
                                    className="cursor-pointer px-5 py-4 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                >
                                    Amount
                                </th>

                                <th className="px-5 py-4 text-center text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">

                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/*
                            BODY
                        */}

                        <tbody>

                            {
                                loading ? (

                                    <tr>

                                        <td
                                            colSpan={8}
                                            className="px-5 py-20 text-center text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            Loading bookings...
                                        </td>
                                    </tr>

                                ) : bookings.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={8}
                                            className="px-5 py-20 text-center text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            No bookings found
                                        </td>
                                    </tr>

                                ) : (

                                    bookings.map(
                                        (booking: any) => (

                                            <tr
                                                key={
                                                    booking.id
                                                }
                                                className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-white/[0.05] dark:hover:bg-white/[0.02]"
                                            >

                                                {/*
                                                    ID
                                                */}

                                                <td className="px-5 py-4">

                                                    <span className="font-medium text-gray-700 dark:text-gray-300">

                                                        #
                                                        {
                                                            booking.id
                                                        }
                                                    </span>
                                                </td>

                                                {/*
                                                    CUSTOMER
                                                */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">

                                                            {
                                                                booking.customer?.name?.charAt(
                                                                    0
                                                                )
                                                            }
                                                        </div>

                                                        <div>

                                                            <p className="font-medium text-gray-800 dark:text-white/90">

                                                                {
                                                                    booking.customer?.name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">

                                                                {
                                                                    booking.customer?.contact1
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/*
                                                    SALON
                                                */}

                                                <td className="px-5 py-4">

                                                    <p className="font-medium text-gray-800 dark:text-white/90">

                                                        {
                                                            booking.salon?.name
                                                        }
                                                    </p>
                                                </td>

                                                {/*
                                                    SERVICES
                                                */}

                                                <td className="px-5 py-4">

                                                    <div className="max-w-[220px]">

                                                        <p className="truncate text-sm text-gray-700 dark:text-gray-300">

                                                            {
                                                                booking.booking_services
                                                                    ?.map(
                                                                        (
                                                                            item: any
                                                                        ) =>
                                                                            item
                                                                                .service
                                                                                ?.name
                                                                    )
                                                                    .join(
                                                                        ", "
                                                                    )
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                {/*
                                                    DATE
                                                */}

                                                <td className="px-5 py-4">

                                                    <div>

                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">

                                                            {
                                                                new Date(
                                                                    booking.created_at
                                                                ).toLocaleDateString()
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">

                                                            {
                                                                new Date(
                                                                    booking.created_at
                                                                ).toLocaleTimeString()
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                {/*
                                                    STATUS
                                                */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`
                                                            inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize
                                                            
                                                            ${booking.status ===
                                                                "completed"
                                                                ? "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400"

                                                                : booking.status ===
                                                                    "confirmed"
                                                                    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"

                                                                    : booking.status ===
                                                                        "cancelled"
                                                                        ? "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400"

                                                                        : "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400"
                                                            }
                                                        `}
                                                    >

                                                        {
                                                            booking.status
                                                        }
                                                    </span>
                                                </td>

                                                {/*
                                                    AMOUNT
                                                */}

                                                <td className="px-5 py-4 text-right">

                                                    <span className="font-semibold text-gray-800 dark:text-white/90">

                                                        ₹
                                                        {
                                                            Number(
                                                                booking.total_price
                                                            ).toLocaleString()
                                                        }
                                                    </span>
                                                </td>

                                                {/*
                                                    ACTIONS
                                                */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center justify-center">

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/bookings/view/${booking.id}`
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                                        >
                                                            <Eye
                                                                size={18}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
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
                        {
                            tableState.page
                        }
                        {" "}
                        of
                        {" "}
                        {
                            Math.ceil(
                                total /
                                tableState.rows
                            ) || 1
                        }
                    </p>

                    <div className="flex items-center gap-2">

                        <button
                            disabled={
                                tableState.page ===
                                1
                            }
                            onClick={() =>
                                actions.handlePage({

                                    page:
                                        tableState.page -
                                        2,

                                    first:
                                        (tableState.page -
                                            2) *
                                        tableState.rows,

                                    rows:
                                        tableState.rows,
                                })
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                        >
                            Previous
                        </button>

                        <button
                            disabled={
                                tableState.page >=
                                Math.ceil(
                                    total /
                                    tableState.rows
                                )
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
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}