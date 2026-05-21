import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    Pencil,
    Building2,
    User,
    Phone,
    Mail,
    MapPin,
    IndianRupee,
    CalendarDays,
} from "lucide-react";

import {
    getSalonById,
    Salon,
} from "./salons.service";

export default function SalonDetail() {

    const navigate = useNavigate();

    const { id } = useParams();

    //
    // STATES
    //

    const [loading, setLoading] =
        useState(false);

    const [salon, setSalon] =
        useState<Salon | null>(null);

    //
    // FETCH SALON
    //

    const fetchSalon = async () => {

        try {

            if (!id) return;

            setLoading(true);

            const res =
                await getSalonById(id);

            setSalon(res);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    //
    // INITIAL LOAD
    //

    useEffect(() => {

        fetchSalon();

    }, [id]);

    //
    // STATUS STYLE
    //

    const getStatusClass = (
        status?: string
    ) => {

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
                return "bg-gray-100 text-gray-700 dark:bg-white/[0.05] dark:text-gray-300";
        }
    };

    //
    // LOADING
    //

    if (loading) {

        return (

            <div className="flex h-[300px] items-center justify-center">

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading salon details...
                </p>
            </div>
        );
    }

    //
    // NO DATA
    //

    if (!salon) {

        return (

            <div className="flex h-[300px] items-center justify-center">

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Salon not found
                </p>
            </div>
        );
    }

    return (

        <div className="space-y-6">

            {/*
        PAGE HEADER
      */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">

                            {salon.name}
                        </h2>

                        <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                                salon.status
                            )}`}
                        >
                            {salon.status}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Complete salon overview and analytics
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <button
                        onClick={() =>
                            navigate("/salons")
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
                    >
                        <ArrowLeft size={18} />

                        Back
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                `/salons/edit/${salon.id}`
                            )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
                    >
                        <Pencil size={18} />

                        Edit Salon
                    </button>
                </div>
            </div>

            {/*
        BASIC INFO
      */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                    <div className="flex items-start gap-3">

                        <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-500/10">

                            <Building2
                                size={20}
                                className="text-brand-500"
                            />
                        </div>

                        <div>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Salon Type
                            </p>

                            <p className="mt-1 font-medium capitalize text-gray-800 dark:text-white/90">
                                {salon.salon_type}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">

                        <div className="rounded-lg bg-success-50 p-3 dark:bg-success-500/10">

                            <User
                                size={20}
                                className="text-success-500"
                            />
                        </div>

                        <div>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Owner
                            </p>

                            <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                                {
                                    salon.owner?.name || "-"
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">

                        <div className="rounded-lg bg-warning-50 p-3 dark:bg-warning-500/10">

                            <Phone
                                size={20}
                                className="text-warning-500"
                            />
                        </div>

                        <div>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Contact
                            </p>

                            <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                                {
                                    salon.contact_number || "-"
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">

                        <div className="rounded-lg bg-error-50 p-3 dark:bg-error-500/10">

                            <CalendarDays
                                size={20}
                                className="text-error-500"
                            />
                        </div>

                        <div>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Registered On
                            </p>

                            <p className="mt-1 font-medium text-gray-800 dark:text-white/90">

                                {
                                    salon.created_at
                                        ? new Date(
                                            salon.created_at
                                        ).toLocaleDateString()
                                        : "-"
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">

                    <div>

                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">

                            Salon Email
                        </p>

                        <div className="flex items-center gap-2">

                            <Mail
                                size={16}
                                className="text-gray-400"
                            />

                            <p className="font-medium text-gray-800 dark:text-white/90">
                                {salon.email || "-"}
                            </p>
                        </div>
                    </div>

                    <div>

                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">

                            Address
                        </p>

                        <div className="flex items-start gap-2">

                            <MapPin
                                size={16}
                                className="mt-1 text-gray-400"
                            />

                            <p className="font-medium text-gray-800 dark:text-white/90">

                                {
                                    salon.address?.line1
                                }
                                {" "}
                                {
                                    salon.address?.line2
                                }
                                ,
                                {" "}
                                {
                                    salon.address?.city
                                }
                                ,
                                {" "}
                                {
                                    salon.address?.state
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/*
        ANALYTICS
      */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total Revenue
                            </p>

                            <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">

                                ₹
                                {Number(
                                    salon.analytics?.total_revenue || 0
                                ).toLocaleString()}
                            </h3>
                        </div>

                        <div className="rounded-xl bg-success-50 p-3 dark:bg-success-500/10">

                            <IndianRupee
                                size={22}
                                className="text-success-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Net Revenue
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">

                        ₹
                        {Number(
                            salon.analytics?.net_revenue || 0
                        ).toLocaleString()}
                    </h3>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Bookings
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">

                        {
                            salon.analytics?.total_bookings || 0
                        }
                    </h3>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Barbers
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">

                        {
                            salon.analytics?.total_barbers || 0
                        }
                    </h3>
                </div>
            </div>

            {/*
        BANK DETAILS
      */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Bank Details
                </h3>

                {
                    salon.bank_details &&
                        salon.bank_details.length > 0 ? (

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                            <div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Account Holder Name
                                </p>

                                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">

                                    {
                                        salon.bank_details[0]
                                            .account_holder_name
                                    }
                                </p>
                            </div>

                            <div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Bank Name
                                </p>

                                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">

                                    {
                                        salon.bank_details[0]
                                            .bank_name
                                    }
                                </p>
                            </div>

                            <div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Account Number
                                </p>

                                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">

                                    ****
                                    {
                                        salon.bank_details[0]
                                            .account_number
                                            ?.toString()
                                            .slice(-4)
                                    }
                                </p>
                            </div>

                            <div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    IFSC Code
                                </p>

                                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">

                                    {
                                        salon.bank_details[0]
                                            .ifsc_code
                                    }
                                </p>
                            </div>

                            <div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    UPI ID
                                </p>

                                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">

                                    {
                                        salon.bank_details[0]
                                            .upi_id || "-"
                                    }
                                </p>
                            </div>
                        </div>

                    ) : (

                        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No bank details available
                            </p>
                        </div>
                    )
                }
            </div>

            {/* 
    RECENT BOOKINGS
*/}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                <div className="mb-6 flex items-center justify-between">

                    <div>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Recent Bookings
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Latest 5 bookings from this salon
                        </p>
                    </div>

                    <button
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                        View All
                    </button>
                </div>

                {
                    salon.recent_bookings &&
                        salon.recent_bookings.length > 0 ? (

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="border-b border-gray-100 dark:border-white/[0.05]">

                                    <tr>

                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Booking ID
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Customer
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Services
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Date & Time
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {
                                        salon.recent_bookings.map(
                                            (booking: any) => (

                                                <tr
                                                    key={booking.id}
                                                    className="border-b border-gray-100 dark:border-white/[0.05]"
                                                >

                                                    {/*
                                            BOOKING ID
                                        */}

                                                    <td className="px-4 py-4 text-sm font-medium text-brand-500">

                                                        #
                                                        {booking.id}
                                                    </td>

                                                    {/*
                                            CUSTOMER
                                        */}

                                                    <td className="px-4 py-4">

                                                        <div>

                                                            <p className="font-medium text-gray-800 dark:text-white/90">

                                                                {
                                                                    booking.customer?.name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">

                                                                {
                                                                    booking.customer?.email
                                                                }
                                                            </p>
                                                        </div>
                                                    </td>

                                                    {/*
                                            SERVICES
                                        */}

                                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">

                                                        {
                                                            booking.booking_services
                                                                ?.map(
                                                                    (item: any) =>
                                                                        item.service?.name
                                                                )
                                                                ?.join(", ")
                                                        }
                                                    </td>

                                                    {/*
                                            DATE
                                        */}

                                                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">

                                                        {
                                                            new Date(
                                                                booking.created_at
                                                            ).toLocaleString()
                                                        }
                                                    </td>

                                                    {/*
                                            STATUS
                                        */}

                                                    <td className="px-4 py-4">

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

                                                    <td className="px-4 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">

                                                        ₹
                                                        {
                                                            Number(
                                                                booking.total_price
                                                            ).toLocaleString()
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>

                    ) : (

                        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No recent bookings available
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}