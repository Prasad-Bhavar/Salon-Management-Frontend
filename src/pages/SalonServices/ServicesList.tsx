import {
    useNavigate,
} from "react-router-dom";

import {
    Eye,
    Pencil,
    Plus,
} from "lucide-react";

import {
    useOwnerServices,
} from "./useOwnerServices";

import StatsCards from "~/components/StatsCards";

import StatusBadge from "~/components/StatusBadge";

export default function ServicesList() {

    const navigate =
        useNavigate();


    const {
        services,
        stats,
    } = useOwnerServices();

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">

                        Services & Pricing
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                        Manage salon services,
                        pricing and duration.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate(
                            "/salon-services/create"
                        )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
                >
                    <Plus size={18} />

                    Add Service
                </button>
            </div>

            <StatsCards
                stats={stats}
            />

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead>

                            <tr className="border-b border-gray-100 dark:border-white/[0.05]">

                                <th className="px-5 py-4 text-left text-sm font-medium text-gray-500">

                                    Service
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-medium text-gray-500">

                                    Category
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-medium text-gray-500">

                                    Price
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-medium text-gray-500">

                                    Duration
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-medium text-gray-500">

                                    Status
                                </th>

                                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">

                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {services.map(
                                (item) => (

                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-100 dark:border-white/[0.05]"
                                    >

                                        <td className="px-5 py-4">

                                            <div>

                                                <p className="font-medium text-gray-800 dark:text-white/90">

                                                    {
                                                        item.service
                                                            ?.name
                                                    }
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">

                                            {
                                                item.service
                                                    ?.category
                                                    ?.name
                                            }
                                        </td>

                                        <td className="px-5 py-4">

                                            ₹
                                            {item.price}
                                        </td>

                                        <td className="px-5 py-4">

                                            {
                                                item.duration
                                            }{" "}
                                            mins
                                        </td>

                                        <td className="px-5 py-4">

                                            <StatusBadge
                                                status={
                                                    item.status
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex items-center justify-end gap-2">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/salon-services/view/${item.id}`
                                                        )
                                                    }
                                                    className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/salon-services/edit/${item.id}`
                                                        )
                                                    }
                                                    className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}