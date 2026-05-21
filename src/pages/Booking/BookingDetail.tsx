import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    CreditCard,
    Scissors,
    Store,
    User,
} from "lucide-react";

import {
    getBookingById,
} from "./bookings.service";

export default function BookingDetail() {

    const navigate =
        useNavigate();

    const { id } =
        useParams();

    //
    // STATES
    //

    const [booking, setBooking] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(false);

    //
    // FETCH BOOKING
    //

    const fetchBooking =
        async () => {

            try {

                if (!id) return;

                setLoading(true);

                const res =
                    await getBookingById(
                        id
                    );

                setBooking(
                    res
                );

            } catch (error) {

                console.error(
                    error
                );

            } finally {

                setLoading(
                    false
                );
            }
        };

    useEffect(() => {

        fetchBooking();

    }, [id]);

    //
    // STATUS STYLE
    //

    const getStatusClass = (
        status: string
    ) => {

        switch (status) {

            case "completed":

                return "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400";

            case "confirmed":

                return "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400";

            case "cancelled":

                return "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400";

            default:

                return "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400";
        }
    };

    //
    // LOADING
    //

    if (loading) {

        return (

            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">

                <p className="text-sm text-gray-500 dark:text-gray-400">

                    Loading booking details...
                </p>
            </div>
        );
    }

    //
    // NO DATA
    //

    if (!booking) {

        return (

            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">

                <p className="text-sm text-gray-500 dark:text-gray-400">

                    Booking not found
                </p>
            </div>
        );
    }

    //
    // PAYMENT
    //

    const payment =
        booking.payments?.[0];

    return (

        <div className="space-y-6">

            {/*
                PAGE HEADER
            */}

            <div className="flex items-start justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">

                            Booking Detail
                        </h2>

                        <span className="inline-flex rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-400">

                            {
                                booking.status
                            }
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">

                        Complete booking overview and details
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate(
                            "/bookings"
                        )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
                >

                    <ArrowLeft
                        size={18}
                    />

                    Back
                </button>
            </div>

            {/*
                MAIN CARD
            */}

            <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

                <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-3">

                    {/*
                        LEFT SECTION
                    */}

                    <div className="space-y-8">

                        {/*
                            CUSTOMER
                        */}

                        <div>

                            <div className="mb-5 flex items-center gap-2">

                                <User
                                    size={18}
                                    className="text-brand-500"
                                />

                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">

                                    Customer Information
                                </h3>
                            </div>

                            <div className="flex items-center gap-4">

                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">

                                    {
                                        booking.customer?.name?.charAt(
                                            0
                                        )
                                    }
                                </div>

                                <div>

                                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">

                                        {
                                            booking.customer?.name
                                        }
                                    </h4>

                                    <p className="mt-1 text-sm text-gray-500">

                                        {
                                            booking.customer?.contact1
                                        }
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">

                                        {
                                            booking.customer?.email
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/*
                            BOOKING INFO
                        */}

                        <div>

                            <div className="mb-5 flex items-center gap-2">

                                <CalendarDays
                                    size={18}
                                    className="text-brand-500"
                                />

                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">

                                    Booking Information
                                </h3>
                            </div>

                            <div className="space-y-4">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-gray-500">

                                        Booking ID
                                    </span>

                                    <span className="font-medium text-gray-800 dark:text-white/90">

                                        #
                                        {
                                            booking.id
                                        }
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-gray-500">

                                        Booking Date
                                    </span>

                                    <span className="font-medium text-gray-800 dark:text-white/90">

                                        {
                                            new Date(
                                                booking.created_at
                                            ).toLocaleString()
                                        }
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-gray-500">

                                        Booking Status
                                    </span>

                                    <span
                                        className={`
                                            inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize
                                            ${getStatusClass(
                                            booking.status
                                        )}
                                        `}
                                    >

                                        {
                                            booking.status
                                        }
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-gray-500">

                                        Payment Status
                                    </span>

                                    <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-400">

                                        {
                                            payment?.transaction_status ||
                                            "Pending"
                                        }
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-gray-500">

                                        Payment Method
                                    </span>

                                    <span className="font-medium text-gray-800 dark:text-white/90">

                                        {
                                            payment?.payment_method ||
                                            "-"
                                        }
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-gray-500">

                                        Total Amount
                                    </span>

                                    <span className="text-lg font-semibold text-gray-800 dark:text-white/90">

                                        ₹
                                        {
                                            Number(
                                                booking.total_price
                                            ).toLocaleString()
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*
                        CENTER SECTION
                    */}

                    <div className="space-y-8 border-t border-gray-100 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-white/[0.05]">

                        {/*
                            SALON INFO
                        */}

                        <div>

                            <div className="mb-5 flex items-center gap-2">

                                <Store
                                    size={18}
                                    className="text-brand-500"
                                />

                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">

                                    Salon Information
                                </h3>
                            </div>

                            <div className="flex gap-4">

                                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-2xl font-semibold text-gray-700 dark:bg-white/[0.05] dark:text-white">

                                    {
                                        booking.salon?.name?.charAt(
                                            0
                                        )
                                    }
                                </div>

                                <div>

                                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">

                                        {
                                            booking.salon?.name
                                        }
                                    </h4>

                                    <p className="mt-2 text-sm text-gray-500">

                                        {
                                            booking.salon?.address?.line1
                                        }
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">

                                        {
                                            booking.salon?.address?.city
                                        }
                                        ,
                                        {" "}
                                        {
                                            booking.salon?.address?.state
                                        }
                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">

                                        {
                                            booking.salon?.contact_number
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/*
                            BARBER INFO
                        */}

                        <div>

                            <div className="mb-5 flex items-center gap-2">

                                <Scissors
                                    size={18}
                                    className="text-brand-500"
                                />

                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">

                                    Staff Information
                                </h3>
                            </div>

                            {
                                booking.preferred_barber ? (

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">

                                            {
                                                booking.preferred_barber
                                                    ?.user?.name?.charAt(
                                                        0
                                                    )
                                            }
                                        </div>

                                        <div>

                                            <h4 className="font-semibold text-gray-800 dark:text-white/90">

                                                {
                                                    booking.preferred_barber
                                                        ?.user?.name
                                                }
                                            </h4>

                                            <p className="mt-1 text-sm text-gray-500">

                                                {
                                                    booking.preferred_barber
                                                        ?.specialization ||
                                                    "Salon Staff"
                                                }
                                            </p>
                                        </div>
                                    </div>

                                ) : (

                                    <p className="text-sm text-gray-500">

                                        No barber selected
                                    </p>
                                )
                            }
                        </div>
                    </div>

                    {/*
                        RIGHT SECTION
                    */}

                    <div className="space-y-8 border-t border-gray-100 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-white/[0.05]">

                        {/*
                            SERVICES
                        */}

                        <div>

                            <div className="mb-5 flex items-center gap-2">

                                <CreditCard
                                    size={18}
                                    className="text-brand-500"
                                />

                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">

                                    Services
                                </h3>
                            </div>

                            <div className="space-y-4">

                                {
                                    booking.booking_services?.map(
                                        (
                                            item: any
                                        ) => (

                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="flex items-center justify-between"
                                            >

                                                <div>

                                                    <p className="font-medium text-gray-800 dark:text-white/90">

                                                        {
                                                            item
                                                                .service
                                                                ?.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">

                                                        {
                                                            item.duration
                                                        }
                                                        mins
                                                    </p>
                                                </div>

                                                <span className="font-semibold text-gray-800 dark:text-white/90">

                                                    ₹
                                                    {
                                                        Number(
                                                            item.price
                                                        ).toLocaleString()
                                                    }
                                                </span>
                                            </div>
                                        )
                                    )
                                }

                                <div className="border-t border-gray-100 pt-4 dark:border-white/[0.05]">

                                    <div className="flex items-center justify-between">

                                        <span className="font-semibold text-gray-800 dark:text-white/90">

                                            Total Amount
                                        </span>

                                        <span className="text-lg font-bold text-gray-900 dark:text-white">

                                            ₹
                                            {
                                                Number(
                                                    booking.total_price
                                                ).toLocaleString()
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*
                            BOOKING SLOT
                        */}

                        <div>

                            <div className="mb-5 flex items-center gap-2">

                                <CalendarDays
                                    size={18}
                                    className="text-brand-500"
                                />

                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">

                                    Booking Time
                                </h3>
                            </div>

                            <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10">

                                <p className="text-sm font-medium text-brand-700 dark:text-brand-400">

                                    {
                                        new Date(
                                            booking.created_at
                                        ).toLocaleDateString()
                                    }
                                </p>

                                <p className="mt-2 text-sm text-brand-700 dark:text-brand-400">

                                    {
                                        new Date(
                                            booking.created_at
                                        ).toLocaleTimeString()
                                    }
                                </p>
                            </div>
                        </div>

                        {/*
                            NOTES
                        */}

                        <div>

                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">

                                Notes
                            </h3>

                            <div className="rounded-xl border border-dashed border-gray-300 p-4 dark:border-gray-700">

                                <p className="text-sm text-gray-500 dark:text-gray-400">

                                    No special notes available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}