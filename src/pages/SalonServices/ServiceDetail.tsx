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
    Pencil,
} from "lucide-react";

import {
    getOwnerServiceById,
} from "./services.service";

import ServiceInfoCard from "./ServiceInfoCard";

import RecentBookingsTable from "./RecentBookingsTable";

export default function ServiceDetail() {

    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const [loading, setLoading] =
        useState(false);

    const [service, setService] =
        useState<any>(null);

    //
    // FETCH DETAIL
    //

    const fetchDetail =
        async () => {

            try {

                setLoading(true);

                const res =
                    await getOwnerServiceById(
                        id!
                    );

                setService(res);

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {
        fetchDetail();
    }, []);

    if (loading) {

        return (

            <div className="flex h-60 items-center justify-center">

                <p className="text-gray-500">
                    Loading...
                </p>
            </div>
        );
    }

    return (

        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <button
                        onClick={() =>
                            navigate(
                                "/salon-services"
                            )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300"
                    >
                        <ArrowLeft
                            size={18}
                        />
                    </button>

                    <div>

                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">

                            Service Detail
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                            Complete service information
                        </p>
                    </div>
                </div>

                <button
                    onClick={() =>
                        navigate(
                            `/salon-services/edit/${id}`
                        )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white hover:bg-brand-600"
                >
                    <Pencil size={18} />

                    Edit Service
                </button>
            </div>

            {/* INFO CARD */}

            <ServiceInfoCard
                service={service}
            />

            {/* RECENT BOOKINGS */}

            <RecentBookingsTable
                bookings={[
                    {
                        customer_name:
                            "Emma Johnson",

                        date:
                            "24 May 2024, 02:30 PM",

                        amount:
                            350,

                        status:
                            "completed",
                    },

                    {
                        customer_name:
                            "Olivia Smith",

                        date:
                            "24 May 2024, 11:00 AM",

                        amount:
                            350,

                        status:
                            "completed",
                    },

                    {
                        customer_name:
                            "Sophia Davis",

                        date:
                            "23 May 2024, 10:45 AM",

                        amount:
                            350,

                        status:
                            "confirmed",
                    },
                ]}
            />
        </div>
    );
}