import {
    Calendar,
    Clock3,
    IndianRupee,
} from "lucide-react";

import StatusBadge from "~/components/StatusBadge";

interface Props {
    service: any;
}

export default function ServiceInfoCard({
    service,
}: Props) {

    return (

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

            <div className="flex items-start justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">

                            {
                                service?.service
                                    ?.name
                            }
                        </h2>

                        <StatusBadge
                            status={
                                service?.status
                            }
                        />
                    </div>

                    <p className="mt-2 text-sm text-gray-500">

                        {
                            service?.service
                                ?.category
                                ?.name
                        }
                    </p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">

                <div className="rounded-xl border border-gray-100 p-4 dark:border-white/[0.05]">

                    <div className="flex items-center gap-2 text-gray-500">

                        <IndianRupee
                            size={16}
                        />

                        <span className="text-sm">
                            Price
                        </span>
                    </div>

                    <h4 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white/90">

                        ₹
                        {
                            service?.price
                        }
                    </h4>
                </div>

                <div className="rounded-xl border border-gray-100 p-4 dark:border-white/[0.05]">

                    <div className="flex items-center gap-2 text-gray-500">

                        <Clock3
                            size={16}
                        />

                        <span className="text-sm">
                            Duration
                        </span>
                    </div>

                    <h4 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white/90">

                        {
                            service?.duration
                        }{" "}
                        mins
                    </h4>
                </div>

                <div className="rounded-xl border border-gray-100 p-4 dark:border-white/[0.05]">

                    <div className="flex items-center gap-2 text-gray-500">

                        <Calendar
                            size={16}
                        />

                        <span className="text-sm">
                            Created At
                        </span>
                    </div>

                    <h4 className="mt-2 text-sm font-semibold text-gray-800 dark:text-white/90">

                        {new Date(
                            service?.created_at
                        ).toLocaleDateString()}
                    </h4>
                </div>

                <div className="rounded-xl border border-gray-100 p-4 dark:border-white/[0.05]">

                    <div className="flex items-center gap-2 text-gray-500">

                        <Calendar
                            size={16}
                        />

                        <span className="text-sm">
                            Last Updated
                        </span>
                    </div>

                    <h4 className="mt-2 text-sm font-semibold text-gray-800 dark:text-white/90">

                        {new Date(
                            service?.updated_at
                        ).toLocaleDateString()}
                    </h4>
                </div>
            </div>

            {service?.description && (

                <div className="mt-8">

                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">

                        Description
                    </h3>

                    <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">

                        {
                            service.description
                        }
                    </p>
                </div>
            )}
        </div>
    );
}